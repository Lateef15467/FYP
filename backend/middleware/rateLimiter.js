// rateLimiter.js
import rateLimit from "express-rate-limit";
// Create a reusable rate limiter function
const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: message || "Too many requests, slow down!",
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// module.exports = createLimiter;
export default createLimiter;
