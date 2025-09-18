import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({name: 'username'})
  username: string;

  @Column({name: 'email'})
  email: string;

  @Column({ name: 'password_hash' })
  password: string;

  @Column({ name: 'account_created' })
  accountCreated: Date;
}

