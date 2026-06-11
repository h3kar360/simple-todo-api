import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { DatabaseModule } from '../database/database.module';
import { todoProviders } from './todos.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [TodosController],
  providers: [...todoProviders, TodosService],
})
export class TodosModule {}
