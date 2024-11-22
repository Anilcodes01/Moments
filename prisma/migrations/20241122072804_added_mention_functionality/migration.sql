-- CreateTable
CREATE TABLE "MomentToUser" (
    "id" TEXT NOT NULL,
    "momentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MomentToUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MomentToUser_momentId_userId_key" ON "MomentToUser"("momentId", "userId");

-- AddForeignKey
ALTER TABLE "MomentToUser" ADD CONSTRAINT "MomentToUser_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "Moment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MomentToUser" ADD CONSTRAINT "MomentToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
