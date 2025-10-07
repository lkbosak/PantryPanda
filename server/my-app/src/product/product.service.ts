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
        return await this.productRepository.save(createProductDto);
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
