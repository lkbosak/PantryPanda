import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ){}
    async create(createProductDto: CreateProductDto) {
        console.log('Enter create with createProductDto', JSON.stringify(createProductDto));

        // Accept several possible shapes from the frontend:
        // - { productName, barcode_upc, description }
        // - { name, barcode, description }
        // - { product_name, barcode_upc }
        const dto: any = createProductDto as any;
        const product_name = dto.productName ?? dto.name ?? dto.product_name ?? '';
    const barcode = dto.barcode_upc ?? dto.barcode ?? dto.upc ?? dto.upc_barcode ?? dto.barcodeUpc ?? dto.upcBarcode ?? '';
        const description = dto.description ?? dto.desc ?? '';

        const product = this.productRepository.create({
            product_name,
            barcode_upc: barcode,
            description,
        } as Partial<Product>);

        return await this.productRepository.save(product);
    }

    async findOne(id: number) {
        return await this.productRepository.findOneBy({ product_id: id });
    }

    async remove(id: number) {
        const result = await this.productRepository.delete(id)
        if(result.affected === 0){
            throw new NotFoundException;
        }
        return null;
    }
}
