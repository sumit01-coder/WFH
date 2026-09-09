import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { getCompanyProfile, updateCompanyProfile, uploadCompanyLogo, getAllCompanies } from '../controllers/companyController';

const router = Router();

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Super admin only — get all companies
router.get('/', requireAuth, requireRole('SUPER_ADMIN'), getAllCompanies as any);
// Any authenticated user can read their own company — ownership enforced in controller
router.get('/:companyId', requireAuth, getCompanyProfile as any);
// Only Company Admin or Super Admin can update company profile
router.put('/:companyId', requireAuth, requireRole('COMPANY_ADMIN', 'HR', 'SUPER_ADMIN'), updateCompanyProfile as any);
// Only Company Admin or Super Admin can upload logo
router.post('/:companyId/logo', requireAuth, requireRole('COMPANY_ADMIN', 'SUPER_ADMIN'), upload.single('logo'), uploadCompanyLogo as any);

export default router;
