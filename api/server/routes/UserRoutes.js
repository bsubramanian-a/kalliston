import { Router } from 'express';
import { createCoach, coachLogin, forget, updateProfile, getAllUsers } from '../controllers/UserController';
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
router.post('/forget',forget);
router.put('/updateProfile',updateProfile);

export default router;