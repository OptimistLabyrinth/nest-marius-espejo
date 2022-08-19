import { Module } from '@nestjs/common';
import { IdPoolModule } from 'src/id-pool/id-pool.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [IdPoolModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
