import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  UpdateUserCommand,
  DeleteUserCommand,
} from '../../application/commands';
import { GetUserQuery, GetUsersQuery } from '../../application/queries';

@Controller()
export class KafkaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('user.create')
  async handleUserCreate(@Payload() message: any) {
    console.log('Received user.create event:', message);

    const { name, email, phone, address } = message;

    const command = new CreateUserCommand(name, email, phone, address);
    const userId = await this.commandBus.execute(command);

    return {
      success: true,
      userId,
      message: 'User created successfully',
    };
  }

  @MessagePattern('user.update')
  async handleUserUpdate(@Payload() message: any) {
    console.log('Received user.update event:', message);

    const { id, name, email, phone, address } = message;

    const command = new UpdateUserCommand(id, name, email, phone, address);
    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'User updated successfully',
    };
  }

  @MessagePattern('user.delete')
  async handleUserDelete(@Payload() message: any) {
    console.log('Received user.delete event:', message);

    const { id } = message;

    const command = new DeleteUserCommand(id);
    await this.commandBus.execute(command);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  @MessagePattern('user.query.all')
  async handleGetUsers(@Payload() message: any) {
    console.log('Received user.query.all event:', message);

    const query = new GetUsersQuery();
    const users = await this.queryBus.execute(query);

    return users;
  }

  @MessagePattern('user.query.one')
  async handleGetUser(@Payload() message: any) {
    console.log('Received user.query.one event:', message);

    const { id } = message;

    const query = new GetUserQuery(id);
    const user = await this.queryBus.execute(query);

    return user;
  }
}
