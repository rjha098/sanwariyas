import express from 'express';

import { login, session } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', login);
router.get('/session', session);

export default router;
