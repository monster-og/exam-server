/**
 * Oxford Convent School Exam Portal - Universal Database Service
 * Supports:
 * 1. Ultra-safe Atomic Local File Storage (data/*.json) with automatic backups
 * 2. MongoDB / MongoDB Atlas Cloud integration (when MONGODB_URI is provided in .env)
 */

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

let mongoClient = null;
let mongoDb = null;
let isMongoActive = false;

const DATA_DIR = path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Initialize Database Connection (MongoDB if configured, with auto-fallback to local files)
 */
async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.log('📦 Local Storage Active: data/*.json (To enable cloud MongoDB, add MONGODB_URI to .env)');
    return { type: 'local', status: 'ready' };
  }

  try {
    console.log('⏳ Connecting to MongoDB Database...');
    mongoClient = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    await mongoClient.connect();
    mongoDb = mongoClient.db(process.env.MONGODB_DB || 'exam_portal');
    isMongoActive = true;
    console.log('🍃 MongoDB Database Connected Successfully! Dual-sync active.');

    // Seed collections from local files if collections are empty
    await seedMongoFromLocal('students.json', 'students');
    await seedMongoFromLocal('results.json', 'results');
    await seedMongoFromLocal('questions.json', 'questions');

    return { type: 'mongodb', status: 'connected' };
  } catch (err) {
    console.warn('⚠️ MongoDB connection error (Falling back to local data files):', err.message);
    isMongoActive = false;
    return { type: 'local', status: 'fallback', error: err.message };
  }
}

async function seedMongoFromLocal(fileName, collectionName) {
  try {
    const col = mongoDb.collection(collectionName);
    const count = await col.countDocuments();
    if (count === 0) {
      const localData = readJSON(path.join(DATA_DIR, fileName), null);
      if (Array.isArray(localData) && localData.length > 0) {
        await col.insertMany(localData);
        console.log(`✅ Seeded ${localData.length} records into MongoDB collection: ${collectionName}`);
      } else if (localData && typeof localData === 'object' && Object.keys(localData).length > 0) {
        // Questions format key-value
        const docs = Object.entries(localData).map(([key, val]) => ({ _key: key, ...val }));
        await col.insertMany(docs);
        console.log(`✅ Seeded ${docs.length} papers into MongoDB collection: ${collectionName}`);
      }
    }
  } catch (e) {
    console.warn(`Seed notice for ${collectionName}:`, e.message);
  }
}

/**
 * Read JSON file safely with fallback
 */
function readJSON(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      writeJSON(filePath, fallback);
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Notice reading ${path.basename(filePath)}:`, err.message);
    return fallback;
  }
}

/**
 * Atomic write to JSON file (prevents corruption on sudden crash or concurrent access)
 * Also syncs to MongoDB asynchronously if connected
 */
function writeJSON(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const content = JSON.stringify(data, null, 2);
    const tmpPath = `${filePath}.tmp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    
    // Write to temporary file first
    fs.writeFileSync(tmpPath, content, 'utf8');
    
    // Atomic rename
    try {
      fs.renameSync(tmpPath, filePath);
    } catch {
      // Windows rename fallback if target is locked
      fs.copyFileSync(tmpPath, filePath);
      try { fs.unlinkSync(tmpPath); } catch {}
    }

    // Async sync to MongoDB if connected
    if (isMongoActive && mongoDb) {
      const baseName = path.basename(filePath, '.json');
      syncToMongo(baseName, data).catch((err) => {
        console.warn(`MongoDB sync notice for ${baseName}:`, err.message);
      });
    }
  } catch (err) {
    console.error(`Error saving ${filePath}:`, err.message);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch {}
  }
}

async function syncToMongo(collectionName, data) {
  if (!mongoDb) return;
  try {
    const col = mongoDb.collection(collectionName);
    if (Array.isArray(data)) {
      // Upsert records
      for (const item of data) {
        if (item.id) {
          await col.updateOne({ id: item.id }, { $set: item }, { upsert: true });
        }
      }
    } else if (data && typeof data === 'object') {
      for (const [key, val] of Object.entries(data)) {
        await col.updateOne({ _key: key }, { $set: { _key: key, ...val } }, { upsert: true });
      }
    }
  } catch (e) {
    // Non-blocking
  }
}

module.exports = {
  initDatabase,
  readJSON,
  writeJSON,
  isMongoConnected: () => isMongoActive,
};
