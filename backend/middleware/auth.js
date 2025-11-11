import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        success: false,
        message: "not authorized login again",
      });
    }

    const token = authHeader.split(" ")[1]; // Get token after "Bearer"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = decoded.id; // Attach user ID to request
    next();
  } catch (error) {
    console.error("authUser error:", error);
    res.json({ success: false, message: "not authorized login again" });
  }
};

export default authUser;
