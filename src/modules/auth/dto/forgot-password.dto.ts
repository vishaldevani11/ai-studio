import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Registered email address to send the password reset link',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(150)
  email: string;
}
