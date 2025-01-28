import { Role, User, UserStatus } from '../../data';
import { RegisterUserDTO, CustomError, UpdateUserDTO } from '../../domain';
import { LoginUserDTO } from '../../domain/dtos/user/loginUser.dto';
import { encryptAdapter } from '../../config';
import { JwtAdapter } from '../../config/jwt.adapter';

export class UserService {
	constructor() {}

	async register(userData: RegisterUserDTO) {
		const user = new User();

		user.name = userData.name;
		user.email = userData.email;
		user.password = userData.password;
		user.role = userData.role;

		try {
			const newUser = await user.save();
			return {
				id: newUser.name,
				role: newUser.role,
			};
		} catch (error: any) {
			if (error.code === 'ER_DUP_ENTRY') {
				throw CustomError.badRequest('Email already in use');
			} else {
				throw CustomError.internalServer('Error creating user');
			}
		}
	}

	async login(credentials: LoginUserDTO) {
		const user = await this.findUserByEmail(credentials.email);

		const isMatch = encryptAdapter.compare(credentials.password, user.password);

		if (!isMatch) {
			throw CustomError.unAuthorized('Invalid credentials');
		}

		const token = await JwtAdapter.generateToken({ id: user.id });

		if (!token) {
			throw CustomError.internalServer('Error generating token');
		}

		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		};
	}

	async findUserByEmail(email: string) {
		const user = await User.findOne({
			where: {
				email,
				status: UserStatus.ENABLED,
			},
		});

		if (!user) {
			throw CustomError.notFound('User not found');
		}

		return user;
	}

	async findAllUsers(sessionUser: User) {
		const users = await User.createQueryBuilder('user').getMany();

		if (sessionUser.role !== Role.EMPLOYEE) {
			throw CustomError.forbidden('You are not allowed to get all users');
		}

		if (!users) {
			throw CustomError.notFound('No users in database');
		}
		return users;
	}

	async findUserById(id: string) {
		const user = await User.createQueryBuilder('user')
			.where('user.id = :userId', {
				userId: id,
			})
			.getOne();

		if (!user) {
			throw CustomError.notFound('User not found');
		}

		return user;
	}

	async updateUser(id: string, userData: UpdateUserDTO, userSession: User) {
		const user = await this.findUserById(id);

		if (!user) return CustomError.notFound('User not found');

		if (userSession.id !== user.id && userSession.role !== Role.EMPLOYEE)
			return CustomError.forbidden('You are not allowed to update this user');

		user.name = userData.name;
		user.email = userData.email;

		try {
			await user.save();
			return {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			};
		} catch (error: any) {
			if (error.code === 'ER_DUP_ENTRY') {
				throw CustomError.badRequest('Email already in use');
			} else {
				throw CustomError.internalServer('Error updating user');
			}
		}
	}

	async deleteUser(id: string, sessionUser: User) {
		const user = await this.findUserById(id);

		if (!user) throw CustomError.notFound('User not found');

		if (sessionUser.id !== id && sessionUser.role !== Role.EMPLOYEE)
			throw CustomError.forbidden('You are not allowed to delete users');

		user.status = UserStatus.DISABLED;

		try {
			await user.save();
			return {
				message: 'User deleted successfully',
			};
		} catch (error: any) {
			throw CustomError.internalServer('Error deleting user');
		}
	}
}
