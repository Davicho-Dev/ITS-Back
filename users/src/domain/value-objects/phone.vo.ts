export class Phone {
  private readonly value: string;

  constructor(phone: string) {
    if (!this.isValid(phone)) {
      throw new Error('Invalid phone format');
    }
    this.value = phone.trim();
  }

  private isValid(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\(\)\+]{7,20}$/;

    return phoneRegex.test(phone);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
