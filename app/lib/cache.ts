// app/lib/cache.ts
import { redis } from "./redis";


const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

function reviveDates(_key: string, value: unknown) {
  if (typeof value === "string" && ISO_DATE_RE.test(value)) {
    return new Date(value);
  }
  return value;
}

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached, reviveDates) as T;
    }
  } catch (err) {
    console.error("Redis read failed, falling back to DB:", err);
  }

  const fresh = await fetcher();

  try {
    await redis.set(key, JSON.stringify(fresh), "EX", ttlSeconds);
  } catch (err) {
    console.error("Redis write failed (non-fatal):", err);
  }

  return fresh;
}

export async function invalidateCache(keyOrPattern: string) {
  try {
    if (keyOrPattern.includes("*")) {
      const keys = await redis.keys(keyOrPattern);
      if (keys.length) await redis.del(...keys);
    } else {
      await redis.del(keyOrPattern);
    }
  } catch (err) {
    console.error("Redis invalidation failed:", err);
  }
}
