export const RATE_LIMIT = {
  COMMENT: { limit: 5, ttl: 60000 },
  LOGIN: { limit: 3, ttl: 60000 },
  REGISTER: { limit: 3, ttl: 60000 },
  RECOVERY: { limit: 3, ttl: 60000 },
  RECOVERY_URL: { limit: 3, ttl: 60000 },
  OTP: { limit: 3, ttl: 60000 },
  VERIFY: { limit: 3, ttl: 60000 },
  DELETE_COURSE: { limit: 5, ttl: 60 * 60 * 24 * 1000 },
};
