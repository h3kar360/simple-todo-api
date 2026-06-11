import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Todo } from './entities/todos.entity';

@Injectable()
export class TodosService {
  constructor(
    @Inject('TODO_REPOSITORY') private todosRepository: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todosRepository.find();
  }
}
