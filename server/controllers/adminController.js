import { createAdminToken, safeCompare, verifyAdminToken } from '../utils/adminAuth.js';

const login = async (req, res) => {
  try {
    // Credentials coming from the admin login form.
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({
        success: false,
        message: 'ADMIN_PASSWORD is not configured on the server',
      });
    }

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const validUsername = safeCompare(username, adminUsername);
    const validPassword = safeCompare(password, adminPassword);

    if (!validUsername || !validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // Send token back to frontend after successful login.
    const token = createAdminToken();
    return res.json({
      success: true,
      token,
      admin: { username: adminUsername },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const session = async (req, res) => {
  try {
    // Used when frontend reloads and wants to verify saved token.
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    const payload = verifyAdminToken(token);
    return res.json({
      success: true,
      admin: { username: payload.username },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin session' });
  }
};

export { login, session };
