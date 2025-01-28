import jwt from 'jsonwebtoken';
import { envs } from './env';

const JWT_SEED = envs.JWT_SEED;
const JWT_EXPIRES = envs.JWT_EXPIRES;

export class JwtAdapter {
	static async generateToken(payload: any, duration: string = JWT_EXPIRES) {
		return new Promise((resolve) => {
			jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
				if (err) return resolve(null);

				resolve(token);
			});
		});
	}

	static async validateToken(token: string) {
		return new Promise((resolve) => {
			jwt.verify(token, JWT_SEED, (err: any, decoded: any) => {
				if (err) return resolve(null);

				resolve(decoded);
			});
		});
	}
}
