export class CreateUserCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly phone?: string,
    public readonly address?: string,
  ) {}
}
