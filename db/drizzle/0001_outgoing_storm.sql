ALTER TABLE "category" ALTER COLUMN "surcharge" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "surcharge" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "show" ADD COLUMN "base_price" double precision NOT NULL;