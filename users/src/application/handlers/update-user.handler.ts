import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateUserCommand } from '../commands/update-user.command';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const { id, name, email, phone, address } = command;

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    if (email && email !== user.getEmail().getValue()) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    user.updateProfile(name, email, phone, address);

    const userWithEvents = this.publisher.mergeObjectContext(user);

    await this.userRepository.save(userWithEvents);

    userWithEvents.commit();
  }
}
