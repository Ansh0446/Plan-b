-- =============================================================================
-- PLAN B — Milestone 4: Subject Content Layer
-- Adds subject_resource_category enum and subject_resources table.
-- =============================================================================

CREATE TYPE "subject_resource_category" AS ENUM ('NOTES', 'PYQ', 'IMPORTANT', 'VIDEO', 'SYLLABUS');

CREATE TABLE "subject_resources" (
    "id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "category" "subject_resource_category" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT,
    "external_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "subject_resources_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "subject_resources_subject_id_idx" ON "subject_resources"("subject_id");
CREATE INDEX "subject_resources_subject_id_category_idx" ON "subject_resources"("subject_id", "category");

ALTER TABLE "subject_resources" ADD CONSTRAINT "subject_resources_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;