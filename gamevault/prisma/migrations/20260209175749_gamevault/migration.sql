-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('A_JOUER', 'EN_COURS', 'TERMINE', 'ABANDONNE');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('PC', 'PS5', 'XBOX', 'SWITCH', 'MOBILE', 'AUTRE');

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'A_JOUER',
    "rating" INTEGER,
    "imageUrl" TEXT,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Game_userId_idx" ON "Game"("userId");
