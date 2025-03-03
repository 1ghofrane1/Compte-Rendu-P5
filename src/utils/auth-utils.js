import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    // ... autres claims
  };
  const options = {
    expiresIn: '1h',
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
