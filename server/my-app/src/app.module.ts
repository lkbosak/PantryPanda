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
          entities: [User], //add entities?
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
