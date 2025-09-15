import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageService } from '@src/common/services/error-message.service';
import { UserResource, UsersResource } from '@src/common/resources';
import { EntityId } from '@src/common/utils/types';
import {
  ChangePassWorDto,
  CreateUserDto,
  RegisterUserDto,
  UpdateUserDto,
  UserBulkCreateResponseDto,
  UserResponseDto,
} from '@src/common/dtos/user';
import { CreateResponseDto } from '@src/common/dtos/common';
import { PaginatedResponseDto } from '@src/common/dtos/common';
import { User } from '@src/common/entities';
import { UserRepositoryService } from '@src/common/repositories/user';
import { UserRole, UserType } from '@src/common/utils/enums';
import { IUser } from '@src/common/utils/interfaces';
import aqp from 'api-query-params';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private userRepositoryService: UserRepositoryService,
    private errorMessageService: ErrorMessageService,
  ) {}

  getHashPassword = (password: string) => {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  };

  async register(registerUserDto: RegisterUserDto): Promise<CreateResponseDto> {
    const isEmailExist = await this.userRepositoryService.findByEmail(
      registerUserDto.email,
    );
    if (isEmailExist) {
      throw new BadRequestException({
        message: this.errorMessageService.getMessage('EMAIL_ALREADY_EXISTS'),
        errorCode: 'EMAIL_ALREADY_EXISTS',
      });
    }
    const isPhoneExist = await this.userRepositoryService.findByPhone(
      registerUserDto.phone,
    );
    if (isPhoneExist) {
      throw new BadRequestException({
        message: this.errorMessageService.getMessage('PHONE_ALREADY_EXISTS'),
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

    return {
      id: result.id,
      createdAt: result.createdAt,
    };
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
  ): Promise<CreateResponseDto> {
    const isExist = await this.userRepositoryService.findByEmail(
      createUserDto.email,
    );
    if (isExist) {
      throw new BadRequestException({
        message: this.errorMessageService.getMessage('EMAIL_ALREADY_EXISTS'),
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
    return {
      id: result.id,
      createdAt: result.createdAt,
    };
  }

  async findAll(
    currentPage: number,
    limit: number,
    qs: string,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;

    const queryBuilder = this.userRepositoryService.getQueryBuilder();

    // Apply filters
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: filter[key] });
      }
    });

    // Apply sorting
    if (sort) {
      Object.keys(sort).forEach((key) => {
        queryBuilder.addOrderBy(
          `user.${key}`,
          sort[key] === 1 ? 'ASC' : 'DESC',
        );
      });
    }

    const totalItems = await queryBuilder.getCount();
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await queryBuilder.skip(offset).take(defaultLimit).getMany();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
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
    await this.userRepositoryService.updateById(updateUserDto.id, {
      fullName: updateUserDto.fullName,
      phone: updateUserDto.phone,
      updatedBy: user.id,
    });
    const updatedUser = await this.userRepositoryService.findOne(
      updateUserDto.id,
    );
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
          message: this.errorMessageService.getMessage('INVALID_PASSWORD'),
          errorCode: 'INVALID_PASSWORD',
        });
      }
    } else
      throw new BadRequestException({
        message: this.errorMessageService.getMessage('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
      });
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
