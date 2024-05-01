import express, { Router } from 'express';
import { getMessage, sendMessage } from '../../controllers/messages';
import { protectedRoute } from '../../middleware/protect-route';

const router: Router = express.Router();

router.post('/send/:id', protectedRoute, sendMessage);
router.get('/:id', protectedRoute, getMessage);

export default router;
