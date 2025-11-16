import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token received via email',
    example: 'd81291ac-1234-reset-token',
  })
  @IsString()
  @MinLength(10, { message: 'Invalid reset token format' })
  resetToken: string;

  @ApiProperty({
    description: 'New password',
    example: 'StrongPass@123',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(18, { message: 'Password must not exceed 18 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,18}$/, {
    message: 'Password must include uppercase, lowercase, number, and special character',
  })
  newPassword: string;
}
