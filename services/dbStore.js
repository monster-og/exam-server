// Netlify Database storage for the JSON collections (students, results, questions, teachers).
// The function filesystem is temporary, so on Netlify every record lives as its own row in Postgres.
// Route handlers keep using the synchronous readJSON/writeJSON helpers: data is refreshed from the
// database before each request, and writes are flushed to the database before the response is sent.
const fs = require('fs');
const path = require('path');
const { getDatabase } = require('@netlify/database');

// Array collections are keyed by item id; object collections by their top-level keys
const COLLECTIONS = {
  students: 'array',
  results: 'array',
  questions: 'object',
  teachers: 'array'
};

// The function bundler may move this file, so also look relative to the working directory
const SEED_DIR = [path.join(__dirname, '..', 'data'), path.join(process.cwd(), 'data'), path.join(__dirname, 'data')]
  .find(d => fs.existsSync(path.join(d, 'students.json'))) || path.join(__dirname, '..', 'data');

let db = null;
function getDb() {
  if (!db) db = getDatabase();
  return db;
}

// name -> { sig, rows: Map<key, { data, hash }> } (rows kept in insertion order)
const cache = {};
let seeded = false;
let writeQueue = Promise.resolve();
let pendingWrites = 0;
let lastWriteError = null;

// Key-order independent JSON, so unchanged records are never rewritten
function stableStringify(value) {
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort()
      .filter(k => value[k] !== undefined)
      .map(k => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') + '}';
  }
  return JSON.stringify(value === undefined ? null : value);
}

function toEntries(name, data) {
  if (COLLECTIONS[name] === 'array') {
    const list = Array.isArray(data) ? data : [];
    return list.map((item, i) => [item && item.id != null ? String(item.id) : `__idx_${i}`, item]);
  }
  return Object.entries(data && typeof data === 'object' ? data : {});
}

function fromRows(name, rows) {
  // Parse from the stored text so callers always get a fresh copy they can mutate
  if (COLLECTIONS[name] === 'array') {
    return Array.from(rows.values(), r => JSON.parse(r.json));
  }
  const obj = {};
  for (const [key, r] of rows) obj[key] = JSON.parse(r.json);
  return obj;
}

function makeRow(value) {
  return { json: JSON.stringify(value === undefined ? null : value), hash: stableStringify(value) };
}

async function ensureSeeded() {
  if (seeded) return;
  const pool = getDb().pool;
  for (const name of Object.keys(COLLECTIONS)) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const claim = await client.query(
        'INSERT INTO seeded_collections (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING name',
        [name]
      );
      if (claim.rowCount > 0) {
        const seedFile = path.join(SEED_DIR, `${name}.json`);
        const seedData = fs.existsSync(seedFile) ? JSON.parse(fs.readFileSync(seedFile, 'utf8')) : null;
        const entries = toEntries(name, seedData);
        if (entries.length) {
          await client.query(
            `INSERT INTO records (collection, key, data)
             SELECT $1, t.k, t.d::jsonb FROM unnest($2::text[], $3::text[]) WITH ORDINALITY AS t(k, d, ord)
             ORDER BY t.ord
             ON CONFLICT (collection, key) DO NOTHING`,
            [name, entries.map(e => e[0]), entries.map(e => JSON.stringify(e[1]))]
          );
        }
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      throw e;
    } finally {
      client.release();
    }
  }
  seeded = true;
}

// Reload only the collections that changed since this instance last saw them
async function refresh() {
  await writeQueue;
  await ensureSeeded();
  const sql = getDb().sql;
  const sigRows = await sql`
    SELECT collection, count(*)::int AS n, max(updated_at)::text AS m, max(seq)::text AS s
    FROM records GROUP BY collection`;
  const sigs = {};
  for (const r of sigRows) sigs[r.collection] = `${r.n}|${r.m}|${r.s}`;

  for (const name of Object.keys(COLLECTIONS)) {
    const sig = sigs[name] || 'empty';
    if (cache[name] && cache[name].sig === sig) continue;
    const rows = await sql`SELECT key, data::text AS data FROM records WHERE collection = ${name} ORDER BY seq`;
    const map = new Map();
    for (const r of rows) {
      const value = JSON.parse(r.data);
      map.set(r.key, { json: r.data, hash: stableStringify(value) });
    }
    cache[name] = { sig, rows: map };
  }
}

function read(name, fallback) {
  const entry = cache[name];
  if (!entry) return fallback;
  return fromRows(name, entry.rows);
}

function write(name, data) {
  const prev = cache[name] ? cache[name].rows : new Map();
  const next = new Map();
  const upserts = [];
  for (const [key, value] of toEntries(name, data)) {
    const row = makeRow(value);
    next.set(key, row);
    const old = prev.get(key);
    if (!old || old.hash !== row.hash) upserts.push([key, row.json]);
  }
  const deletes = [...prev.keys()].filter(k => !next.has(k));
  // Signature is now stale, so the next request reloads this collection from the database
  cache[name] = { sig: 'local', rows: next };
  if (!upserts.length && !deletes.length) return;

  pendingWrites++;
  writeQueue = writeQueue.then(async () => {
    const client = await getDb().pool.connect();
    try {
      await client.query('BEGIN');
      if (deletes.length) {
        await client.query('DELETE FROM records WHERE collection = $1 AND key = ANY($2::text[])', [name, deletes]);
      }
      if (upserts.length) {
        await client.query(
          `INSERT INTO records (collection, key, data)
           SELECT $1, t.k, t.d::jsonb FROM unnest($2::text[], $3::text[]) WITH ORDINALITY AS t(k, d, ord)
           ORDER BY t.ord
           ON CONFLICT (collection, key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
          [name, upserts.map(u => u[0]), upserts.map(u => u[1])]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      console.error(`dbStore write error (${name}):`, e.message);
      lastWriteError = e;
      delete cache[name];
    } finally {
      client.release();
      pendingWrites--;
    }
  });
}

// Express middleware: load fresh data before the route, flush writes before responding
function middleware(req, res, next) {
  refresh().then(() => {
    const originalSend = res.send.bind(res);
    res.send = function (body) {
      if (pendingWrites === 0 && !lastWriteError) return originalSend(body);
      writeQueue.then(() => {
        if (lastWriteError) {
          lastWriteError = null;
          res.status(500).type('json');
          return originalSend(JSON.stringify({ success: false, message: 'Could not save data, please try again.' }));
        }
        originalSend(body);
      });
      return res;
    };
    next();
  }).catch(err => {
    console.error('dbStore refresh error:', err.message);
    res.status(503).json({ success: false, message: 'Database is not available right now, please try again.' });
  });
}

module.exports = { middleware, read, write };
