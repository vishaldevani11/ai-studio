import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserRole, UserStatus } from '../../database/entities/user.entity';
import { UserAddress } from '../../database/entities/user-address.entity';
import { UserBusiness } from '../../database/entities/user-business.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
    @InjectRepository(UserBusiness)
    private userBusinessRepository: Repository<UserBusiness>,
    @InjectDataSource()
    private dataSource: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, phone, address, business } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if phone is already taken (if provided)
    if (phone) {
      const existingPhoneUser = await this.userRepository.findOne({
        where: { phone },
      });

      if (existingPhoneUser) {
        throw new ConflictException('User with this phone number already exists');
      }
    }

    // Use transaction to ensure all data is saved atomically
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = this.userRepository.create({
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName: lastName || null,
        phone: phone || null,
        emailVerified: false,
        phoneVerified: false,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      });

      const savedUser = await queryRunner.manager.save(User, user);

      // Create address if provided
      if (address) {
        const userAddress = this.userAddressRepository.create({
          userId: savedUser.id,
          addressType: address.addressType || 'default',
          street: address.street || null,
          city: address.city || null,
          state: address.state || null,
          zipcode: address.zipcode || null,
          country: address.country || 'India',
        });
        await queryRunner.manager.save(UserAddress, userAddress);
      }

      // Create business if provided
      if (business) {
        const userBusiness = this.userBusinessRepository.create({
          userId: savedUser.id,
          businessName: business.businessName || null,
          businessType: business.businessType || null,
          businessSegment: business.businessSegment || null,
          businessDescription: business.businessDescription || null,
          gstNumber: business.gstNumber || null,
          websiteUrl: business.websiteUrl || null,
          businessLogo: business.businessLogo || null,
        });
        await queryRunner.manager.save(UserBusiness, userBusiness);
      }

      // Commit transaction
      await queryRunner.commitTransaction();

      // Generate tokens
      const tokens = await this.generateTokens(savedUser);

      // Update user with refresh token
      await this.updateRefreshToken(savedUser.id, tokens.refreshToken);

      return {
        ...tokens,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName || undefined,
          phone: savedUser.phone || undefined,
          role: savedUser.role,
          status: savedUser.status,
          emailVerified: savedUser.emailVerified,
          phoneVerified: savedUser.phoneVerified,
          lastLogin: savedUser.lastLogin || undefined,
          createdAt: savedUser.createdAt,
          updatedAt: savedUser.updatedAt,
        },
      };
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if user is active
    if (user.status !== UserStatus.ACTIVE) {
      if (user.status === UserStatus.BANNED) {
        throw new UnauthorizedException('Account has been banned');
      }
      throw new UnauthorizedException('Account is inactive. Please contact support.');
    }

    // Update last login timestamp
    await this.userRepository.update(user.id, {
      lastLogin: new Date(),
    });

    user.lastLogin = new Date();

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update user with refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || undefined,
        phone: user.phone || undefined,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        lastLogin: user.lastLogin || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async refreshToken(userId: string, refreshToken: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if refresh token is expired
    if (user.refreshTokenExpires && user.refreshTokenExpires < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user);

    // Update user with new refresh token
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || undefined,
        phone: user.phone || undefined,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        lastLogin: user.lastLogin || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      refreshToken: null,
      refreshTokenExpires: null,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // To prevent email enumeration, we don't throw an error here.
      // We just silently fail.
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const passwordResetExpires = new Date(
      Date.now() + this.configService.get<number>('auth.passwordResetTokenExpiresIn'),
    );

    await this.userRepository.update(user.id, {
      passwordResetToken,
      passwordResetExpires,
    });

    // In a real application, you would send an email to the user with the resetToken.
    // For this example, we'll just log it to the console.
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken,
      },
    });

    if (!user) {
      throw new BadRequestException('Password reset token is invalid');
    }

    if (user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Password reset token has expired');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from the current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(user.id, {
      passwordHash: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId, status: UserStatus.ACTIVE },
    });
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses', 'business'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only update fields that are provided (partial update)
    const updateData: Partial<User> = {};

    if (updateProfileDto.firstName !== undefined) {
      updateData.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName !== undefined) {
      updateData.lastName = updateProfileDto.lastName;
    }
    if (updateProfileDto.phone !== undefined) {
      // Check if phone is already taken by another user
      if (updateProfileDto.phone) {
        const existingPhoneUser = await this.userRepository.findOne({
          where: { phone: updateProfileDto.phone },
        });

        if (existingPhoneUser && existingPhoneUser.id !== userId) {
          throw new ConflictException('Phone number is already in use');
        }
      }
      updateData.phone = updateProfileDto.phone || null;
    }
    if (updateProfileDto.profileImage !== undefined) {
      updateData.profileImage = updateProfileDto.profileImage || null;
    }

    if (updateProfileDto.referralCode !== undefined) {
      updateData.referralCode = updateProfileDto.referralCode || null;
    }

    // Update only provided fields
    await this.userRepository.update(userId, updateData);

    // Return updated user
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['addresses', 'business'],
    });

    return updatedUser;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await this.userRepository.update(userId, {
      passwordHash: hashedNewPassword,
    });
  }

  private async generateTokens(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('auth.jwtSecret'),
        expiresIn: this.configService.get<string>('auth.jwtExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('auth.jwtRefreshSecret'),
        expiresIn: this.configService.get<string>('auth.jwtRefreshExpiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const expiresIn = this.configService.get<string>('auth.jwtRefreshExpiresIn');
    const expiresAt = new Date();

    // Parse expires in (e.g., '7d', '15m')
    if (expiresIn.endsWith('d')) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    } else if (expiresIn.endsWith('h')) {
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresIn));
    } else if (expiresIn.endsWith('m')) {
      expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(expiresIn));
    }

    await this.userRepository.update(userId, {
      refreshToken,
      refreshTokenExpires: expiresAt,
    });
  }
}
