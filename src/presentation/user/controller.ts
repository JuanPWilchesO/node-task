import { Request, Response } from 'express';
import { CustomError, RegisterUserDTO, UpdateUserDTO } from '../../domain';
import { UserService } from '../services/user.service';
import { LoginUserDTO } from '../../domain/dtos/user/loginUser.dto';

export class UserController {
	constructor(private readonly userService: UserService) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ message: error.message });
		} else {
			return res.status(500).json({
				message: 'Something went wrong',
			});
		}
	};

	register = (req: Request, res: Response) => {
		const [error, registerUserDto] = RegisterUserDTO.create(req.body);

		if (error) return res.status(422).json({ message: error });

		this.userService
			.register(registerUserDto!)
			.then((data) => {
				return res.status(201).json(data);
			})
			.catch((error) => this.handleError(error, res));
	};

	login = (req: Request, res: Response) => {
		const [error, loginUserDTO] = LoginUserDTO.create(req.body);

		if (error) return res.status(422).json({ message: error });

		this.userService
			.login(loginUserDTO!)
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((error) => {
				this.handleError(error, res);
			});
	};

	findAllUsers = (req: Request, res: Response) => {
		this.userService
			.findAllUsers()
			.then((data) => {
				return res.status(200).json(data);
			})
			.catch((error) => this.handleError(error, res));
	};

	findOneUser = (req: Request, res: Response) => {
		this.userService
			.findUserById(req.params.id)
			.then((data) => res.status(200).json(data))
			.catch((error) => this.handleError(error, res));
	};

	updateUser = (req: Request, res: Response) => {
		const [error, updateUserDto] = UpdateUserDTO.create(req.body);

		if (error) return res.status(422).json({ message: error });

		this.userService
			.updateUser(req.params.id, updateUserDto!, req.body.sessionUser)
			.then((data) => res.status(200).json(data))
			.catch((error) => this.handleError(error, res));
	};

	deleteUser = (req: Request, res: Response) => {
		this.userService
			.deleteUser(req.params.id, req.body.sessionUser)
			.then((data) => res.status(204).send(data))
			.catch((error) => this.handleError(error, res));
	};
}
