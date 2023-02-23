export {};
const Redis = require("ioredis");
const redisClient = new Redis({
  username: "red-cfrkqicgqg46pjv1gee0",
  host: "frankfurt-redis.render.com",
  password: "fLV7IC808I99jDRjd4lcvpc9R0udS0To",
  port: 6379,
  tls: true,
});
// const redisURL =
//   "rediss://red-cfrkqicgqg46pjv1gee0:fLV7IC808I99jDRjd4lcvpc9R0udS0To@frankfurt-redis.render.com:6379";

//const redisClient = new Redis(redisURL);

redisClient.on("error", (error) => {
  console.error("Redis client error:", error);
});

module.exports = redisClient;
//rediss://red-cfrkqicgqg46pjv1gee0:fLV7IC808I99jDRjd4lcvpc9R0udS0To@frankfurt-redis.render.com:6379
