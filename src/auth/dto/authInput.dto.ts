import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthInputDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}
