import { Server } from './presentation/server';
import { AppRoutes } from './presentation/routes';
import { MariaDBDatabase } from './data';
import { envs } from './config';

async function main() {
	const mariadb = new MariaDBDatabase({
		host: envs.HOST_DATABASE,
		port: envs.PORT_DATABASE,
		username: envs.USERNAME_DATABASE,
		password: envs.PASSWORD_DATABASE,
		database: envs.DATABASE,
	});

	await mariadb.connect();

	const server = new Server({
		port: envs.PORT,
		routes: AppRoutes.routes,
	});

	await server.start();
}

main();
