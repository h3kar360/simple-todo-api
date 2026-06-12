import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('/api/v1/todos')
@UseGuards(AuthGuard)
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  findAllByUserId(@Request() request) {
    const userId = request.user.userId;
    return this.todosService.findAllByUserId({ userId });
  }

  @Post()
  createTodo(@Request() request, @Body() input: { title: string }) {
    const createTodoDto = { userId: request.user.userId, title: input.title };
    return this.todosService.createTodo(createTodoDto);
  }

  @Put(':id')
  updateTodo(
    @Request() request,
    @Body() input: { title?: string; isCompleted: boolean },
    @Param('id') todoId: number,
  ) {
    const updateTodoDto = {
      userId: request.user.userId,
      todoId,
      title: input.title,
      isCompleted: input.isCompleted,
    };
    return this.todosService.updateTodo(updateTodoDto);
  }

  @Get('test')
  sayHello() {
    return 'hello';
  }
}
