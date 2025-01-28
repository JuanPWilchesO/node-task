import { regularExp } from '../../../config';

export class CreateRepairDTO {
	constructor(public readonly clientEmail: string) {}

	static create(object: { [key: string]: any }): [string?, CreateRepairDTO?] {
		const { clientEmail } = object;

		if (!clientEmail) return ['Missing client email', undefined];
		if (!regularExp.email.test(clientEmail))
			return ['Invalid client email', undefined];

		return [undefined, new CreateRepairDTO(clientEmail)];
	}
}
