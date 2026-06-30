const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  message: {
    message: "Too many login attempts. Try again after 15 minutes.",
  },
});

module.exports = authLimiter;