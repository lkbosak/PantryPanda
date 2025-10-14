import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/user.entity'
import { Product } from '../../product/entities/product.entity';


@Entity('UserInventory')
export class UserInventory {

    @PrimaryGeneratedColumn({name: 'inventory_id' })
    inventory_id: number;

    @Column({name: 'quantity'})
    quantity: number;

    @Column({name: 'unit'})
    unit: string;

    @Column({name: 'expiration_date'})
    expiration_date: Date

    @Column({name: 'date_added'})
    date_added: Date;

    @Column({name: 'location'})
    location: 'pantry' | 'fridge' | 'freezer' | 'spice rack';

    @Column({name: 'min_quantity_preference'})
    qPref: number;

    
    //Many to one relationship with the the user
    @ManyToOne(() => User, (user) => user.inventoryItems)
    @JoinColumn({name: 'user_id'})
    user: User;

    //Many to one relationsihp with the product
    @ManyToOne(() => Product, (product) => product.inventoryEntries)
    @JoinColumn({name: 'product_id'})
    product: Product


}

