import { Router } from 'express';
import { UserService } from '../services/user.service';
import { RepairService } from '../services/repair.service';
import { RepairController } from './controller';
import { AuthMiddleWare } from '../middlewares/auth.middleware';

export class RepairRoutes {
	static get routes(): Router {
		const router = Router();

		const userService = new UserService();
		const repairService = new RepairService(userService);
		const repairController = new RepairController(repairService);

		router.use(AuthMiddleWare.protect);
		router.post('/', repairController.createRepair);
		router.get('/', repairController.getPendingRepairs);
		router.get('/:id', repairController.getOneRepair);
		router.patch('/:id', repairController.completeRepair);
		router.delete('/:id', repairController.cancellRepair);

		return router;
	}
}
