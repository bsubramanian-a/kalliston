import { Router } from 'express';
import { createCoach, coachLogin, coachForget, updateProfile, getAllUsers, checkOTP, checkOTPForget } from '../controllers/UserController';
import { checkCoachAlreadyExist } from '../middleware/userAuth';

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
router.post('/coach-forget',coachForget);
router.post('/coach-otp-forget',checkOTPForget);
router.put('/updateProfile',updateProfile);

export default router;