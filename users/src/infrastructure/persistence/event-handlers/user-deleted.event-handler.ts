import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDeletedEvent } from '../../../domain/events/user-deleted.event';
import type { IDomainEventRepository } from '../../../domain/repositories/domain-event.repository.interface';
import { DOMAIN_EVENT_REPOSITORY } from '../../../domain/repositories/domain-event.repository.interface';
import { UserProjectionEntity } from '../entities/user-projection.entity';

@EventsHandler(UserDeletedEvent)
export class UserDeletedEventHandler
  implements IEventHandler<UserDeletedEvent>
{
  constructor(
    @Inject(DOMAIN_EVENT_REPOSITORY)
    private readonly domainEventRepository: IDomainEventRepository,
    @InjectRepository(UserProjectionEntity)
    private readonly projectionRepository: Repository<UserProjectionEntity>,
  ) {}

  async handle(event: UserDeletedEvent) {
    await this.domainEventRepository.save(
      event.userId,
      'User',
      'UserDeletedEvent',
      {
        userId: event.userId,
        occurredAt: event.occurredAt,
      },
    );

    const projection = await this.projectionRepository.findOne({
      where: { id: event.userId },
    });

    if (projection) {
      projection.isActive = false;
      await this.projectionRepository.save(projection);
    }

    console.log(`UserDeletedEvent handled for user: ${event.userId}`);
  }
}
