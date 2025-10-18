import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export function generateToken(userId) {
  return jwt.sign({ userId }, SECRET, { expiresIn: "24h" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch (err) {
    return null
  }
}

export function extractToken(authHeader) {
  if (!authHeader) return null
  const parts = authHeader.split(" ")
  return parts.length === 2 ? parts[1] : null
}
