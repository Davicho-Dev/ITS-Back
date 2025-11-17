import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Phone } from '../../../domain/value-objects/phone.vo';
import { Address } from '../../../domain/value-objects/address.vo';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const userEntity = this.toEntity(user);
    const savedEntity = await this.userRepository.save(userEntity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
    });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findAll(): Promise<User[]> {
    const userEntities = await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    return userEntities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.getId();
    entity.name = user.getName();
    entity.email = user.getEmail().getValue();
    entity.phone = user.getPhone()?.getValue() ?? null;
    entity.address = user.getAddress()?.getValue() ?? null;
    entity.isActive = user.getIsActive();
    entity.createdAt = user.getCreatedAt();
    entity.updatedAt = user.getUpdatedAt();
    return entity;
  }

  private toDomain(entity: UserEntity): User {
    const email = new Email(entity.email);
    const phone = entity.phone ? new Phone(entity.phone) : null;
    const address = entity.address ? new Address(entity.address) : null;

    return new User(
      entity.id,
      entity.name,
      email,
      phone,
      address,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
