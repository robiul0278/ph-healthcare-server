import express from 'express'
import { UserController } from './user.controller';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';
const router = express.Router()



router.post('/',auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),  UserController.createAdmin);

export const UserRoutes = router;