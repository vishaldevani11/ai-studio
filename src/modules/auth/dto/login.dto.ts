import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Registered email address of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @MaxLength(150)
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongPass@123',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(18, { message: 'Password must not exceed 18 characters' })
  password: string;
}
