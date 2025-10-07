import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity('GroceryList')
export class GroceryList {

    @PrimaryGeneratedColumn({name: 'list_item_id'})
    list_id: number;

    @Column({ name: 'QTY_TO_BUY'})
    qToBuy: number;

    @Column({ name: 'is_purchased'})
    isPurchased: boolean;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User

    @ManyToOne(() => Product, (product) => product.groceryList)
    @JoinColumn({name: 'product_id'})
    product: Product


}
