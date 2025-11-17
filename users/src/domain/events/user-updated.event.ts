export class UserUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phone?: string | null,
    public readonly address?: string | null,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
