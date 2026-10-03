import jwt from "jsonwebtoken";

const optionalAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: decoded.userId, role: decoded.role };
    } catch {
      // An invalid optional cookie should not block public reel browsing.
    }
  }
  next();
};

export default optionalAuth;
