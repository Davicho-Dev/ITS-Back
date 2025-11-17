export interface IDomainEventRepository {
  save(
    aggregateId: string,
    aggregateType: string,
    eventType: string,
    payload: Record<string, any>,
    version?: number,
  ): Promise<void>;
  findByAggregateId(aggregateId: string): Promise<any[]>;
}

export const DOMAIN_EVENT_REPOSITORY = Symbol('DOMAIN_EVENT_REPOSITORY');
