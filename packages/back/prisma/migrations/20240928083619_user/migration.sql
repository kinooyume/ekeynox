-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'AUTO');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('EN', 'FR');

-- CreateEnum
CREATE TYPE "KeyboardLayout" AS ENUM ('AZERTY', 'QWERTY');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "theme" "Theme" NOT NULL DEFAULT 'AUTO',
    "locale" "Locale" NOT NULL DEFAULT 'EN',
    "keyboardLayout" "KeyboardLayout" NOT NULL DEFAULT 'QWERTY',
    "showKb" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCredential" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCredential_email_key" ON "UserCredential"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserCredential_userId_key" ON "UserCredential"("userId");

-- AddForeignKey
ALTER TABLE "UserCredential" ADD CONSTRAINT "UserCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
