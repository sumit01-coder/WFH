import { Router } from 'express';
import { getAssets, createAsset, updateAssetStatus } from '../controllers/assetController';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(requireAuth as any);
router.use(requireRole('HR', 'COMPANY_ADMIN', 'SUPER_ADMIN') as any);

router.get('/', getAssets as any);
router.post('/', createAsset as any);
router.put('/:id/status', updateAssetStatus as any);

export default router;
