export const adminAuth = (req, res, next) => {
  const isLoggedIn = req.headers["x-admin-auth"];

  if (isLoggedIn !== "true") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};