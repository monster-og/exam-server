import { pgTable, text, jsonb, bigserial, timestamp, primaryKey } from "drizzle-orm/pg-core";

// Each app collection (students, results, questions, teachers) is stored as one row per record,
// so concurrent writes to different records never overwrite each other.
export const records = pgTable(
  "records",
  {
    collection: text().notNull(),
    key: text().notNull(),
    data: jsonb().notNull(),
    seq: bigserial({ mode: "number" }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.collection, t.key] })]
);

// Marks collections that have been seeded from the bundled data/*.json files
export const seededCollections = pgTable("seeded_collections", {
  name: text().primaryKey(),
  seededAt: timestamp("seeded_at", { withTimezone: true }).notNull().defaultNow(),
});
