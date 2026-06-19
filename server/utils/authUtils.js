// // FILE: server/utils/authUtils.js
// import crypto from 'crypto';

// const getSecret = () => process.env.ADMIN_JWT_SECRET || process.env.AUTH_SECRET || 'change-this-in-production';

// export const safeCompare = (a, b) => {
//   const strA = String(a ?? '');
//   const strB = String(b ?? '');
//   if (strA.length !== strB.length) return false;
//   try {
//     return crypto.timingSafeEqual(Buffer.from(strA), Buffer.from(strB));
//   } catch {
//     return false;
//   }
// };

// export const createAuthToken = (payload) => {
//   const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
//   const body   = Buffer.from(JSON.stringify({
//     ...payload,   
//     iat: Date.now(),
//     exp: Date.now() + 86400000,
//   })).toString('base64url');
//   const signature = crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest('base64url');
//   return `${header}.${body}.${signature}`;
// };

// export const verifyAuthToken = (token) => {
//   if (!token || typeof token !== 'string') throw new Error('No token provided');
//   const parts = token.split('.');
//   if (parts.length !== 3) throw new Error('Invalid token format');
//   const [header, body, signature] = parts;
//   const expectedSig = crypto.createHmac('sha256', getSecret()).update(`${header}.${body}`).digest('base64url');
//   if (!safeCompare(signature, expectedSig)) throw new Error('Invalid token signature');
//   const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
//   if (!payload.exp || Date.now() > payload.exp) throw new Error('Token expired');
//   return payload;
// };

// export const requireRole = (allowedRoles) => (req, res, next) => {
//   try {
//     const header = req.headers.authorization || '';
//     const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
//     if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });
//     const payload = verifyAuthToken(token);
//     const roles   = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
//     if (!roles.includes(payload.role)) {
//       return res.status(403).json({ success: false, message: 'Access denied.' });
//     }
//     req.authUser = payload;
//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
//   }
// };

// export const requireAdmin = requireRole('admin');
// export const requireStaff = requireRole(['admin', 'staff']);
// export const requireAuth  = requireRole(['admin', 'staff', 'customer']);



// FILE: server/utils/authUtils.js
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ── Secret resolution ─────────────────────────────────────────────────────────
const getSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET / ADMIN_JWT_SECRET is not set in environment variables.');
  }
  return secret;
};

// Token lifetime — "7 days, same browser" as requested.
// jsonwebtoken accepts human-readable strings like '7d', '24h', '15m'.
const TOKEN_EXPIRY = process.env.AUTH_TOKEN_EXPIRY || '7d';

// ── Timing-safe string compare (unchanged — already safe) ────────────────────
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

// ── Create JWT (now using the real, audited `jsonwebtoken` library) ──────────
// Why switch from the custom HMAC implementation:
//   - jsonwebtoken is the de-facto standard, maintained, and handles edge cases
//     (clock skew tolerance, algorithm confusion attacks, malformed token shapes)
//     that a hand-rolled implementation does not guard against by default.
//   - It was already installed in package.json but unused — no new dependency needed.
export const createAuthToken = (payload) => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: TOKEN_EXPIRY,
    algorithm: 'HS256', // explicit — prevents "alg: none" / algorithm-confusion attacks
  });
};

// ── Verify JWT ─────────────────────────────────────────────────────────────────
export const verifyAuthToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('No token provided');
  }
  // jwt.verify throws TokenExpiredError / JsonWebTokenError automatically —
  // these are caught by the calling middleware below.
  return jwt.verify(token, getSecret(), { algorithms: ['HS256'] });
};

// ── Route protection middlewares (unchanged logic, same exports) ─────────────
export const requireRole = (allowedRoles) => (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const payload = verifyAuthToken(token);
    const roles   = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(payload.role)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    req.authUser = payload;
    next();
  } catch (error) {
    // Distinguish expired vs invalid for clearer frontend handling (optional, harmless)
    const message = error.name === 'TokenExpiredError'
      ? 'Your session has expired. Please log in again.'
      : 'Invalid or expired session.';
    return res.status(401).json({ success: false, message });
  }
};

export const requireAdmin = requireRole('admin');
export const requireStaff = requireRole(['admin', 'staff']);
export const requireAuth  = requireRole(['admin', 'staff', 'customer']);