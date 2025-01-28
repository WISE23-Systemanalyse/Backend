CREATE TABLE IF NOT EXISTS "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"show_id" integer NOT NULL,
	"seat_id" integer NOT NULL,
	"booking_time" timestamp DEFAULT now(),
	"payment_id" integer NOT NULL,
	CONSTRAINT "bookings_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hall" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"seating_capacity" integer,
	CONSTRAINT "hall_id_unique" UNIQUE("id"),
	CONSTRAINT "hall_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"year" integer NOT NULL,
	"description" varchar NOT NULL,
	"rating" double precision NOT NULL,
	"image_url" varchar NOT NULL,
	"genres" varchar[] NOT NULL,
	"duration" integer NOT NULL,
	CONSTRAINT "movie_id_unique" UNIQUE("id"),
	CONSTRAINT "movie_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" double precision NOT NULL,
	"payment_time" timestamp DEFAULT now(),
	"tax" double precision NOT NULL,
	"payment_method" varchar(255) NOT NULL,
	"payment_status" varchar(255) NOT NULL,
	"payment_details" varchar(255) NOT NULL,
	"time_of_payment" timestamp DEFAULT now(),
	CONSTRAINT "payments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservation" (
	"id" serial PRIMARY KEY NOT NULL,
	"seat_id" integer NOT NULL,
	"show_id" integer NOT NULL,
	"user_id" varchar,
	"guest_email" varchar(255),
	"guest_name" varchar(255),
	"expire_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reservation_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seat" (
	"id" serial PRIMARY KEY NOT NULL,
	"hall_id" integer NOT NULL,
	"row_number" integer NOT NULL,
	"seat_number" integer NOT NULL,
	"seat_type" varchar(50),
	CONSTRAINT "seat_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "show" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"hall_id" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	CONSTRAINT "show_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"password" varchar,
	"email" varchar NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"user_name" varchar,
	"image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_admin" boolean,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_show_id_show_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."show"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_seat_id_seat_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seat"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservation" ADD CONSTRAINT "reservation_seat_id_seat_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seat"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservation" ADD CONSTRAINT "reservation_show_id_show_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."show"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservation" ADD CONSTRAINT "reservation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seat" ADD CONSTRAINT "seat_hall_id_hall_id_fk" FOREIGN KEY ("hall_id") REFERENCES "public"."hall"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "show" ADD CONSTRAINT "show_movie_id_movie_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movie"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "show" ADD CONSTRAINT "show_hall_id_hall_id_fk" FOREIGN KEY ("hall_id") REFERENCES "public"."hall"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
