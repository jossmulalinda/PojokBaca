import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'hmti-secret-key';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export async function comparePassword(password, hash) {
  if (!hash || !password) return false;
  const normalizedHash = hash.replace(/^\$2[ay]\$/, '$2b$');
  return bcrypt.compareSync(password, normalizedHash) || bcrypt.compareSync(password, hash);
}

export function getAuthUser(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function validateApiKey(request) {
  const apiKey = request.headers.get('P3RT-HMTI-API-KEY');
  return apiKey === process.env.HMTI_API_KEY;
}
