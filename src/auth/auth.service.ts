import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../common/services/bcrypt.service';
import { FindUserDto } from '../users/dto/findUser.dto';

type AuthInput = { username: string; password: string };
type SignInData = { userId: number; username: string };
type AuthOutput = {
  accessToken: string;
  userId: number | undefined;
  username: string | undefined;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthOutput | null> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const findUserDto = { username: input.username };

    const user = await this.usersService.findUserByName(findUserDto);

    if (
      user &&
      (await this.bcryptService.compare(input.password, user.password))
    ) {
      return { userId: user.id, username: user.username };
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthOutput> {
    const tokenPayload = {
      sub: user.userId,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return { accessToken, userId: user.userId, username: user.username };
  }

  async signUp(input: AuthInput): Promise<AuthOutput> {
    const findUserDto = { username: input.username };

    const user = await this.usersService.findUserByName(findUserDto);

    if (user)
      // there is already a user with the same username
      throw new ConflictException('username already exists');

    const hashedPassword = await this.bcryptService.hash(input.password);

    const createUserDto = {
      username: input.username,
      password: hashedPassword,
    };

    const newUser = await this.usersService.createUser(createUserDto);

    const tokenPayload = {
      sub: newUser?.id,
      username: newUser?.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return { accessToken, userId: newUser?.id, username: newUser?.username };
  }
}
