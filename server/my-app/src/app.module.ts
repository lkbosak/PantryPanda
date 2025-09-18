import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
//dotenv??

@Module({
  imports: [
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: '10.111.16.231', 
          port: 3306, 
          username: 'root', 
          password: 'ab12cd34', 
          database: 'pantry', 
          entities: [User], //add entities?
          synchronize: true,
      }),
      UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
