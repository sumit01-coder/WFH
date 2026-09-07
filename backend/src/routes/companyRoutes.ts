import { Router } from 'express';
import { getCompanyProfile, updateCompanyProfile } from '../controllers/companyController';

const router = Router();

router.get('/:companyId', getCompanyProfile);
router.put('/:companyId', updateCompanyProfile);

export default router;
