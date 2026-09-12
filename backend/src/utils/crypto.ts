import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes (256 bits)
const ALGORITHM = 'aes-256-gcm';

export const encrypt = (text: string): string => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters)');
  }
  
  const iv = crypto.randomBytes(12);
  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:authTag:encryptedText
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

export const decrypt = (encryptedText: string): string => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 bytes (64 hex characters)');
  }

  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }

  const [ivHex, authTagHex, textHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const key = Buffer.from(ENCRYPTION_KEY, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(textHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
