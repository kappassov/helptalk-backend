export {};
const {PrismaClient} =  require("@prisma/client");

// Prevent multiple instances of Prisma Client in development
declare const global: any;

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

module.exports = prisma;
