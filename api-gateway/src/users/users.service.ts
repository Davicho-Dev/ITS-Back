import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('user.create');
    this.kafkaClient.subscribeToResponseOf('user.update');
    this.kafkaClient.subscribeToResponseOf('user.delete');
    this.kafkaClient.subscribeToResponseOf('user.query.all');
    this.kafkaClient.subscribeToResponseOf('user.query.one');
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  async createUser(createUserDto: CreateUserDto) {
    const result = await firstValueFrom(
      this.kafkaClient.send('user.create', createUserDto),
    );
    return result;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const result = await firstValueFrom(
      this.kafkaClient.send('user.update', { id, ...updateUserDto }),
    );
    return result;
  }

  async deleteUser(id: string) {
    const result = await firstValueFrom(
      this.kafkaClient.send('user.delete', { id }),
    );
    return result;
  }

  async findAll() {
    const result = await firstValueFrom(
      this.kafkaClient.send('user.query.all', {}),
    );
    return result;
  }

  async findOne(id: string) {
    const result = await firstValueFrom(
      this.kafkaClient.send('user.query.one', { id }),
    );
    return result;
  }
}
