import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class updateTodoDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsNumber()
  todoId!: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted!: boolean;
}
