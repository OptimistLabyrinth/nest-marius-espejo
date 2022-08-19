import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { IdPoolModule } from './id-pool/id-pool.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [UsersModule, IdPoolModule, TodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
