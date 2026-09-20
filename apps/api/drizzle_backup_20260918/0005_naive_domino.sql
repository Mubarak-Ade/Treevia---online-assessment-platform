ALTER TABLE "question_options"
ALTER COLUMN "is_correct" DROP DEFAULT;

ALTER TABLE "question_options"
ALTER COLUMN "is_correct"
SET DATA TYPE boolean
USING CASE
    WHEN "is_correct" = 1 THEN true
    ELSE false
END;

ALTER TABLE "question_options"
ALTER COLUMN "is_correct" SET DEFAULT false;