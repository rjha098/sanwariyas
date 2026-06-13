// FILE: server/utils/authUtils.js
import crypto from 'crypto';

const getSecret = () => process.env.ADMIN_JWT_SECRET || process.env.AUTH_SECRET || 'change-this-in-production';

export const safeCompare = (a, b) => {
  const strA = String(a ?? '');
  const strB = String(b ?? '');
  if (strA.length !== strB.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(strA), Buffer.from(strB));
  } catch {
    return false;
  }
};

export const createAuthToken = (payload) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body   = Buffer.from(JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + 86400000,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
};

export const verifyAuthToken = (token) => {
  if (!token || typeof token !== 'string') throw new Error('No token provided');
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest('base64url');
  if (!safeCompare(signature, expectedSig)) throw new Error('Invalid token signature');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  if (!payload.exp || Date.now() > payload.exp) throw new Error('Token expired');
  return payload;
};

export const requireRole = (allowedRoles) => (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const payload = verifyAuthToken(token);
    const roles   = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(payload.role)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    req.authUser = payload;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
};

export const requireAdmin = requireRole('admin');
export const requireStaff = requireRole(['admin', 'staff']);
export const requireAuth  = requireRole(['admin', 'staff', 'customer']);