import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, pbkdf2, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { appConfig } from '../../config';
import { PrismaService } from '../../database/prisma.service';
import {
  HASH_ALGORITHM,
  HASH_ITERATIONS,
  HASH_KEY_LENGTH,
} from './constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import type { AuthResponse, AuthUser } from './types/auth.types';
import { verifyJwtToken } from '../../common/utils/jwt.util';

const pbkdf2Async = promisify(pbkdf2);

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(signupDto: SignupDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signupDto.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.hashPassword(signupDto.password);
    const fullName = signupDto.fullName.trim();

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          fullName,
          email: signupDto.email,
          photoUrl: '',
          passwordHash,
        },
        select: this.userSelect(),
      });

      await tx.workspace.create({
        data: {
          name: `${fullName}'s Workspace`,
          ownerId: createdUser.id,
          members: {
            create: {
              userId: createdUser.id,
              role: 'OWNER',
            },
          },
        },
      });

      return createdUser;
    });

    return this.authResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      select: {
        ...this.userSelect(),
        passwordHash: true,
      },
    });

    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;

    return this.authResponse(safeUser);
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.userSelect(),
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const payload = verifyJwtToken(refreshToken);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.getMe(payload.sub);

    return this.authResponse(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('base64url');
    const derivedKey = await pbkdf2Async(
      password,
      salt,
      HASH_ITERATIONS,
      HASH_KEY_LENGTH,
      HASH_ALGORITHM,
    );

    return [
      'pbkdf2',
      HASH_ALGORITHM,
      HASH_ITERATIONS,
      salt,
      derivedKey.toString('base64url'),
    ].join('$');
  }

  private async verifyPassword(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const [strategy, algorithm, iterations, salt, hash] = storedHash.split('$');

    if (
      !strategy ||
      strategy !== 'pbkdf2' ||
      !algorithm ||
      !iterations ||
      !salt ||
      !hash
    ) {
      return false;
    }

    const derivedKey = await pbkdf2Async(
      password,
      salt,
      Number(iterations),
      HASH_KEY_LENGTH,
      algorithm,
    );

    const storedKey = Buffer.from(hash, 'base64url');

    return (
      storedKey.length === derivedKey.length &&
      timingSafeEqual(storedKey, derivedKey)
    );
  }

  private authResponse(user: AuthUser): AuthResponse {
    return {
      user,

      accessToken: this.signJwt(
        {
          sub: user.id,
          email: user.email,
          type: 'access',
        },
        appConfig.jwt.expiresIn,
      ),

      refreshToken: this.signJwt(
        {
          sub: user.id,
          email: user.email,
          type: 'refresh',
        },
        '7d',
      ),
    };
  }

  private signJwt(payload: Record<string, string>, expiresIn: string): string {
    const expiresInSeconds = this.parseExpiresIn(expiresIn);
    const now = Math.floor(Date.now() / 1000);

    const header = { alg: 'HS256', typ: 'JWT' };

    const body = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const unsignedToken = [
      this.base64UrlJson(header),
      this.base64UrlJson(body),
    ].join('.');

    const signature = createHmac('sha256', appConfig.jwt.secret)
      .update(unsignedToken)
      .digest('base64url');

    return `${unsignedToken}.${signature}`;
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])?$/);

    if (!match) {
      return 86_400;
    }

    const value = Number(match[1]);
    const unit = match[2] ?? 's';
    const secondsByUnit: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3_600,
      d: 86_400,
    };

    return value * secondsByUnit[unit];
  }

  private base64UrlJson(value: unknown): string {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
  }

  private userSelect() {
    return {
      id: true,
      fullName: true,
      email: true,
      photoUrl: true,
      age: true,
      gender: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
