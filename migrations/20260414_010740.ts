import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms" ADD COLUMN "icon_id" integer;
  ALTER TABLE "products" ADD COLUMN "max_purchase_qty" numeric DEFAULT 99 NOT NULL;
  ALTER TABLE "products" ADD COLUMN "featured" boolean DEFAULT false;
  ALTER TABLE "products" ADD COLUMN "family_pick" boolean DEFAULT false;
  ALTER TABLE "rooms" ADD CONSTRAINT "rooms_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "rooms_icon_idx" ON "rooms" USING btree ("icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms" DROP CONSTRAINT "rooms_icon_id_media_id_fk";
  
  DROP INDEX "rooms_icon_idx";
  ALTER TABLE "rooms" DROP COLUMN "icon_id";
  ALTER TABLE "products" DROP COLUMN "max_purchase_qty";
  ALTER TABLE "products" DROP COLUMN "featured";
  ALTER TABLE "products" DROP COLUMN "family_pick";`)
}
