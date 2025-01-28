process.loadEnvFile();
import { get } from 'env-var';

export const envs = {
	PORT: get('PORT').required().asPortNumber(),
	HOST_DATABASE: get('HOST_DATABASE').required().asString(),
	PORT_DATABASE: get('PORT_DATABASE').required().asPortNumber(),
	USERNAME_DATABASE: get('USERNAME_DATABASE').required().asString(),
	PASSWORD_DATABASE: get('PASSWORD_DATABASE').required().asString(),
	DATABASE: get('DATABASE').required().asString(),
	JWT_SEED: get('JWT_SEED').required().asString(),
	JWT_EXPIRES: get('JWT_EXPIRES').required().asString(),
};
