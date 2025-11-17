import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('domain_events')
export class DomainEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  aggregateId: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  aggregateType: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  eventType: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ type: 'int', default: 1 })
  version: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Index()
  occurredAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  userId: string;
}
