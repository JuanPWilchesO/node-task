import {
	BaseEntity,
	BeforeInsert,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { encryptAdapter } from '../../../config';
import { Repair } from './repair.model';

export enum Role {
	EMPLOYEE = 'EMPLOYEE',
	CLIENT = 'CLIENT',
}

export enum UserStatus {
	ENABLED = 'ENABLED',
	DISABLED = 'DISABLED',
}

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('varchar', {
		length: 80,
		nullable: false,
	})
	name: string;

	@Column('varchar', {
		length: 80,
		nullable: false,
		unique: true,
	})
	email: string;

	@Column('varchar', {
		length: 80,
		nullable: false,
	})
	password: string;

	@Column('varchar', {
		length: 10,
		nullable: false,
	})
	role: Role;

	@Column('varchar', {
		length: 10,
		nullable: false,
		default: UserStatus.ENABLED,
	})
	status: UserStatus;

	@OneToMany(() => Repair, (repair) => repair.created_by)
	employeeRepairs: Repair[];

	@OneToMany(() => Repair, (repair) => repair.client)
	clientRepairs: Repair[];

	@BeforeInsert()
	encryptedPassword() {
		this.password = encryptAdapter.hash(this.password);
	}
}
