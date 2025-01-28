import { regularExp } from '../../../config';

export class UpdateUserDTO {
	constructor(public readonly name: string, public readonly email: string) {}

	static create(object: { [key: string]: any }): [string?, UpdateUserDTO?] {
		const { name, email } = object;

		if (!name) return ['Missing name', undefined];
		if (!email) return ['Missing email', undefined];
		if (!regularExp.email.test(email)) return ['Invalid email', undefined];

		return [undefined, new UpdateUserDTO(name, email)];
	}
}
