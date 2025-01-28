import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config/jwt.adapter';
import { User, UserStatus } from '../../data';

export class AuthMiddleWare {
	static async protect(req: Request, res: Response, next: NextFunction) {
		const authorization = req.header('Authorization');

		if (!authorization) {
			return res.status(401).json({ message: 'No token provided' });
		}

		if (!authorization.startsWith('Bearer')) {
			return res.status(401).json('Invalid token');
		}

		const token = authorization.split(' ')[1] || '';

		try {
			const payload = (await JwtAdapter.validateToken(token)) as {
				id: string;
			};

			if (!payload) {
				return res.status(401).json({ message: 'Invalid token' });
			}

			const user = await User.findOne({
				where: {
					id: payload.id,
					status: UserStatus.ENABLED,
				},
			});

			if (!user) return res.status(401).json({ message: 'Invalid user' });

			req.body.sessionUser = user;
			next();
		} catch (error) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	}
}
