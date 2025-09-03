-- CreateEnum
CREATE TYPE "credits_status" AS ENUM ('unpaid', 'partial', 'paid');

-- CreateTable
CREATE TABLE "creditors" (
    "creditor_id" SERIAL NOT NULL,
    "created_by" INTEGER NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20),
    "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creditors_pkey" PRIMARY KEY ("creditor_id")
);

-- CreateTable
CREATE TABLE "credits" (
    "credit_id" SERIAL NOT NULL,
    "credited_by" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "amount" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" "credits_status" DEFAULT 'unpaid',

    CONSTRAINT "credits_pkey" PRIMARY KEY ("credit_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "credit_id" INTEGER NOT NULL,
    "amount_paid" DECIMAL(10,2) NOT NULL,
    "paid_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "phone_number" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "user_id_idx" ON "creditors"("created_by");

-- CreateIndex
CREATE INDEX "created_by_idx" ON "credits"("created_by");

-- CreateIndex
CREATE INDEX "credited_by_idx" ON "credits"("credited_by");

-- CreateIndex
CREATE INDEX "credit_id_idx" ON "payments"("credit_id");

-- CreateIndex
CREATE UNIQUE INDEX "phone_number" ON "users"("phone_number");

-- AddForeignKey
ALTER TABLE "creditors" ADD CONSTRAINT "creditors_ibfk_1" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_ibfk_1" FOREIGN KEY ("credited_by") REFERENCES "creditors"("creditor_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_ibfk_2" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_ibfk_1" FOREIGN KEY ("credit_id") REFERENCES "credits"("credit_id") ON DELETE CASCADE ON UPDATE NO ACTION;
