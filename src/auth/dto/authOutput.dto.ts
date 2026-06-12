import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class AuthOutputDto {
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @IsNotEmpty()
  @IsString()
  refreshToken!: string;

  @IsNotEmpty()
  @IsNumber()
  userId!: number | undefined;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(3)
  username!: string | undefined;
}
