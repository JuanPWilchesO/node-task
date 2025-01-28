import { regularExp } from '../../../config';

export class CreateRepairDTO {
	constructor(
		public readonly clientEmail: string,
		public readonly motorsNumber: number,
		public readonly description: string,
	) {}

	static create(object: { [key: string]: any }): [string?, CreateRepairDTO?] {
		const { clientEmail, motorsNumber, description } = object;

		if (!clientEmail) return ['Missing client email', undefined];
		if (!regularExp.email.test(clientEmail))
			return ['Invalid client email', undefined];
		if (!motorsNumber) return ['Missing motors number', undefined];
		if (typeof motorsNumber !== 'number')
			return ['Invalid motors number', undefined];
		if (!description) return ['Missing description', undefined];
		if (typeof description !== 'string')
			return ['Invalid description', undefined];

		return [
			undefined,
			new CreateRepairDTO(clientEmail, motorsNumber, description),
		];
	}
}
