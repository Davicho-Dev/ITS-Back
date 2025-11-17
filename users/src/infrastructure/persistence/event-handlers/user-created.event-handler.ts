import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreatedEvent } from '../../../domain/events/user-created.event';
import type { IDomainEventRepository } from '../../../domain/repositories/domain-event.repository.interface';
import { DOMAIN_EVENT_REPOSITORY } from '../../../domain/repositories/domain-event.repository.interface';
import { UserProjectionEntity } from '../entities/user-projection.entity';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor(
    @Inject(DOMAIN_EVENT_REPOSITORY)
    private readonly domainEventRepository: IDomainEventRepository,
    @InjectRepository(UserProjectionEntity)
    private readonly projectionRepository: Repository<UserProjectionEntity>,
  ) {}

  async handle(event: UserCreatedEvent) {
    await this.domainEventRepository.save(
      event.userId,
      'User',
      'UserCreatedEvent',
      {
        userId: event.userId,
        name: event.name,
        email: event.email,
        phone: event.phone,
        address: event.address,
        occurredAt: event.occurredAt,
      },
    );

    const projection = new UserProjectionEntity();
    projection.id = event.userId;
    projection.name = event.name;
    projection.email = event.email;
    projection.phone = event.phone;
    projection.address = event.address;
    projection.isActive = true;
    projection.createdAt = event.occurredAt;

    await this.projectionRepository.save(projection);

    console.log(`UserCreatedEvent handled for user: ${event.userId}`);
  }
}
