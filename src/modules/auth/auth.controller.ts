import { ROUTES } from '../../common/constants';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ProfileDto } from './dto/profile.dto';

import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RateLimit } from '../../security/decorators/rate-limit.decorator';
import { User } from '../../database/entities/user.entity';
import { ResponseUtil } from '../../common/utils/response.util';

@ApiTags('Authentication')
@Controller(ROUTES.AUTH.BASE)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // -----------------------------------------------------
  // REGISTER
  // -----------------------------------------------------
  @Public()
  @Post(ROUTES.AUTH.REGISTER)
  @RateLimit({ limit: 10, window: 60 * 15 })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: AuthResponseDto })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return ResponseUtil.success(result, 'User registered successfully');
  }

  // -----------------------------------------------------
  // LOGIN
  // -----------------------------------------------------
  @Public()
  @Post(ROUTES.AUTH.LOGIN)
  @RateLimit({ limit: 10, window: 60 * 15 })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in', type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return ResponseUtil.success(result, 'User logged in successfully');
  }

  // -----------------------------------------------------
  // REFRESH TOKEN
  // -----------------------------------------------------
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post(ROUTES.AUTH.REFRESH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully', type: AuthResponseDto })
  async refresh(@CurrentUser() user: User) {
    const result = await this.authService.refreshToken(user.id, user.refreshToken);
    return ResponseUtil.success(result, 'Token refreshed successfully');
  }

  // -----------------------------------------------------
  // LOGOUT
  // -----------------------------------------------------
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post(ROUTES.AUTH.LOGOUT)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  async logout(@CurrentUser() user: User) {
    await this.authService.logout(user.id);
    return ResponseUtil.success(null, 'User logged out successfully');
  }

  // -----------------------------------------------------
  // FORGOT PASSWORD
  // -----------------------------------------------------
  @Public()
  @Post('forgot-password')
  @RateLimit({ limit: 5, window: 60 * 10 })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return ResponseUtil.success(null, 'Password reset instructions sent if the email is valid');
  }

  // -----------------------------------------------------
  // RESET PASSWORD
  // -----------------------------------------------------
  @Public()
  @Post('reset-password')
  @RateLimit({ limit: 5, window: 60 * 10 })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.resetToken, dto.newPassword);
    return ResponseUtil.success(null, 'Password has been successfully reset');
  }

  // -----------------------------------------------------
  // GET PROFILE
  // -----------------------------------------------------
  @UseGuards(JwtRefreshGuard)
  @Get(ROUTES.AUTH.PROFILE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: ProfileDto })
  async getProfile(@CurrentUser() user: User) {
    const userProfile = await this.authService.getProfile(user.id);
    return ResponseUtil.success(userProfile, 'Profile retrieved successfully');
  }

  // -----------------------------------------------------
  // UPDATE PROFILE
  // -----------------------------------------------------
  @UseGuards(JwtRefreshGuard)
  @Patch(ROUTES.AUTH.PROFILE)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, type: ProfileDto })
  async updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    const updatedUser = await this.authService.updateProfile(user.id, dto);
    return ResponseUtil.success(updatedUser, 'Profile updated successfully');
  }

  // -----------------------------------------------------
  // CHANGE PASSWORD
  // -----------------------------------------------------
  @UseGuards(JwtRefreshGuard)
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@CurrentUser() user: User, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(user.id, dto.oldPassword, dto.newPassword);
    return ResponseUtil.success(null, 'Password changed successfully');
  }
}
