import { IsNumber, IsString } from 'class-validator';

export class DeleteTodoResponseDto {
  @IsNumber()
  todoId!: number;

  @IsString()
  msg!: string;
}
