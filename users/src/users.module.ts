import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  DomainEventEntity,
  UserEntity,
  UserProjectionEntity,
} from './infrastructure/persistence/entities';

import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { DomainEventRepository } from './infrastructure/persistence/repositories/domain-event.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { DOMAIN_EVENT_REPOSITORY } from './domain/repositories/domain-event.repository.interface';

import {
  CreateUserHandler,
  DeleteUserHandler,
  GetUserHandler,
  GetUsersHandler,
  UpdateUserHandler,
} from './application/handlers';

import {
  UserCreatedEventHandler,
  UserDeletedEventHandler,
  UserUpdatedEventHandler,
} from './infrastructure/persistence/event-handlers';

import { UsersController } from './presentation/controllers/users.controller';
import { KafkaController } from './infrastructure/messaging/kafka.controller';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];

const QueryHandlers = [GetUserHandler, GetUsersHandler];

const EventHandlers = [
  UserCreatedEventHandler,
  UserUpdatedEventHandler,
  UserDeletedEventHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      UserEntity,
      DomainEventEntity,
      UserProjectionEntity,
    ]),
  ],
  controllers: [UsersController, KafkaController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: DOMAIN_EVENT_REPOSITORY,
      useClass: DomainEventRepository,
    },
  ],
})
export class UsersModule {}
