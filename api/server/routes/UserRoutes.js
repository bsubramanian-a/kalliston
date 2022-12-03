import { Router } from 'express';
import { signup, login } from '../controllers/UserController';
import saveUser from '../middleware/userAuth';

const router = Router();

// router.get('/', UserController.getAllUsers);
// router.post('/', UserController.addUser);
// router.get('/:id', UserController.getAUser);
// router.put('/:id', UserController.updatedUser);
// router.delete('/:id', UserController.deleteUser);

router.post('/register',saveUser,signup);
router.post('/login',login)

export default router;