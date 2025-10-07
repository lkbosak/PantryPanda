import { UserInventory } from 'src/user-inventory/entities/user-inventory.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn({name: 'user_id'})
  user_id: number;

  @Column({name: 'username'})
  username: string;

  @Column({name: 'email'})
  email: string;

  @Column({ name: 'password_hash' })
  password: string;

  @Column({ name: 'account_created' })
  accountCreated: Date;

  @OneToMany(() => UserInventory, (inventory) => inventory.user)
  inventoryItems: UserInventory[];
}

