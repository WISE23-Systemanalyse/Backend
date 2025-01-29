ALTER TABLE "bookings" ADD COLUMN "token" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_token_unique" UNIQUE("token");