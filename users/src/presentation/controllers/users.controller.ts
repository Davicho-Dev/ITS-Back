import {
  Controller,
  Get,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery, GetUsersQuery } from '../../application/queries';
import { User } from '../../domain/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    const users: User[] = await this.queryBus.execute(new GetUsersQuery());

    return {
      success: true,
      data: users.map((user) => this.mapUserToResponse(user)),
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string) {
    const user: User | null = await this.queryBus.execute(
      new GetUserQuery(id),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: this.mapUserToResponse(user),
    };
  }

  private mapUserToResponse(user: User) {
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      phone: user.getPhone()?.getValue() ?? null,
      address: user.getAddress()?.getValue() ?? null,
      isActive: user.getIsActive(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
