import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserUpdatedEvent } from '../../../domain/events/user-updated.event';
import type { IDomainEventRepository } from '../../../domain/repositories/domain-event.repository.interface';
import { DOMAIN_EVENT_REPOSITORY } from '../../../domain/repositories/domain-event.repository.interface';
import { UserProjectionEntity } from '../entities/user-projection.entity';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedEventHandler
  implements IEventHandler<UserUpdatedEvent>
{
  constructor(
    @Inject(DOMAIN_EVENT_REPOSITORY)
    private readonly domainEventRepository: IDomainEventRepository,
    @InjectRepository(UserProjectionEntity)
    private readonly projectionRepository: Repository<UserProjectionEntity>,
  ) {}

  async handle(event: UserUpdatedEvent) {
    await this.domainEventRepository.save(
      event.userId,
      'User',
      'UserUpdatedEvent',
      {
        userId: event.userId,
        name: event.name,
        email: event.email,
        phone: event.phone,
        address: event.address,
        occurredAt: event.occurredAt,
      },
    );

    const projection = await this.projectionRepository.findOne({
      where: { id: event.userId },
    });

    if (projection) {
      if (event.name) projection.name = event.name;
      if (event.email) projection.email = event.email;
      if (event.phone !== undefined) projection.phone = event.phone;
      if (event.address !== undefined) projection.address = event.address;

      await this.projectionRepository.save(projection);
    }

    console.log(`UserUpdatedEvent handled for user: ${event.userId}`);
  }
}
