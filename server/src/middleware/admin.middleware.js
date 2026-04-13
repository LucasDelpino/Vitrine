export default function adminMiddleware(req, res, next) {
  if (!req.user || req.user.roles !== "admin") {
    return res.status(403).json({ error: "Accès interdit" });
  }

  next();
}