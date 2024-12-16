ALTER TABLE "movie" ALTER COLUMN "year" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "movie" ADD CONSTRAINT "movie_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "show" ADD CONSTRAINT "show_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "seat" ADD CONSTRAINT "seat_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "hall" ADD CONSTRAINT "hall_id_unique" UNIQUE("id");