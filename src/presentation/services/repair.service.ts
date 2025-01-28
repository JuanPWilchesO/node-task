import { Repair, Role, Status, User } from '../../data';
import { CreateRepairDTO, CustomError } from '../../domain';
import { UserService } from './user.service';

export class RepairService {
	constructor(public readonly userService: UserService) {}

	async createRepair(repairData: CreateRepairDTO, sessionUser: User) {
		const client = await this.userService.findUserByEmail(
			repairData.clientEmail,
		);

		if (sessionUser.role !== Role.EMPLOYEE)
			throw CustomError.forbidden('Only employees can create repairs');

		if (!client) throw CustomError.notFound('Client not found');

		const repair = new Repair();

		repair.motorsNumber = repairData.motorsNumber;
		repair.description = repairData.description;
		repair.client = client;
		repair.created_by = sessionUser;

		try {
			repair.save();
		} catch (error) {
			throw CustomError.internalServer('Error creating repair');
		}
	}

	async getPendingAndCompletedRepairs(sessionUser: User) {
		const repairs = await Repair.createQueryBuilder('repair')
			.leftJoinAndSelect('repair.created_by', 'created_by')
			.leftJoinAndSelect('repair.client', 'client')
			.select([
				'repair',
				'created_by.name',
				'created_by.email',
				'client.name',
				'client.email',
			])
			.where(
				'repair.status = :pendingStatus OR repair.status = :completedStatus',
				{
					pendingStatus: Status.PENDING,
					completedStatus: Status.COMPLETED,
				},
			)
			.getMany();

		if (!repairs) throw CustomError.notFound('No repairs on database');

		if (sessionUser.role !== Role.EMPLOYEE)
			throw CustomError.forbidden(
				'Only employees can get a list of all repairs',
			);

		return repairs;
	}

	async getOneRepair(id: string) {
		const repair = await Repair.createQueryBuilder('repair')
			.leftJoinAndSelect('repair.created_by', 'created_by')
			.leftJoinAndSelect('repair.client', 'client')
			.select([
				'repair',
				'created_by.name',
				'created_by.email',
				'client.name',
				'client.email',
			])
			.where(
				'repair.status = :pendingStatus OR repair.status = :completedStatus',
				{
					pendingStatus: Status.PENDING,
					completedStatus: Status.COMPLETED,
				},
			)
			.andWhere('repair.id = :id', {
				id,
			})
			.getOne();

		if (!repair) throw CustomError.notFound('Repair not found');

		return repair;
	}

	async completeRepair(id: string, sessionUser: User) {
		const repair = await Repair.createQueryBuilder('repair')
			.where('repair.id = :id', {
				id,
			})
			.getOne();

		if (sessionUser.role !== Role.EMPLOYEE)
			throw CustomError.forbidden('Only employees can complete repairs');

		if (!repair) throw CustomError.notFound('Repair not found');
		if (repair.status === Status.CANCELLED)
			throw CustomError.badRequest('This repair was cancelled');
		if (repair.status === Status.COMPLETED)
			throw CustomError.badRequest('This repair was already completed');

		repair.status = Status.COMPLETED;

		try {
			repair.save();
			return repair;
		} catch (error) {
			throw CustomError.internalServer('Error completing repair');
		}
	}

	async cancellRepair(id: string, sessionUser: User) {
		const repair = await Repair.createQueryBuilder('repair')
			.where('repair.id = :id', {
				id,
			})
			.getOne();

		if (sessionUser.role !== Role.EMPLOYEE)
			throw CustomError.forbidden('Only employees can cancell repairs');

		if (!repair) throw CustomError.notFound('Repair not found');
		if (repair.status === Status.CANCELLED)
			throw CustomError.badRequest('This repair was already cancelled');
		if (repair.status === Status.COMPLETED)
			throw CustomError.badRequest('This repair was completed');

		repair.status = Status.CANCELLED;

		try {
			repair.save();
			return repair;
		} catch (error) {
			throw CustomError.internalServer('Error cancelling repair');
		}
	}

	async getRepairsByClient(id: string, sessionUser: User) {
		const client = await this.userService.findUserById(id);

		if (sessionUser.role !== Role.EMPLOYEE && sessionUser.id !== id)
			throw CustomError.forbidden(
				'Only employees or the client can get repairs',
			);

		if (!client) throw CustomError.notFound('Client not found');

		const repairs = await Repair.createQueryBuilder('repair')
			.leftJoinAndSelect('repair.created_by', 'created_by')
			.leftJoinAndSelect('repair.client', 'client')
			.select([
				'repair',
				'created_by.name',
				'created_by.email',
				'client.name',
				'client.email',
			])
			.where('repair.client = :client', {
				client: client.id,
			})
			.getMany();

		if (!repairs) throw CustomError.notFound('No repairs for this client');

		return repairs;
	}
}
