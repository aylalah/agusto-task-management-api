import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
  // orderBy: {
  //   email: 'ASC',
  // },
})

@Unique(['id'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', { name: 'role', nullable: true, default: 'user', enum: ['admin', 'user'] })
  role?: string;

  @Column('varchar', { name: 'first_name', nullable: true, length: 52 })
  first_name?: string;

  @Column('varchar', { name: 'last_name', nullable: true, length: 52 })
  last_name?: string;

  @Column('varchar', { name: 'phone_number', nullable: true, length: 52 })
  phone_number?: string;

  @Column('varchar', { name: 'email', nullable: true, length: 52 })
  email?: string;

  @Column('boolean', { name: 'verify_email', nullable: true, default: false })
  verify_email?: boolean;

  @Column('varchar', { name: 'token', nullable: true, length: 52 })
  token?: string;

  @Column('varchar', { name: 'image', nullable: true, length: 200 })
  image?: string;

  @Column('enum', { name: 'gender', nullable: true, default: 'Male', enum: ['Male', 'Female'] })
  gender?: string;

  @Column('varchar', { name: 'password', length: 255 })
  password?: string;

  @Column('boolean', { name: 'two_factor', nullable: true, default: true })
  two_factor?: boolean;

  @Column('boolean', { name: 'status', nullable: true, default: false })
  status?: boolean;

  @Column('varchar', { name: 'created_by', nullable: true, length: 50 })
  created_by?: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at?: string;

  @Column('varchar', { name: 'updated_by', nullable: true, length: 50 })
  updated_by?: string;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updated_at?: string;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deleted_at?: string;

}
