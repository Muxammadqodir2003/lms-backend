export const RATE_LIMIT = {
  COMMENT: { limit: 5, ttl: 60 },
  LOGIN: { limit: 3, ttl: 60 },
  REGISTER: { limit: 3, ttl: 60 },
  RECOVERY: { limit: 3, ttl: 60 },
  OTP: { limit: 3, ttl: 60 },
  VERIFY: { limit: 3, ttl: 60 },
  DELETE_COURSE: { limit: 5, ttl: 60 * 60 * 24 },
};
