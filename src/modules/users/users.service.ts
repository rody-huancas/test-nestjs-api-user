import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleDatabaseExceptions } from '@shared/utils/database-error.utils';
import { PaginationUserDto } from './dto/pagination-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

   async create(createUserDto: CreateUserDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const { email, ...userData } = createUserDto;
        
        const userWithEmail = await manager.findOne(User, { where: { email } });

        if (userWithEmail) throw new BadRequestException(`El correo electrónico ${email} ya está registrado.`);

        const newUser = manager.create(User, { email, ...userData });
        
        await manager.save(newUser);

        return { message: 'Usuario creado correctamente', data: newUser };
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      handleDatabaseExceptions('Users')(error);
      throw error;
    }
  }

  async findAll(paginationUserDto: PaginationUserDto) {
    const { page = 1, limit = 10, minAge, maxAge } = paginationUserDto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true });

    if (minAge !== undefined) {
      queryBuilder.andWhere('user.age >= :minAge', { minAge });
    }

    if (maxAge !== undefined) {
      queryBuilder.andWhere('user.age <= :maxAge', { maxAge });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { idUser: id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.findOne(id);

      const { email, ...userData } = updateUserDto;

      if (email && email !== existingUser?.email) {
        await this.userRepository.findOne({ where: { email } });
        
        if (existingUser) throw new BadRequestException(`El correo electrónico ${email} ya está registrado.`);
      }

      return await this.dataSource.transaction(async (manager) => {
        const updatedUser = manager.create(User, {
          idUser: id,
          email,
          ...userData
        });

        await manager.save(updatedUser);
        
        return { message: 'Usuario actualizado correctamente', data: updatedUser };
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      handleDatabaseExceptions('Users')(error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const user = await this.findOne(id);
        
        await manager.update(User, { id: id }, { isActive: false });
        
        return { message: `${user?.fullName} ha sido desactivado` };
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      handleDatabaseExceptions('Users')(error);
      throw error;
    }
  }
}
