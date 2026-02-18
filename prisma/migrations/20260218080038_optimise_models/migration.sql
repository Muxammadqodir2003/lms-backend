-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "commentsCount" INTEGER DEFAULT 0,
ADD COLUMN     "studentsCount" INTEGER DEFAULT 0,
ADD COLUMN     "totalDuration" INTEGER DEFAULT 0,
ADD COLUMN     "totalLessons" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "InstructorProfile" ADD COLUMN     "coursesCount" INTEGER DEFAULT 0,
ADD COLUMN     "studentsCount" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "lessonsCount" INTEGER DEFAULT 0,
ADD COLUMN     "totalDuration" INTEGER DEFAULT 0,
ADD COLUMN     "totalLessons" INTEGER DEFAULT 0;

-- CreateIndex
CREATE INDEX "Course_category_idx" ON "Course"("category");

-- CreateIndex
CREATE INDEX "Course_level_idx" ON "Course"("level");

-- CreateIndex
CREATE INDEX "Course_language_idx" ON "Course"("language");

-- CreateIndex
CREATE INDEX "Course_isPublished_category_idx" ON "Course"("isPublished", "category");

-- CreateIndex
CREATE INDEX "Course_isPublished_rating_idx" ON "Course"("isPublished", "rating");
