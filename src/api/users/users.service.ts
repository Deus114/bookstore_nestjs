import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ChangePassWorDto,
  CreateUserDto,
  RegisterUserDto,
  UpdateUserDto,
} from '@src/common/dto/user';
import { User } from '@src/common/entities';
import { UserRepositoryService } from '@src/common/repositories/user';
import { UserRole, UserType } from '@src/common/utils/enums';
import { IUser } from '@src/common/utils/interfaces';
import aqp from 'api-query-params';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private userRepositoryService: UserRepositoryService) {}

  getHashPassword = (password: string) => {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);
    return hash;
  };

  async register(registerUserDto: RegisterUserDto) {
    const isExist = await this.userRepositoryService.findByEmail(
      registerUserDto.email,
    );
    if (isExist) {
      throw new BadRequestException(
        `Email: $${registerUserDto.email} đã tồn tại`,
      );
    }
    let hashPassword = this.getHashPassword(registerUserDto.password);
    let user = await this.userRepositoryService.create({
      email: registerUserDto.email,
      password: hashPassword,
      fullName: registerUserDto.fullName,
      phone: registerUserDto.phone,
      role: UserRole.USER,
    } as User);
    return {
      id: user.id,
      createdAt: user.createdAt,
    };
  }

  async bulkCreate(createUserDto: CreateUserDto[], i_user: IUser) {
    let countSuccess = 0;
    let countError = 0;

    for (const item of createUserDto) {
      try {
        item.role = UserRole.USER;
        let res = await this.create(item, i_user);
        if (res) countSuccess++;
      } catch (error) {
        countError++;
      }
    }
    return { countSuccess, countError };
  }

  async create(createUserDto: CreateUserDto, i_user: IUser) {
    const isExist = await this.userRepositoryService.findByEmail(
      createUserDto.email,
    );
    if (isExist) {
      throw new BadRequestException(
        `Email: $${createUserDto.email} đã tồn tại`,
      );
    }
    let hashPassword = this.getHashPassword(createUserDto.password);
    let user = await this.userRepositoryService.create({
      email: createUserDto.email,
      password: hashPassword,
      fullName: createUserDto.fullName,
      role: createUserDto.role,
      phone: createUserDto.phone,
      isActive: true,
      type: UserType.SYSTEM,
      createdBy: i_user.id,
    } as User);
    return {
      id: user.id,
      createdAt: user.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

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

  findOne(id: string) {
    return this.userRepositoryService.findOne(id);
  }

  findOneByUserName(username: string) {
    return this.userRepositoryService.findByEmail(username);
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userRepositoryService.updateById(updateUserDto.id, {
      fullName: updateUserDto.fullName,
      phone: updateUserDto.phone,
      updatedBy: user.id,
    });
  }

  async remove(id: string, user: IUser) {
    return await this.userRepositoryService.softDelete(id, user.id);
  }

  updateRefreshToken = async (refreshToken: string, id: string) => {
    return await this.userRepositoryService.updateById(id, { refreshToken });
  };

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.userRepositoryService.findByRefreshToken(refreshToken);
  };

  changePassword = async (changePasswordDto: ChangePassWorDto) => {
    const { email, oldpass, newpass } = changePasswordDto;
    const user = await this.findOneByUserName(email);
    if (user) {
      let isValidPassword = this.isValidPassword(oldpass, user.password);
      if (isValidPassword) {
        let updatePass = this.getHashPassword(newpass);
        return await this.userRepositoryService.updateById(user.id, {
          password: updatePass,
          updatedBy: user.id,
        });
      } else {
        throw new BadRequestException(`Mật khẩu không đúng!`);
      }
    } else throw new BadRequestException(`Không tìm thấy email tương ứng!`);
  };

  getUserDashboard = async () => {
    const count = await this.userRepositoryService.count({
      deletedAt: null,
    });
    return count;
  };
}
