import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import {
  ChangePassWorDto,
  CreateUserDto,
  RegisterUserDto,
  UpdateUserDto,
  UserBulkCreateResponseDto,
  UserResponseDto,
} from '@src/common/dtos/user';
import { User } from '@src/common/entities';
import {
  buildPaginatedResponse,
  paginateQueryBuilder,
} from '@src/common/helpers';
import { UserRepositoryService } from '@src/common/repositories/user';
import { UserResource, UsersResource } from '@src/common/resources';
import { UserRole, UserType } from '@src/common/utils/enums';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private userRepositoryService: UserRepositoryService) {}

  getHashPassword = (password: string) => {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  };

  async register(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    const isEmailExist = await this.userRepositoryService.findByEmail(
      registerUserDto.email,
    );
    if (isEmailExist) {
      throw new BadRequestException({
        errorCode: 'EMAIL_ALREADY_EXISTS',
      });
    }
    const isPhoneExist = await this.userRepositoryService.findByPhone(
      registerUserDto.phone,
    );
    if (isPhoneExist) {
      throw new BadRequestException({
        errorCode: 'PHONE_ALREADY_EXISTS',
      });
    }
    const hashPassword = this.getHashPassword(registerUserDto.password);
    const user = new User();
    user.email = registerUserDto.email;
    user.password = hashPassword;
    user.fullName = registerUserDto.fullName;
    user.phone = registerUserDto.phone;
    user.role = UserRole.USER;

    const result = await this.userRepositoryService.create(user);

    const savedUser = await this.userRepositoryService.findOne(result.id);
    return UserResource(savedUser);
  }

  async bulkCreate(
    createUserDto: CreateUserDto[],
    i_user: IUser,
  ): Promise<UserBulkCreateResponseDto> {
    let countSuccess = 0;
    let countError = 0;

    for (const item of createUserDto) {
      try {
        item.role = UserRole.USER;
        const res = await this.create(item, i_user);
        if (res) countSuccess++;
      } catch (error) {
        countError++;
      }
    }
    return { countSuccess, countError };
  }

  async create(
    createUserDto: CreateUserDto,
    i_user: IUser,
  ): Promise<UserResponseDto> {
    const isExist = await this.userRepositoryService.findByEmail(
      createUserDto.email,
    );
    if (isExist) {
      throw new BadRequestException({
        errorCode: 'EMAIL_ALREADY_EXISTS',
      });
    }
    const hashPassword = this.getHashPassword(createUserDto.password);
    const user = new User();
    user.email = createUserDto.email;
    user.password = hashPassword;
    user.fullName = createUserDto.fullName;
    user.role = createUserDto.role;
    user.phone = createUserDto.phone;
    user.isActive = true;
    user.type = UserType.SYSTEM;
    user.createdBy = i_user.id;

    const result = await this.userRepositoryService.create(user);

    const savedUser = await this.userRepositoryService.findOne(result.id);
    return UserResource(savedUser);
  }

  async findAll(
    currentPage: number,
    limit: number,
    search?: string,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const queryBuilder = this.userRepositoryService.getQueryBuilder();

    if (search) {
      queryBuilder.andWhere(
        `(unaccent(user.fullName) ILIKE :query 
        OR unaccent(user.email) ILIKE :query 
        OR unaccent(user.phone) ILIKE :query)`,
        {
          query: '%' + search + '%',
        },
      );
    }

    const {
      offset,
      limit: finalLimit,
      totalItems,
    } = await paginateQueryBuilder(queryBuilder, {
      currentPage,
      pageSize: limit,
      defaultLimit: 10,
    });

    const result = await queryBuilder.skip(offset).take(finalLimit).getMany();

    return buildPaginatedResponse(
      UsersResource(result),
      totalItems,
      currentPage,
      finalLimit,
    );
  }

  async findOne(id: EntityId): Promise<UserResponseDto> {
    const user = await this.userRepositoryService.findOne(id);
    return UserResource(user);
  }

  async findOneByUserName(username: string): Promise<UserResponseDto> {
    const user = await this.userRepositoryService.findByEmail(username);
    return UserResource(user);
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(
    updateUserDto: UpdateUserDto,
    user: IUser,
  ): Promise<UserResponseDto> {
    const existingUser = await this.userRepositoryService.findOne(
      updateUserDto.id,
    );
    if (!existingUser) {
      throw new BadRequestException({
        errorCode: 'USER_NOT_FOUND',
      });
    }

    if (updateUserDto.fullName) {
      existingUser.fullName = updateUserDto.fullName;
    }
    if (updateUserDto.phone) {
      existingUser.phone = updateUserDto.phone;
    }
    if (user.id) {
      existingUser.updatedBy = user.id;
    }

    const updatedUser = await this.userRepositoryService.update(existingUser);
    return UserResource(updatedUser);
  }

  async remove(id: EntityId, user: IUser): Promise<void> {
    await this.userRepositoryService.softDelete(id, user.id);
  }

  updateRefreshToken = async (
    refreshToken: string,
    id: EntityId,
  ): Promise<UserResponseDto> => {
    await this.userRepositoryService.updateById(id, { refreshToken });
    const updatedUser = await this.userRepositoryService.findOne(id);
    return UserResource(updatedUser);
  };

  findUserByRefreshToken = async (
    refreshToken: string,
  ): Promise<UserResponseDto> => {
    const user =
      await this.userRepositoryService.findByRefreshToken(refreshToken);
    return UserResource(user);
  };

  changePassword = async (
    changePasswordDto: ChangePassWorDto,
  ): Promise<UserResponseDto> => {
    const { email, oldpass, newpass } = changePasswordDto;
    const user = await this.userRepositoryService.findByEmail(email);
    if (user) {
      const isValidPassword = this.isValidPassword(oldpass, user.password);
      if (isValidPassword) {
        const updatePass = this.getHashPassword(newpass);
        await this.userRepositoryService.updateById(user.id, {
          password: updatePass,
          updatedBy: user.id,
        });
        const updatedUser = await this.userRepositoryService.findOne(
          user.id as EntityId,
        );
        return UserResource(updatedUser);
      } else {
        throw new BadRequestException({
          errorCode: 'INVALID_PASSWORD',
        });
      }
    } else {
      throw new BadRequestException({
        errorCode: 'USER_NOT_FOUND',
      });
    }
  };

  getUserDashboard = async (): Promise<number> => {
    const count = await this.userRepositoryService.count({
      deletedAt: null,
    });
    return count;
  };

  // Public method để AuthService có thể truy cập
  get userRepo() {
    return this.userRepositoryService;
  }
}
