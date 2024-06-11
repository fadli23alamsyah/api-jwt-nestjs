import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class InputUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(8, {
    message: 'Password is too short',
  })
  password?: string;
}
