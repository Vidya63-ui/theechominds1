import jwt from "jsonwebtoken";

/** JWT from employee OTP flow: `{ email, role: \"employee\" }` */
export function requireEmployee(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Sign in with your work email." });
  }
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "employee" || !decoded.email) {
      return res.status(403).json({ message: "Employee access only." });
    }
    req.employee = { email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Please sign in again." });
  }
}
