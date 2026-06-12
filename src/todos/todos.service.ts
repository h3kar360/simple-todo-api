import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Todo } from './entities/todos.entity';
import { FindTodosByIdDto } from './dto/findTodosById.dto';
import { CreateTodoDto } from './dto/createTodo.dto';
import { updateTodoDto } from './dto/updateTodo.dto';
import { DeleteTodoDto } from './dto/deleteTodo.dto';
import { DeleteTodoResponseDto } from './dto/deleteTodoResponse.dto';

@Injectable()
export class TodosService {
  constructor(
    @Inject('TODO_REPOSITORY') private todosRepository: Repository<Todo>,
  ) {}

  async findAllByUserId(
    findTodosByIdDto: FindTodosByIdDto,
  ): Promise<Todo[] | null> {
    return this.todosRepository.find({
      where: {
        user: { id: findTodosByIdDto.userId },
      },
    });
  }

  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create({
      title: createTodoDto.title,
      isCompleted: false,
      user: {
        id: createTodoDto.userId,
      },
    });

    return this.todosRepository.save(todo);
  }

  async updateTodo(updateTodoDto: updateTodoDto): Promise<Todo | null> {
    const updateData: any = {};

    if (updateTodoDto.hasOwnProperty('title')) {
      updateData.title = updateTodoDto.title;
    }

    updateData.isCompleted = updateTodoDto.isCompleted;

    const result = await this.todosRepository.update(
      { id: updateTodoDto.todoId, user: { id: updateTodoDto.userId } },
      updateData,
    );

    if (result.affected == 0) throw new NotFoundException('Todo not found');

    return this.todosRepository.findOneBy({ id: updateTodoDto.todoId });
  }

  async deleteTodo(
    deleteTodoDto: DeleteTodoDto,
  ): Promise<DeleteTodoResponseDto> {
    const result = await this.todosRepository.delete({
      id: deleteTodoDto.todoId,
      user: {
        id: deleteTodoDto.userId,
      },
    });

    if (result.affected == 0)
      throw new NotFoundException(`Todo #${deleteTodoDto.todoId} not found`);

    return {
      todoId: deleteTodoDto.todoId,
      msg: `Successfully deleted todo #${deleteTodoDto.todoId}`,
    };
  }
}
