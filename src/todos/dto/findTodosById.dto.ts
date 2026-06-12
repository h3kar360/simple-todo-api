import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindTodosByIdDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;
}
