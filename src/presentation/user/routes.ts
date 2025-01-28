import { Router } from 'express';
import { UserService } from '../services/user.service';
import { UserController } from './controller';
import { AuthMiddleWare } from '../middlewares/auth.middleware';

export class UserRoutes {
	static get routes(): Router {
		const router = Router();
		const userService = new UserService();
		const userController = new UserController(userService);

		router.post('/register', userController.register);
		router.post('/login', userController.login);
		router.use(AuthMiddleWare.protect);
		router.get('/', userController.findAllUsers);
		router.get('/:id', userController.findOneUser);
		router.patch('/:id', userController.updateUser);
		router.delete('/:id', userController.deleteUser);
		return router;
	}
}
