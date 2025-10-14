export class CreateUserInventoryDto {

    quantity: number;

    unit: string;

    expiration_date: Date

    date_added: Date;

    location: 'pantry' | 'fridge' | 'freezer' | 'spice rack';

    qPref: number;

    //foreign keyk
    product_id: number;
}
