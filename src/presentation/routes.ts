import { Router } from 'express';
import { UserRoutes } from './user/routes';
import { RepairRoutes } from './repair/routes';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/api/user', UserRoutes.routes);
		router.use('/api/repair', RepairRoutes.routes);

		return router;
	}
}
