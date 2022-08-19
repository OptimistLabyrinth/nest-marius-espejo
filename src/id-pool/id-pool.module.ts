import { Module } from '@nestjs/common';
import { IdPoolService } from './id-pool.service';

@Module({
  providers: [IdPoolService],
  exports: [IdPoolService],
})
export class IdPoolModule {}
