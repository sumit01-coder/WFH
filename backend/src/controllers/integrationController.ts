import { Request, Response } from 'express';
import { google } from 'googleapis';
import prisma from '../utils/prisma';
import { encrypt } from '../utils/crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// Define scopes required for Gmail Integration
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email'
];

export const connectGmail = async (req: Request, res: Response) => {
  try {
    // Generate an authorization URL
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Gets the refresh token
      prompt: 'consent', // Force consent to ensure we get a refresh token
      scope: SCOPES,
      // Pass the user ID in the state parameter to know who is connecting
      state: (req as any).user?.id
    });
    
    res.json({ url });
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error);
    res.status(500).json({ error: 'Failed to initiate Gmail connection' });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code, state: userId, error } = req.query;

    if (error) {
      console.error('Google OAuth Error:', error);
      // Redirect to frontend settings with error
      return res.redirect(`${process.env.FRONTEND_URL}/settings?error=gmail_connection_failed`);
    }

    if (!code || !userId) {
      return res.redirect(`${process.env.FRONTEND_URL}/settings?error=invalid_request`);
    }

    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code as string);
    
    oauth2Client.setCredentials(tokens);

    // Fetch user's email address from Google to save it
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    if (!userInfo.data.email) {
      return res.redirect(`${process.env.FRONTEND_URL}/settings?error=missing_email`);
    }

    // Encrypt the tokens before storing
    const encryptedAccessToken = tokens.access_token ? encrypt(tokens.access_token) : null;
    const encryptedRefreshToken = tokens.refresh_token ? encrypt(tokens.refresh_token) : null;

    // Update the user record in database
    await prisma.user.update({
      where: { id: userId as string },
      data: {
        gmailConnected: true,
        gmailEmail: userInfo.data.email,
        ...(encryptedAccessToken && { gmailAccessToken: encryptedAccessToken }),
        ...(encryptedRefreshToken && { gmailRefreshToken: encryptedRefreshToken })
      }
    });

    // Redirect to frontend settings with success message
    res.redirect(`${process.env.FRONTEND_URL}/settings?success=gmail_connected`);
  } catch (error) {
    console.error('Error in Google OAuth Callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/settings?error=gmail_connection_failed`);
  }
};

export const disconnectGmail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await prisma.user.update({
      where: { id: userId },
      data: {
        gmailConnected: false,
        gmailEmail: null,
        gmailAccessToken: null,
        gmailRefreshToken: null
      }
    });

    res.json({ message: 'Gmail disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting Gmail:', error);
    res.status(500).json({ error: 'Failed to disconnect Gmail' });
  }
};

export const getGmailStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gmailConnected: true, gmailEmail: true }
    });

    res.json({
      connected: !!user?.gmailConnected,
      email: user?.gmailEmail || null
    });
  } catch (error) {
    console.error('Error getting Gmail status:', error);
    res.status(500).json({ error: 'Failed to get Gmail status' });
  }
};
