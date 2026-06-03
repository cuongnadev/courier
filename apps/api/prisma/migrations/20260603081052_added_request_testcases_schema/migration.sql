-- CreateTable
CREATE TABLE "request_testcases" (
    "id" UUID NOT NULL,
    "request_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "expected_status" INTEGER NOT NULL,
    "is_positive_case" BOOLEAN NOT NULL,
    "modded_body" TEXT NOT NULL,

    CONSTRAINT "request_testcases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "request_testcases_request_id_idx" ON "request_testcases"("request_id");

-- AddForeignKey
ALTER TABLE "request_testcases" ADD CONSTRAINT "request_testcases_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
