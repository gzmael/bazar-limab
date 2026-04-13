import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $pl_enum$ BEGIN
    CREATE TYPE "public"."_locales" AS ENUM('pt-BR');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $pl_enum$;
  DO $pl_enum$ BEGIN
    CREATE TYPE "public"."enum_users_role" AS ENUM('operator', 'admin');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $pl_enum$;
  DO $pl_enum$ BEGIN
    CREATE TYPE "public"."enum_rooms_store_status" AS ENUM('draft', 'published', 'archived');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $pl_enum$;
  DO $pl_enum$ BEGIN
    CREATE TYPE "public"."enum_products_condition" AS ENUM('novo', 'seminovo', 'usado', 'usado_bom');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $pl_enum$;
  DO $pl_enum$ BEGIN
    CREATE TYPE "public"."enum_products_store_status" AS ENUM('draft', 'published', 'archived');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $pl_enum$;
  DO $pl_enum$ BEGIN
    CREATE TYPE "public"."enum_sales_channel_display_currency" AS ENUM('BRL');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $pl_enum$;

  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "rooms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"sort" numeric DEFAULT 0 NOT NULL,
  	"store_status" "enum_rooms_store_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "rooms_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"room_id" integer NOT NULL,
  	"price" numeric NOT NULL,
  	"condition" "enum_products_condition" NOT NULL,
  	"notes_dimensions" varchar,
  	"notes_brand" varchar,
  	"notes_year" varchar,
  	"sort" numeric DEFAULT 0 NOT NULL,
  	"store_status" "enum_products_store_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products_locales" (
  	"title" varchar NOT NULL,
  	"short_description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "sales_channel" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"whatsapp_e164" varchar NOT NULL,
  	"display_currency" "enum_sales_channel_display_currency" DEFAULT 'BRL' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "sales_channel_locales" (
  	"storefront_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DO $pl_posts$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
      ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
    END IF;
  END $pl_posts$;
  DROP TABLE IF EXISTS "posts" CASCADE;

  DROP INDEX IF EXISTS "payload_locked_documents_rels_posts_id_idx";
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "enum_users_role" DEFAULT 'operator' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "rooms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "products_id" integer;

  DO $pl_fk$ BEGIN
    ALTER TABLE "rooms_locales" ADD CONSTRAINT "rooms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $pl_fk$;
  DO $pl_fk$ BEGIN
    ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $pl_fk$;
  DO $pl_fk$ BEGIN
    ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $pl_fk$;
  DO $pl_fk$ BEGIN
    ALTER TABLE "products" ADD CONSTRAINT "products_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $pl_fk$;
  DO $pl_fk$ BEGIN
    ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $pl_fk$;
  DO $pl_fk$ BEGIN
    ALTER TABLE "sales_channel_locales" ADD CONSTRAINT "sales_channel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sales_channel"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $pl_fk$;

  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX IF NOT EXISTS "rooms_slug_idx" ON "rooms" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "rooms_updated_at_idx" ON "rooms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "rooms_created_at_idx" ON "rooms" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "rooms_locales_locale_parent_id_unique" ON "rooms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "products_gallery_order_idx" ON "products_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_gallery_parent_id_idx" ON "products_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_gallery_file_idx" ON "products_gallery" USING btree ("file_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "products_room_idx" ON "products" USING btree ("room_id");
  CREATE INDEX IF NOT EXISTS "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "sales_channel_locales_locale_parent_id_unique" ON "sales_channel_locales" USING btree ("_locale","_parent_id");

  DO $pl_fk$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $pl_fk$;
  DO $pl_fk$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rooms_fk" FOREIGN KEY ("rooms_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $pl_fk$;
  DO $pl_fk$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL; END $pl_fk$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_rooms_id_idx" ON "payload_locked_documents_rels" USING btree ("rooms_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "posts_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rooms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rooms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sales_channel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sales_channel_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media" CASCADE;
  DROP TABLE "rooms" CASCADE;
  DROP TABLE "rooms_locales" CASCADE;
  DROP TABLE "products_gallery" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "sales_channel" CASCADE;
  DROP TABLE "sales_channel_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_media_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_rooms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";
  
  DROP INDEX "payload_locked_documents_rels_media_id_idx";
  DROP INDEX "payload_locked_documents_rels_rooms_id_idx";
  DROP INDEX "payload_locked_documents_rels_products_id_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "rooms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "products_id";
  DROP TYPE IF EXISTS "public"."_locales";
  DROP TYPE IF EXISTS "public"."enum_users_role";
  DROP TYPE IF EXISTS "public"."enum_rooms_store_status";
  DROP TYPE IF EXISTS "public"."enum_products_condition";
  DROP TYPE IF EXISTS "public"."enum_products_store_status";
  DROP TYPE IF EXISTS "public"."enum_sales_channel_display_currency";`)
}
