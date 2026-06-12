import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../common/services/bcrypt.service';
import { AuthInputDto } from './dto/authInput.dto';
import { SignInDataDto } from './dto/signInData.dto';
import { AuthOutputDto } from './dto/authOutput.dto';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refreshToken.entity';
import { randomBytes } from 'crypto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    @Inject('REFRESH_TOKEN_REPOSITORY')
    private refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  async login(authInputDto: AuthInputDto): Promise<AuthOutputDto | null> {
    // authenticate user
    const user = await this.validateUser(authInputDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    // generate access and refresh tokens
    return this.generateTokens(user);
  }

  async validateUser(
    authInputDto: AuthInputDto,
  ): Promise<SignInDataDto | null> {
    const findUserDto = { username: authInputDto.username };

    const user = await this.usersService.findUserByName(findUserDto);

    if (
      user &&
      (await this.bcryptService.compare(authInputDto.password, user.password))
    ) {
      return { userId: user.id, username: user.username };
    }

    return null;
  }

  async generateTokens(signInDataDto: SignInDataDto): Promise<AuthOutputDto> {
    // generate new access token
    const accessToken = await this.generateAccessToken(signInDataDto);

    // check for existing refresh token
    let refreshToken = await this.refreshTokensRepository.findOne({
      where: { user: { id: signInDataDto.userId }, isRevoked: false },
    });

    // generate new refresh token if none exists
    if (!refreshToken) {
      refreshToken = this.refreshTokensRepository.create({
        token: randomBytes(64).toString('hex'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isRevoked: false,
        user: {
          id: signInDataDto.userId,
          username: signInDataDto.username,
        },
      });

      await this.refreshTokensRepository.save(refreshToken);
    }

    return {
      accessToken,
      refreshToken: refreshToken.token,
      userId: signInDataDto?.userId,
      username: signInDataDto?.username,
    };
  }

  async generateAccessToken(signInDataDto: SignInDataDto): Promise<string> {
    const accessTokenPayload = {
      sub: signInDataDto.userId,
      username: signInDataDto.username,
    };

    return await this.jwtService.signAsync(accessTokenPayload);
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<AuthOutputDto> {
    const storedRefreshToken = await this.refreshTokensRepository.findOne({
      where: { token: refreshTokenDto.refreshToken, isRevoked: false },
      relations: { user: true },
    });

    if (!storedRefreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    // check expiry of refresh token and delete if expired
    if (storedRefreshToken.expiresAt < new Date()) {
      await this.refreshTokensRepository.delete({ id: storedRefreshToken.id });
      throw new UnauthorizedException(
        'Refresh token expired. Please login again',
      );
    }

    const signInDataDto = {
      userId: storedRefreshToken.user.id,
      username: storedRefreshToken.user.username,
    };

    const accessToken = await this.generateAccessToken(signInDataDto);

    return {
      accessToken,
      refreshToken: storedRefreshToken.token,
      userId: signInDataDto.userId,
      username: signInDataDto.username,
    };
  }

  async signUp(authInputDto: AuthInputDto): Promise<AuthOutputDto> {
    const findUserDto = { username: authInputDto.username };

    const user = await this.usersService.findUserByName(findUserDto);

    if (user)
      // there is already a user with the same username
      throw new ConflictException('Username already exists');

    const hashedPassword = await this.bcryptService.hash(authInputDto.password);

    const createUserDto = {
      username: authInputDto.username,
      password: hashedPassword,
    };

    const newUser = await this.usersService.createUser(createUserDto);

    const signInData = { userId: newUser?.id, username: newUser?.username };

    const authOutput = await this.generateTokens(signInData);

    return authOutput;
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    await this.refreshTokensRepository.delete({
      token: refreshTokenDto.refreshToken,
    });
  }
}
