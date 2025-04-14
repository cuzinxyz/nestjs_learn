import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { IsUniqueConstraint } from 'src/helpers/validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, IsUniqueConstraint],
  exports: [UserService], // Export UserService so it can be used in other modules
})
export class UserModule {}



