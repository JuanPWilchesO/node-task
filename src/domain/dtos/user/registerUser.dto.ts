import { regularExp } from '../../../config';
import { Role } from '../../../data';

export class RegisterUserDTO {
	constructor(
		public readonly name: string,
		public readonly email: string,
		public readonly password: string,
		public readonly role: Role,
	) {}

	static create(object: { [key: string]: any }): [string?, RegisterUserDTO?] {
		const { name, email, password, role } = object;

		if (!name) return ['Missing name', undefined];
		if (!email) return ['Missing email', undefined];
		if (!regularExp.email.test(email)) return ['Invalid email', undefined];
		if (!password) return ['Missing Password', undefined];
		if (!regularExp.password.test(password))
			return ['Invalid password', undefined];
		if (!role) return ['Missing role', undefined];
		if (!Object.values(Role).includes(role)) return ['Invalid role', undefined];

		return [undefined, new RegisterUserDTO(name, email, password, role)];
	}
}
