import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteTodoDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsNumber()
  todoId!: number;
}
