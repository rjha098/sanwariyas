import crypto from 'crypto';

// Fallback secret for development only.
// In real usage, ADMIN_JWT_SECRET should always be set in .env.
const DEFAULT_SECRET = 'change-this-admin-secret';

const getSecret = () => process.env.ADMIN_JWT_SECRET || process.env.ADMIN_SECRET || DEFAULT_SECRET;

// Compare values safely to reduce timing-based guessing.
const safeCompare = (a, b) => {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
};

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

const decode = (value) => JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));

// Sign the token payload so the browser cannot fake admin access.
const sign = (value) => crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');

const createAdminToken = () => {
  // Create a simple 12-hour admin session token.
  const payload = {
    role: 'admin',
    username: process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin',
    exp: Date.now() + (1000 * 60 * 60 * 12),
  };

  const encodedPayload = encode(payload);
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
};

const verifyAdminToken = (token) => {
  // Token format:
  // <encodedPayload>.<signature>
  if (!token || !token.includes('.')) {
    throw new Error('Invalid token');
  }

  const [encodedPayload, signature] = token.split('.');
  const expectedSignature = sign(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    throw new Error('Invalid token signature');
  }

  const payload = decode(encodedPayload);

  if (!payload.exp || Date.now() > payload.exp) {
    throw new Error('Token expired');
  }

  if (payload.role !== 'admin') {
    throw new Error('Invalid admin token');
  }

  return payload;
};

const requireAdminAuth = (req, res, next) => {
  try {
    // Expected header:
    // Authorization: Bearer <token>
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    req.admin = verifyAdminToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin session' });
  }
};

export {
  createAdminToken,
  requireAdminAuth,
  safeCompare,
  verifyAdminToken,
};
