import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { DbHealthService } from './db-health.service';
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
  ],
  controllers: [AppController],
  providers: [AppService, DbHealthService],
})
export class AppModule {}
