import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { DbHealthService } from './db-health.service';
import { ProductModule } from './product/product.module';
import { UserInventoryModule } from './user-inventory/user-inventory.module';
import { GroceryListModule } from './grocery-list/grocery-list.module';
import { Product } from './product/entities/product.entity';
import { UserInventory } from './user-inventory/entities/user-inventory.entity';
import { GroceryList } from './grocery-list/entities/grocery-list.entity';
//dotenv??

@Module({
  imports: [
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: '10.111.16.231', 
          port: 3306, 
          username: 'appuser', 
          password: 'pantry1234', 
          database: 'pantry', 
          entities: [User, Product, UserInventory, GroceryList], //add entities?
          synchronize: false,
      }),
      UserModule,
      ProductModule,
      UserInventoryModule,
      GroceryListModule,
  ],
  controllers: [AppController],
  providers: [AppService, DbHealthService],
})
export class AppModule {}
