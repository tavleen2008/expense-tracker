const attempts = new Map();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const authLimiter = (req, res, next) => {
  const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();
  const record = attempts.get(key) || { count: 0, start: now };

  if (now - record.start > WINDOW_MS) {
    attempts.set(key, { count: 1, start: now });
    return next();
  }

  if (record.count >= MAX_ATTEMPTS) {
    return res.status(429).json({
      message: "Too many login attempts. Try again after 15 minutes.",
    });
  }

  record.count += 1;
  attempts.set(key, record);
  next();
};

module.exports = authLimiter;
