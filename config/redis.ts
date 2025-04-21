import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisConfig = createClient({
  url:
    process.env.REDIS_URL ||
    `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisConfig.on("error", (err: any) => console.error("Redis Client Error", err));

(async () => {
  try {
    if (!redisConfig.isOpen) {
      await redisConfig.connect();
      console.log("Connected to Redis");
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

export default redisConfig;
