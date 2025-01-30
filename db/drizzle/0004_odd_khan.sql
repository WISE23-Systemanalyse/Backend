CREATE TABLE IF NOT EXISTS "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"surcharge" double precision DEFAULT 0,
	CONSTRAINT "category_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "token" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_method" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_status" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_details" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "time_of_payment" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "seat" ADD COLUMN "category_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seat" ADD CONSTRAINT "seat_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "seat" DROP COLUMN IF EXISTS "seat_type";--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_token_unique" UNIQUE("token");