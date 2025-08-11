// Simple in-memory rate limiter (no external dependencies)
// Can be replaced with Redis-based rate limiting in the future if needed

const memoryRateLimiter = new Map<string, { count: number; resetTime: number }>();

export async function checkRateLimit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 3;

  const key = identifier;
  const record = memoryRateLimiter.get(key);

  if (!record || now > record.resetTime) {
    // First request or window expired
    memoryRateLimiter.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: now + windowMs,
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  memoryRateLimiter.set(key, record);

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    reset: record.resetTime,
  };
}
