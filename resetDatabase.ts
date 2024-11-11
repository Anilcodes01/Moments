const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    await prisma.$transaction([

      prisma.media.deleteMany(),
      prisma.moment.deleteMany(),
      prisma.user.deleteMany(),
      
    ]);

    console.log("Database reset successfully.");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
