import { Router } from 'express';
import { createCoach, coachLogin, coachForgetPassword, coachUpdateProfile, getAllUsers, checkOTP, checkOTPForget, coachChangePassword} from '../controllers/UserController';
import { checkCoachAlreadyExist } from '../middleware/UserAuth';
import { verifyToken } from '../middleware/AuthJWT'

const router = Router();

// router.get('/', UserController.getAllUsers);
// router.post('/', UserController.addUser);
// router.get('/:id', UserController.getAUser);
// router.put('/:id', UserController.updatedUser);
// router.delete('/:id', UserController.deleteUser);

router.get('/',getAllUsers);
router.post('/create-coach',[checkCoachAlreadyExist],createCoach);
router.post('/coach-login',coachLogin);
router.post('/coach-otp',checkOTP);
router.post('/coach-forget',coachForgetPassword);
router.post('/coach-otp-forget',checkOTPForget);
router.post('/coach-change-password',[verifyToken],coachChangePassword)
router.put('/coach-update-profile/:id',[verifyToken],coachUpdateProfile);

export default router;