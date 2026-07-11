export type RateLimitResult =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      retryAfterSeconds: number;
    };

export type RateLimiter = {
  check: (key: string) => Promise<RateLimitResult>;
};

export const passThroughRateLimiter: RateLimiter = {
  async check() {
    return { allowed: true };
  },
};
