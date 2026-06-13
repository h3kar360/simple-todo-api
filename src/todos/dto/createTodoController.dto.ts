import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoControllerDto {
  @IsNotEmpty()
  @IsString()
  title!: string;
}
