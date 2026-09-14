CREATE TYPE "public"."assess_status" AS ENUM('draft', 'published', 'closed');--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"creator_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255),
	"status" "assess_status" DEFAULT 'draft' NOT NULL,
	"duration_minutes" integer NOT NULL,
	"join_code" varchar(6) NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "assessments_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;