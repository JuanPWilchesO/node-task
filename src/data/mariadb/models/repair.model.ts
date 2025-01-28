import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';

export enum Status {
	PENDING = 'PENDING',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

@Entity()
export class Repair extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('date', {
		default: () => 'CURRENT_DATE',
	})
	date: Date;

	@Column('integer', {
		nullable: false,
	})
	motorsNumber: number;

	@Column('varchar', {
		nullable: false,
	})
	description: string;

	@Column('varchar', {
		length: 20,
		nullable: false,
		default: Status.PENDING,
	})
	status: Status;

	@ManyToOne(() => User, (user) => user.clientRepairs)
	@JoinColumn({ name: 'client' })
	client: User;

	@ManyToOne(() => User, (user) => user.employeeRepairs)
	@JoinColumn({ name: 'created_by' })
	created_by: User;
}
