import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';
import { ResponseUtil } from '../../common/utils/response.util';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return ResponseUtil.success(result, 'User registered successfully');
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return ResponseUtil.success(result, 'User logged in successfully');
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    // In a real implementation, you would extract the user ID from the refresh token
    // For now, we'll need to modify the strategy to handle this properly
    throw new Error('Refresh token endpoint needs proper implementation');
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  async logout(@CurrentUser() user: User) {
    await this.authService.logout(user.id);
    return ResponseUtil.success(null, 'User logged out successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile with related data' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserResponseDto,
  })
  async getProfile(@CurrentUser() user: User) {
    const userProfile = await this.authService.getProfile(user.id);
    
    const profileData = {
      id: userProfile.id,
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName || undefined,
      phone: userProfile.phone || undefined,
      role: userProfile.role,
      status: userProfile.status,
      emailVerified: userProfile.emailVerified,
      phoneVerified: userProfile.phoneVerified,
      emailSubscribed: userProfile.emailSubscribed,
      profileImage: userProfile.profileImage || undefined,
      lastLogin: userProfile.lastLogin || undefined,
      referralCode: userProfile.referralCode || undefined,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
      addresses: userProfile.addresses?.map((addr) => ({
        id: addr.id,
        addressType: addr.addressType,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zipcode: addr.zipcode,
        country: addr.country,
        createdAt: addr.createdAt,
        updatedAt: addr.updatedAt,
      })) || [],
      business: userProfile.business ? {
        id: userProfile.business.id,
        businessName: userProfile.business.businessName,
        businessType: userProfile.business.businessType,
        businessSegment: userProfile.business.businessSegment,
        businessDescription: userProfile.business.businessDescription,
        gstNumber: userProfile.business.gstNumber,
        websiteUrl: userProfile.business.websiteUrl,
        businessLogo: userProfile.business.businessLogo,
        createdAt: userProfile.business.createdAt,
        updatedAt: userProfile.business.updatedAt,
      } : null,
      subscriptions: userProfile.subscriptions?.map((sub) => ({
        id: sub.id,
        plan: sub.plan,
        status: sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate,
        autoRenew: sub.autoRenew,
        paymentMethod: sub.paymentMethod,
        creditsRemaining: sub.creditsRemaining,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
      })) || [],
    };
    
    return ResponseUtil.success(profileData, 'Profile retrieved successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile (partial update)' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Phone number already in use',
  })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedUser = await this.authService.updateProfile(user.id, updateProfileDto);
    
    const profileData = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName || undefined,
      phone: updatedUser.phone || undefined,
      role: updatedUser.role,
      status: updatedUser.status,
      emailVerified: updatedUser.emailVerified,
      phoneVerified: updatedUser.phoneVerified,
      emailSubscribed: updatedUser.emailSubscribed,
      profileImage: updatedUser.profileImage || undefined,
      lastLogin: updatedUser.lastLogin || undefined,
      referralCode: updatedUser.referralCode || undefined,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
    
    return ResponseUtil.success(profileData, 'Profile updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Current password is incorrect or new password is same as current',
  })
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(
      user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return ResponseUtil.success(null, 'Password changed successfully');
  }
}
