import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class SignInDataDto {
  @IsNotEmpty()
  @IsNumber()
  userId?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username?: string;
}
