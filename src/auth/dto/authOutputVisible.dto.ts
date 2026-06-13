import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class AuthOutputVisibleDto {
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @IsNotEmpty()
  @IsNumber()
  userId!: number | undefined;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(3)
  username!: string | undefined;
}
