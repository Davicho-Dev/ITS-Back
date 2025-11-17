export class Address {
  private readonly value: string;

  constructor(address: string) {
    if (!address || address.trim().length === 0) {
      throw new Error('Address cannot be empty');
    }
    if (address.length > 500) {
      throw new Error('Address is too long');
    }
    this.value = address.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Address): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
