import jwt from "jsonwebtoken";

export const authSeller = async (req, res, next) => {
  try {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const decoded = jwt.verify(
      sellerToken,
      process.env.JWT_SECRET
    );

    // Make sure the token belongs to a seller
    if (decoded.role !== "seller") {
      return res.status(403).json({
        message: "Forbidden",
        success: false,
      });
    }

    // Store seller ID for controllers
    req.seller = decoded.id;

    next();
  } catch (error) {
    console.error("Error in authSeller middleware:", error);

    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }
};