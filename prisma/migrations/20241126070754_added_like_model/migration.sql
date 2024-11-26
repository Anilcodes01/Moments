-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "momentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_momentId_userId_key" ON "Like"("momentId", "userId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "Moment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
