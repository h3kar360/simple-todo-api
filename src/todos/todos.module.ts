import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { DatabaseModule } from '../database/database.module';
import { todoProviders } from './todos.providers';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TodosController],
  providers: [...todoProviders, TodosService],
})
export class TodosModule {}
