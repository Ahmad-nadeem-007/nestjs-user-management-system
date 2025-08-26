import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto, ResetPasswordDto } from './dto';
import { MoreThan } from 'typeorm';
import { UserStatus } from 'src/common/enums/User.enum';
import { CurrentUserType } from 'src/common/types/CurrentUser.types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    // Use the repository to explicitly select password
    const user = await this.userService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // First check if email is verified
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    // Then check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: CurrentUserType) {
    // Generate access token with role
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role // Include role in JWT payload
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Generate refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const userData = await this.userService.findByEmailWithPassword(user?.email);
    if (!userData) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Save refresh token to user
    userData.refreshToken = refreshToken;
    await this.userService.save(userData);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshToken(oldRefreshToken: string) {
    // Find user with this refresh token
    const user = await this.userService.CustomfindOne({
      where: { refreshToken: oldRefreshToken }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const newRefreshToken = crypto.randomBytes(64).toString('hex');

    // Update user's refresh token
    user.refreshToken = newRefreshToken;
    await this.userService.save(user);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    let user;

    if (existingUser) {
      // If user exists but is not verified, update their information
      if (!existingUser.isEmailVerified) {
        // Update user information
        Object.assign(existingUser, {
          ...registerDto,
          status: UserStatus.PENDING,
        });
        user = await this.userService.save(existingUser);
      } else {
        // If user exists and is verified, throw error
        throw new ConflictException('Email already exists and is verified');
      }
    } else {
      // Create new user if doesn't exist
      user = await this.userService.create({
        ...registerDto,
        status: UserStatus.PENDING,
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await this.userService.save(user);

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    // Return user data without password
    // const { password, ...result } = user;
    return { message: 'User registered successfully, please check your email for verification' };
  }

  async verifyEmail(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    // const user = await this.userService.findOne({
    //   where: (qb) => {
    //     qb.where('user.passwordResetToken = :token', { token: hashedToken })
    //       .andWhere('user.passwordResetExpires > :now', { now: new Date() });
    //   }
    // });
    const user = await this.userService.CustomfindOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: MoreThan(new Date()),  // TypeORM operator
      },
    });


    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.status = UserStatus.ACTIVE;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userService.save(user);

    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.userService.save(user);

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const hashedToken = crypto.createHash('sha256').update(resetPasswordDto.token).digest('hex');
    // const user = await this.userService.findOne({
    //   where: (qb) => {
    //     qb.where('user.passwordResetToken = :token', { token: hashedToken })
    //       .andWhere('user.passwordResetExpires > :now', { now: new Date() });
    //   }
    // });
    const user = await this.userService.CustomfindOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: MoreThan(new Date()),  // TypeORM operator
      },
    });


    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = resetPasswordDto.newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userService.save(user);

    return { message: 'Password reset successfully' };
  }
}
