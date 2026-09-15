// app/lib/redis.ts
import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 1,
    connectTimeout: 5000, // give up connecting after 5s
    commandTimeout: 3000, // give up on a hung command after 3s -- prevents a stuck request from blocking a page render
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 200, 1000);
    },
    lazyConnect: false,
  });

// Prevents the unhandled-error console spam you're seeing -- ioredis
// requires a listener on "error" or it crashes/logs verbosely by design.
redis.on("error", (err) => {
  console.error("[redis] connection error:", err.message);
});

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
