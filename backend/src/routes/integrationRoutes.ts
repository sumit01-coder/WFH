import express from 'express';
import { connectGmail, googleCallback, disconnectGmail, getGmailStatus } from '../controllers/integrationController';
import { requireAuth } from '../middleware/requireAuth';

const router = express.Router();

// Route to initiate Google OAuth flow
router.get('/google/auth', requireAuth, connectGmail);

// Route for Google OAuth callback
router.get('/google/callback', googleCallback);

// Route to disconnect Gmail
router.post('/google/disconnect', requireAuth, disconnectGmail);

// Route to get Gmail status
router.get('/google/status', requireAuth, getGmailStatus);

export default router;
