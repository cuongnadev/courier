import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { promisify } from 'util';
import { createHmac, pbkdf2, randomBytes, timingSafeEqual } from 'crypto';

import { PrismaService } from '@/database/prisma.service';

import { LoginDto, SignupDto } from '@/modules/auth/dto';

import type { AuthResponse, AuthUser } from '@/modules/auth/types';

import {
  BASE64_URL_ENCODING,
  DEFAULT_EXPIRES_IN_SECONDS,
  EXPIRES_IN_SECONDS_BY_UNIT,
  JWT_ACCESS_TOKEN_TYPE,
  JWT_ALGORITHM,
  JWT_HEADER_TYPE,
  JWT_REFRESH_TOKEN_TYPE,
  PASSWORD_HASH_SEPARATOR,
  PASSWORD_HASH_STRATEGY,
  PASSWORD_SALT_LENGTH,
  HASH_ITERATIONS,
  HASH_KEY_LENGTH,
  HASH_ALGORITHM,
  DEFAULT_REFRESH_TOKEN_EXPIRES_IN,
} from '@/common/constants';

import { verifyJwtToken } from '@/common/utils';
import { createDefaultWorkspaceName } from '@/common/constants';

import { appConfig } from '@/config';

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
          name: createDefaultWorkspaceName(fullName),
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

    const { passwordHash, ...safeUser } = user;
    void passwordHash;

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

    if (payload.type !== JWT_REFRESH_TOKEN_TYPE) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.getMe(payload.sub);

    return this.authResponse(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt =
      randomBytes(PASSWORD_SALT_LENGTH).toString(BASE64_URL_ENCODING);
    const derivedKey = await pbkdf2Async(
      password,
      salt,
      HASH_ITERATIONS,
      HASH_KEY_LENGTH,
      HASH_ALGORITHM,
    );

    return [
      PASSWORD_HASH_STRATEGY,
      HASH_ALGORITHM,
      HASH_ITERATIONS,
      salt,
      derivedKey.toString(BASE64_URL_ENCODING),
    ].join(PASSWORD_HASH_SEPARATOR);
  }

  private async verifyPassword(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const [strategy, algorithm, iterations, salt, hash] = storedHash.split(
      PASSWORD_HASH_SEPARATOR,
    );

    if (
      !strategy ||
      strategy !== PASSWORD_HASH_STRATEGY ||
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

    const storedKey = Buffer.from(hash, BASE64_URL_ENCODING);

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
          type: JWT_ACCESS_TOKEN_TYPE,
        },
        appConfig.jwt.expiresIn,
      ),

      refreshToken: this.signJwt(
        {
          sub: user.id,
          email: user.email,
          type: JWT_REFRESH_TOKEN_TYPE,
        },
        DEFAULT_REFRESH_TOKEN_EXPIRES_IN,
      ),
    };
  }

  private signJwt(payload: Record<string, string>, expiresIn: string): string {
    const expiresInSeconds = this.parseExpiresIn(expiresIn);
    const now = Math.floor(Date.now() / 1000);

    const header = { alg: JWT_ALGORITHM, typ: JWT_HEADER_TYPE };

    const body = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const unsignedToken = [
      this.base64UrlJson(header),
      this.base64UrlJson(body),
    ].join('.');

    const signature = createHmac(HASH_ALGORITHM, appConfig.jwt.secret)
      .update(unsignedToken)
      .digest(BASE64_URL_ENCODING);

    return `${unsignedToken}.${signature}`;
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])?$/);

    if (!match) {
      return DEFAULT_EXPIRES_IN_SECONDS;
    }

    const value = Number(match[1]);
    const unit = (match[2] ?? 's') as keyof typeof EXPIRES_IN_SECONDS_BY_UNIT;

    return value * EXPIRES_IN_SECONDS_BY_UNIT[unit];
  }

  private base64UrlJson(value: unknown): string {
    return Buffer.from(JSON.stringify(value)).toString(BASE64_URL_ENCODING);
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
