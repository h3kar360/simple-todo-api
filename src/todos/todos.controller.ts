import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateTodoControllerDto } from './dto/createTodoController.dto';
import { UpdateTodoControllerDto } from './dto/updateTodoController.dto';
import { GetUser } from '../common/decorators/getUser.decorator';
import { Todo } from './entities/todos.entity';
import { DeleteTodoResponseDto } from './dto/deleteTodoResponse.dto';

@Controller('/api/v1/todos')
@UseGuards(AuthGuard)
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  findAllByUserId(@GetUser('userId') userId: number): Promise<Todo[] | null> {
    return this.todosService.findAllByUserId({ userId });
  }

  @Post()
  createTodo(
    @GetUser('userId') userId: number,
    @Body() createTodoControllerDto: CreateTodoControllerDto,
  ): Promise<Todo> {
    const createTodoDto = {
      userId,
      title: createTodoControllerDto.title,
    };

    return this.todosService.createTodo(createTodoDto);
  }

  @Put(':id')
  updateTodo(
    @GetUser('userId') userId: number,
    @Body() updateTodoControllerDto: UpdateTodoControllerDto,
    @Param('id') todoId: number,
  ): Promise<Todo | null> {
    const updateTodoDto = {
      userId,
      todoId,
      title: updateTodoControllerDto.title,
      isCompleted: updateTodoControllerDto.isCompleted,
    };

    return this.todosService.updateTodo(updateTodoDto);
  }

  @Delete(':id')
  deleteTodo(
    @GetUser('userId') userId: number,
    @Param('id') todoId: number,
  ): Promise<DeleteTodoResponseDto> {
    const deleteTodoResponseDto = { userId, todoId };

    return this.todosService.deleteTodo(deleteTodoResponseDto);
  }
}
