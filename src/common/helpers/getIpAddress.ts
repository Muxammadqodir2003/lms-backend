import type { Request } from 'express';

export const getClientIp = (req: Request) => {
  // Agar proxy (Nginx) bo'lsa, birinchi IPni oladi, aks holda oddiy remoteAddress
  const xForwardedFor = req.headers['x-forwarded-for'] as string;
  const ip = xForwardedFor
    ? xForwardedFor.split(',')[0]
    : req.ip || req.socket.remoteAddress;

  // ::1 ni 127.0.0.1 ga o'zgartirib olish (test uchun qulay)
  return ip === '::1' ? '127.0.0.1' : ip;
};
