import { GroceryList } from 'src/grocery-list/entities/grocery-list.entity';
import { UserInventory } from 'src/user-inventory/entities/user-inventory.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('Product')
export class Product{

  @PrimaryGeneratedColumn({name: 'product_id'})
  product_id: number;

  @Column({name: 'product_name'})
  product_name: string;

  @Column({name: 'barcode_upc'})
  barcode_upc: string;

  @Column({ name: 'description' })
  description: string;

  @OneToMany(() => GroceryList, (groceryList) => groceryList.product)
  groceryList: GroceryList[];

  @OneToMany(() => UserInventory, (inventoryEntries) => inventoryEntries.product)
  inventoryEntries: UserInventory[];
  
  }


