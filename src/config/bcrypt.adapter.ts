import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export const encryptAdapter = {
	hash: (password: string) => {
		const salt = genSaltSync(10);
		return hashSync(password, salt);
	},

	compare: (unHashedPassword: string, hashedPassword: string) => {
		return compareSync(unHashedPassword, hashedPassword);
	},
};
