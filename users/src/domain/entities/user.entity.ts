import { AggregateRoot } from '@nestjs/cqrs';
import { Email } from '../value-objects/email.vo';
import { Phone } from '../value-objects/phone.vo';
import { Address } from '../value-objects/address.vo';
import {
  UserCreatedEvent,
  UserDeletedEvent,
  UserUpdatedEvent,
} from '../events';

export class User extends AggregateRoot {
  constructor(
    private readonly id: string,
    private name: string,
    private email: Email,
    private phone: Phone | null,
    private address: Address | null,
    private isActive: boolean = true,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {
    super();
  }

  static create(
    id: string,
    name: string,
    emailValue: string,
    phoneValue?: string,
    addressValue?: string,
  ): User {
    const email = new Email(emailValue);
    const phone = phoneValue ? new Phone(phoneValue) : null;
    const address = addressValue ? new Address(addressValue) : null;

    const user = new User(id, name, email, phone, address);

    user.apply(
      new UserCreatedEvent(
        id,
        name,
        email.getValue(),
        phone?.getValue() ?? null,
        address?.getValue() ?? null,
      ),
    );

    return user;
  }

  updateProfile(
    name?: string,
    emailValue?: string,
    phoneValue?: string,
    addressValue?: string,
  ): void {
    if (name) this.name = name;
    if (emailValue) this.email = new Email(emailValue);
    if (phoneValue !== undefined) {
      this.phone = phoneValue ? new Phone(phoneValue) : null;
    }
    if (addressValue !== undefined) {
      this.address = addressValue ? new Address(addressValue) : null;
    }

    this.updatedAt = new Date();

    this.apply(
      new UserUpdatedEvent(this.id, name, emailValue, phoneValue, addressValue),
    );
  }

  delete(): void {
    this.isActive = false;
    this.apply(new UserDeletedEvent(this.id));
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getPhone(): Phone | null {
    return this.phone;
  }

  getAddress(): Address | null {
    return this.address;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.getValue(),
      phone: this.phone?.getValue() ?? null,
      address: this.address?.getValue() ?? null,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
