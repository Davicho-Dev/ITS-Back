import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IDomainEventRepository } from '../../../domain/repositories/domain-event.repository.interface';
import { DomainEventEntity } from '../entities/domain-event.entity';

@Injectable()
export class DomainEventRepository implements IDomainEventRepository {
  constructor(
    @InjectRepository(DomainEventEntity)
    private readonly eventRepository: Repository<DomainEventEntity>,
  ) {}

  async save(
    aggregateId: string,
    aggregateType: string,
    eventType: string,
    payload: Record<string, any>,
    version = 1,
  ): Promise<void> {
    const event = new DomainEventEntity();
    event.aggregateId = aggregateId;
    event.aggregateType = aggregateType;
    event.eventType = eventType;
    event.payload = payload;
    event.version = version;

    await this.eventRepository.save(event);
  }

  async findByAggregateId(aggregateId: string): Promise<any[]> {
    return this.eventRepository.find({
      where: { aggregateId },
      order: { occurredAt: 'ASC' },
    });
  }
}
