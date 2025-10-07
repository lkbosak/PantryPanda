import { PartialType } from '@nestjs/mapped-types';
import { CreateUserInventoryDto } from './create-user-inventory.dto';

export class UpdateUserInventoryDto extends PartialType(CreateUserInventoryDto) {

    readonly quantity?: number;

    readonly unit?: string;

    readonly expiration_date?: Date

    readonly date_added?: Date;

    readonly location?: 'pantry' | 'fridge' | 'freezer' | 'spice rack';

    readonly qPref?: number;

}
