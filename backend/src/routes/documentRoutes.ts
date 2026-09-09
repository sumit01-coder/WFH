import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { getDocuments, uploadDocument, downloadDocument } from '../controllers/documentController';
import multer from 'multer';
import fs from 'fs';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/documents';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Everyone can view documents
router.get('/', requireAuth, getDocuments as any);

// Everyone can download documents
router.get('/:id/download', requireAuth, downloadDocument as any);

// Only Managers, HR, Company Admins can upload
router.post('/upload', requireAuth, requireRole('HR', 'MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN'), upload.single('document'), uploadDocument as any);

export default router;
