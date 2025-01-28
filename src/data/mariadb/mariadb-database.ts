import { DataSource } from 'typeorm';
import { User, Repair } from '../';

interface Options {
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
}

export class MariaDBDatabase {
	public datasource: DataSource;

	constructor(options: Options) {
		this.datasource = new DataSource({
			type: 'mariadb',
			host: options.host,
			port: options.port,
			username: options.username,
			password: options.password,
			database: options.database,
			entities: [User, Repair],
			synchronize: true,
		});
	}

	async connect() {
		try {
			await this.datasource.initialize();
			console.log('database conected 👌');
		} catch (error) {
			console.log(error);
		}
	}
}
