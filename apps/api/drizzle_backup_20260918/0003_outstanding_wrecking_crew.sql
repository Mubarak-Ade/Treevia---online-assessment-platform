ALTER TABLE "assessments" ALTER COLUMN "published_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;