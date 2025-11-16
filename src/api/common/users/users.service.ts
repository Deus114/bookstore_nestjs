import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateUserAddressDto,
  UpdateUserAddressDto,
  UserAddressResponseDto,
} from '@src/common/dtos/user-address';
import { UpdateUserDto, UserResponseDto } from '@src/common/dtos/user';
import { UserAddress } from '@src/common/entities';
import {
  BadRequestBusinessException,
  NotFoundBusinessException,
} from '@src/common/exceptions/business.exception';
import { UserAddressRepositoryService } from '@src/common/repositories/user-address';
import { UserRepositoryService } from '@src/common/repositories/user';
import {
  UserAddressResource,
  UserAddressesResource,
} from '@src/common/resources/user-address';
import { UserResource } from '@src/common/resources';
import { IUser } from '@src/common/utils/interfaces';
import { EntityId } from '@src/common/utils/types';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private userRepositoryService: UserRepositoryService,
    private userAddressRepositoryService: UserAddressRepositoryService,
    private dataSource: DataSource,
  ) {}

  async update(
    updateUserDto: UpdateUserDto,
    user: IUser,
  ): Promise<UserResponseDto> {
    // User chỉ có thể update chính mình
    const userId = user.id as EntityId;
    const existingUser = await this.userRepositoryService.findOne(userId);

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
    if (updateUserDto.avatar) {
      existingUser.avatar = updateUserDto.avatar;
    }
    if (updateUserDto.gender !== undefined) {
      existingUser.gender = updateUserDto.gender;
    }
    if (updateUserDto.dob !== undefined) {
      existingUser.dob = updateUserDto.dob;
    }
    existingUser.updatedBy = userId;

    const updatedUser = await this.userRepositoryService.update(existingUser);
    return UserResource(updatedUser);
  }

  async findAllAddresses(user: IUser): Promise<UserAddressResponseDto[]> {
    const addresses = await this.userAddressRepositoryService.findByUserId(
      user.id as EntityId,
    );
    return UserAddressesResource(addresses);
  }

  async findOneAddress(
    id: EntityId,
    user: IUser,
  ): Promise<UserAddressResponseDto> {
    const address = await this.userAddressRepositoryService.findOne(
      id,
      user.id as EntityId,
    );

    if (!address) {
      throw new NotFoundBusinessException('USER_ADDRESS_NOT_FOUND');
    }

    return UserAddressResource(address);
  }

  async createAddress(
    createUserAddressDto: CreateUserAddressDto,
    user: IUser,
  ): Promise<UserAddressResponseDto> {
    // Kiểm tra xem user đã có địa chỉ nào chưa
    const existingAddresses =
      await this.userAddressRepositoryService.findByUserId(user.id as EntityId);

    // Giới hạn số địa chỉ tối đa là 5
    const MAX_ADDRESS_LIMIT = 5;
    if (existingAddresses.length >= MAX_ADDRESS_LIMIT) {
      throw new BadRequestBusinessException('MAX_ADDRESS_LIMIT_EXCEEDED', {
        limit: MAX_ADDRESS_LIMIT,
        current: existingAddresses.length,
      });
    }

    // Nếu chưa có địa chỉ nào, tự động đặt làm default
    const shouldSetAsDefault = existingAddresses.length === 0;

    // Tạo địa chỉ mới
    const newAddress = new UserAddress();
    newAddress.user = { id: user.id } as any;
    newAddress.name = createUserAddressDto.name;
    newAddress.phone = createUserAddressDto.phone;
    newAddress.address = createUserAddressDto.address;
    newAddress.latitude = createUserAddressDto.latitude;
    newAddress.longitude = createUserAddressDto.longitude;
    newAddress.isDefault = shouldSetAsDefault;
    newAddress.createdBy = user.id as string;
    newAddress.updatedBy = user.id as string;

    const savedAddress =
      await this.userAddressRepositoryService.create(newAddress);

    // Reload để lấy đầy đủ thông tin
    const address = await this.userAddressRepositoryService.findOne(
      savedAddress.id,
      user.id as EntityId,
    );

    return UserAddressResource(address!);
  }

  async updateAddress(
    id: EntityId,
    updateUserAddressDto: UpdateUserAddressDto,
    user: IUser,
  ): Promise<UserAddressResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const address = await this.userAddressRepositoryService.findOne(
        id,
        user.id as EntityId,
      );

      if (!address) {
        throw new NotFoundBusinessException('USER_ADDRESS_NOT_FOUND');
      }

      // Nếu đặt làm địa chỉ mặc định, cần bỏ default của các địa chỉ khác
      if (updateUserAddressDto.isDefault === true && !address.isDefault) {
        const defaultAddress =
          await this.userAddressRepositoryService.findDefaultAddress(
            user.id as EntityId,
          );
        if (defaultAddress && defaultAddress.id !== id) {
          defaultAddress.isDefault = false;
          defaultAddress.updatedBy = user.id as string;
          defaultAddress.updatedAt = defaultAddress.generateDateNow();
          await queryRunner.manager.save(UserAddress, defaultAddress);
        }
      }

      // Cập nhật thông tin
      if (updateUserAddressDto.name !== undefined) {
        address.name = updateUserAddressDto.name;
      }
      if (updateUserAddressDto.phone !== undefined) {
        address.phone = updateUserAddressDto.phone;
      }
      if (updateUserAddressDto.address !== undefined) {
        address.address = updateUserAddressDto.address;
      }
      if (updateUserAddressDto.latitude !== undefined) {
        address.latitude = updateUserAddressDto.latitude;
      }
      if (updateUserAddressDto.longitude !== undefined) {
        address.longitude = updateUserAddressDto.longitude;
      }
      if (updateUserAddressDto.isDefault !== undefined) {
        address.isDefault = updateUserAddressDto.isDefault;
      }

      address.updatedBy = user.id as string;
      address.updatedAt = address.generateDateNow();

      await queryRunner.manager.save(UserAddress, address);
      await queryRunner.commitTransaction();

      // Reload để lấy đầy đủ thông tin
      const updatedAddress = await this.userAddressRepositoryService.findOne(
        id,
        user.id as EntityId,
      );

      return UserAddressResource(updatedAddress!);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAddress(id: EntityId, user: IUser): Promise<void> {
    const address = await this.userAddressRepositoryService.findOne(
      id,
      user.id as EntityId,
    );

    if (!address) {
      throw new NotFoundBusinessException('USER_ADDRESS_NOT_FOUND');
    }

    // Không cho phép xóa địa chỉ mặc định nếu còn địa chỉ khác
    if (address.isDefault) {
      const addresses = await this.userAddressRepositoryService.findByUserId(
        user.id as EntityId,
      );
      if (addresses.length > 1) {
        throw new BadRequestBusinessException('CANNOT_DELETE_DEFAULT_ADDRESS');
      }
    }

    await this.userAddressRepositoryService.delete(id);
  }
}
