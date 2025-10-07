export class CreateUserInventoryDto {

    inventory_id: number;

    quantity: number;

    unit: string;

    expiration_date: Date

    date_added: Date;

    location: 'pantry' | 'fridge' | 'freezer' | 'spice rack';

    qPref: number;
}
