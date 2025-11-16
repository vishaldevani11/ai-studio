// ================= AUTH SERVICE (FINAL + FIXED FOR YOUR CONFIG) =================

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
import crypto from 'crypto';
import { User, UserRole, UserStatus } from '../../database/entities/user.entity';
import { UserAddress } from '../../database/entities/user-address.entity';
import { UserBusiness } from '../../database/entities/user-business.entity';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

import {
  BCRYPT_SALT_ROUNDS,
  DEFAULT_ADDRESS_COUNTRY,
  PASSWORD_RESET_TOKEN_BYTES,
} from '../../common/constants/auth.constants';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(UserAddress)
    private addressRepo: Repository<UserAddress>,

    @InjectRepository(UserBusiness)
    private businessRepo: Repository<UserBusiness>,

    @InjectDataSource()
    private dataSource: DataSource,

    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ========================================================
  // REGISTER
  // ========================================================
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, phone, address, business } = dto;

    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) throw new ConflictException('User with this email already exists');

    if (phone) {
      const phoneExists = await this.userRepo.findOne({ where: { phone } });
      if (phoneExists) throw new ConflictException('Phone number already exists');
    }

    const query = this.dataSource.createQueryRunner();
    await query.connect();
    await query.startTransaction();

    try {
      const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

      const user = this.userRepo.create({
        email,
        passwordHash,
        firstName,
        lastName: lastName || null,
        phone: phone || null,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      });

      const saved = await query.manager.save(User, user);

      if (address) {
        await query.manager.save(
          UserAddress,
          this.addressRepo.create({
            userId: saved.id,
            addressType: address.addressType || 'default',
            street: address.street || null,
            city: address.city || null,
            state: address.state || null,
            zipcode: address.zipcode || null,
            country: address.country || DEFAULT_ADDRESS_COUNTRY,
          }),
        );
      }

      if (business) {
        await query.manager.save(
          UserBusiness,
          this.businessRepo.create({
            userId: saved.id,
            businessName: business.businessName || null,
            businessType: business.businessType || null,
            businessSegment: business.businessSegment || null,
            businessDescription: business.businessDescription || null,
            gstNumber: business.gstNumber || null,
            websiteUrl: business.websiteUrl || null,
            businessLogo: business.businessLogo || null,
          }),
        );
      }

      await query.commitTransaction();

      const tokens = await this.generateTokens(saved);
      await this.updateRefreshToken(saved.id, tokens.refreshToken);

      // --------------------------------------------------
      // 🔥 SAFE MAPPING: User Entity → ProfileDto
      // --------------------------------------------------
      const profile = new ProfileDto({
        id: saved.id,
        email: saved.email,
        firstName: saved.firstName,
        lastName: saved.lastName,
        phone: saved.phone,
        role: saved.role,
        status: saved.status,
        profileImage: saved.profileImage,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
        business: business
          ? {
              businessName: business.businessName,
              businessType: business.businessType,
              businessSegment: business.businessSegment,
              businessDescription: business.businessDescription,
              gstNumber: business.gstNumber,
              websiteUrl: business.websiteUrl,
              businessLogo: business.businessLogo,
            }
          : undefined,
      });

      return {
        ...tokens,
        user: profile,
      };
    } catch (err) {
      await query.rollbackTransaction();
      throw err;
    } finally {
      await query.release();
    }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = dto;

    // 1. Find user + business relation
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['business'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Compare passwords
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Check user status
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account inactive or banned');
    }

    // 4. Update last login
    const now = new Date();
    await this.userRepo.update(user.id, { lastLogin: now });
    user.lastLogin = now;

    // 5. Generate tokens
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    // 6. Map business entity → DTO
    const businessDto = user.business
      ? {
          businessName: user.business.businessName,
          businessType: user.business.businessType,
          businessSegment: user.business.businessSegment,
          businessDescription: user.business.businessDescription,
          gstNumber: user.business.gstNumber,
          websiteUrl: user.business.websiteUrl,
          businessLogo: user.business.businessLogo,
        }
      : undefined;

    // 7. Map User → ProfileDto (safe mapping)
    const profile = new ProfileDto({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      profileImage: user.profileImage,
      business: businessDto,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    // 8. Final response
    return {
      ...tokens,
      user: profile,
    };
  }

  // ========================================================
  // REFRESH TOKEN
  // ========================================================
  async refreshToken(userId: string, token: string): Promise<AuthResponseDto> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.refreshToken !== token)
      throw new UnauthorizedException('Invalid refresh token');

    if (user.refreshTokenExpires && user.refreshTokenExpires < new Date())
      throw new UnauthorizedException('Refresh token expired');

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user };
  }

  // ========================================================
  // LOGOUT
  // ========================================================
  async logout(userId: string) {
    await this.userRepo.update(userId, {
      refreshToken: null,
      refreshTokenExpires: null,
    });
  }

  // ========================================================
  // GET PROFILE
  // ========================================================
  async getProfile(userId: string): Promise<ProfileDto> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['addresses', 'business'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const businessDto = user.business
      ? {
          businessName: user.business.businessName,
          businessType: user.business.businessType,
          businessSegment: user.business.businessSegment,
          businessDescription: user.business.businessDescription,
          gstNumber: user.business.gstNumber,
          websiteUrl: user.business.websiteUrl,
          businessLogo: user.business.businessLogo,
        }
      : undefined;

    return new ProfileDto({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      role: user.role,
      status: user.status,
      profileImage: user.profileImage,
      addresses: user.addresses,
      business: businessDto,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  // ========================================================
  // UPDATE PROFILE
  // ========================================================
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.phone) {
      const phoneExists = await this.userRepo.findOne({
        where: { phone: dto.phone },
      });

      if (phoneExists && phoneExists.id !== userId)
        throw new ConflictException('Phone already in use');
    }

    await this.userRepo.update(userId, dto);

    return this.getProfile(userId);
  }

  // ========================================================
  // CHANGE PASSWORD
  // ========================================================
  async changePassword(userId: string, current: string, next: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(current, user.passwordHash);
    if (!valid) throw new BadRequestException('Current password incorrect');

    if (await bcrypt.compare(next, user.passwordHash))
      throw new BadRequestException('New password must be different');

    const hashed = await bcrypt.hash(next, BCRYPT_SALT_ROUNDS);

    await this.userRepo.update(userId, { passwordHash: hashed });
  }

  // ========================================================
  // TOKEN GENERATION
  // ========================================================
  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwt.signAsync(payload, {
        secret: this.config.get('app.jwt.secret'),
        expiresIn: this.config.get('app.jwt.expiresIn'),
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        secret: this.config.get('app.jwt.refreshSecret'),
        expiresIn: this.config.get('app.jwt.refreshExpiresIn'),
      }),
      expiresIn: this.config.get('app.jwt.expiresIn'),
    };
  }

  // ========================================================
  // UPDATE REFRESH TOKEN
  // ========================================================
  private async updateRefreshToken(userId: string, token: string) {
    const ttl = this.config.get<string>('app.jwt.refreshExpiresIn');
    const expires = this.calculateExpiry(ttl);

    await this.userRepo.update(userId, {
      refreshToken: token,
      refreshTokenExpires: expires,
    });
  }

  private calculateExpiry(ttl: string) {
    const expires = new Date();

    if (ttl.endsWith('d')) expires.setDate(expires.getDate() + parseInt(ttl));
    else if (ttl.endsWith('h')) expires.setHours(expires.getHours() + parseInt(ttl));
    else if (ttl.endsWith('m')) expires.setMinutes(expires.getMinutes() + parseInt(ttl));

    return expires;
  }

  // ========================================================
  // VALIDATE USER (USED BY STRATEGIES)
  // ========================================================
  async validateUserById(userId: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id: userId, status: UserStatus.ACTIVE },
    });
  }
  // ========================================================
  // FORGOT PASSWORD
  // ========================================================
  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return; // Prevent email lookup

    const resetToken = crypto.randomBytes(PASSWORD_RESET_TOKEN_BYTES).toString('hex');
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes expiry (or use config)

    await this.userRepo.update(user.id, {
      passwordResetToken: hash,
      passwordResetExpires: expires,
    });

    // Later: send email here with `resetToken`
  }

  // ========================================================
  // RESET PASSWORD
  // ========================================================
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userRepo.findOne({
      where: { passwordResetToken: hashed },
    });

    if (!user) throw new BadRequestException('Invalid password reset token');
    if (user.passwordResetExpires < new Date())
      throw new BadRequestException('Password reset token expired');

    if (await bcrypt.compare(newPassword, user.passwordHash))
      throw new BadRequestException('New password must be different from old');

    const newHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    await this.userRepo.update(user.id, {
      passwordHash: newHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }
}
