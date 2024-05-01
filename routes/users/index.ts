import express, { Router } from 'express';
import { getUsers } from '../../controllers/users';
import { protectedRoute } from '../../middleware/protect-route';

const router: Router = express.Router();

router.get('/', protectedRoute, getUsers);

export default router;
