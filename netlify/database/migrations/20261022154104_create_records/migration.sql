CREATE TABLE "records" (
	"collection" text,
	"key" text,
	"data" jsonb NOT NULL,
	"seq" bigserial,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "records_pkey" PRIMARY KEY("collection","key")
);
--> statement-breakpoint
CREATE TABLE "seeded_collections" (
	"name" text PRIMARY KEY,
	"seeded_at" timestamp with time zone DEFAULT now() NOT NULL
);
