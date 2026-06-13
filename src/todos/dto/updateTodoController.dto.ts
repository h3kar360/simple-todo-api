import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTodoControllerDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted!: boolean;
}
