import { regularExp } from '../../../config';

export class LoginUserDTO {
	constructor(
		public readonly email: string,
		public readonly password: string,
	) {}

	static create(object: { [key: string]: any }): [string?, LoginUserDTO?] {
		const { password, email } = object;

		if (!email) return ['Missing email', undefined];
		if (!regularExp.email.test(email)) return ['Invalid email', undefined];
		if (!password) return ['Missing password', undefined];
		if (!regularExp.password.test(password))
			return ['Invalid password', undefined];

		return [undefined, new LoginUserDTO(email, password)];
	}
}
