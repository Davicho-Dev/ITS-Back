export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly address?: string,
  ) {}
}
