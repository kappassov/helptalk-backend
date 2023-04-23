export {};
const Redis = require("ioredis");
const redisClient = new Redis({
  username: process.env.REDIS_USER,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT,
  tls: true,
});

redisClient.on("error", (error) => {
  console.error("Redis client error:", error);
});

module.exports = redisClient;

