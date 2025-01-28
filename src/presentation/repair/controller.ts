import { Request, Response } from 'express';
import { RepairService } from '../services/repair.service';
import { CreateRepairDTO, CustomError } from '../../domain';

export class RepairController {
	constructor(private readonly repairService: RepairService) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ message: error.message });
		} else {
			return res.status(500).json({ message: 'Something went wrong' });
		}
	};

	createRepair = async (req: Request, res: Response) => {
		const [error, createRepairDto] = CreateRepairDTO.create(req.body);

		const user = req.body.sessionUser;

		if (error) return res.status(422).json({ message: error });

		this.repairService
			.createRepair(createRepairDto!, user)
			.then((data) => {
				return res.status(201).json(data);
			})
			.catch((error) => {
				this.handleError(error, res);
			});
	};

	getPendingAndCompletedRepairs = async (req: Request, res: Response) => {
		this.repairService
			.getPendingAndCompletedRepairs(req.body.sessionUser)
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((error) => {
				this.handleError(error, res);
			});
	};

	getOneRepair = async (req: Request, res: Response) => {
		this.repairService
			.getOneRepair(req.params.id)
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((error) => {
				this.handleError(error, res);
			});
	};

	completeRepair = async (req: Request, res: Response) => {
		this.repairService
			.completeRepair(req.params.id, req.body.sessionUser)
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((error) => {
				this.handleError(error, res);
			});
	};

	cancellRepair = async (req: Request, res: Response) => {
		this.repairService
			.cancellRepair(req.params.id, req.body.sessionUser)
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((error) => {
				this.handleError(error, res);
			});
	};

	getRepairsByClient = async (req: Request, res: Response) => {
		this.repairService
			.getRepairsByClient(req.params.id, req.body.sessionUser)
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((error) => {
				this.handleError(error, res);
			});
	};
}
