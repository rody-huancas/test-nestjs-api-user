import { hashValue } from '@shared/lib/bcrypt';
import { calculateAge } from '@shared/utils/functions.utils';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  idUser: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: ['user', 'admin', 'moderator'], default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async setInsertFields() {
    this.age      = calculateAge(this.birthDate);
    this.email    = this.email.toLowerCase().trim();
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
    this.password = await hashValue(this.password);
  }

  @BeforeUpdate()
  async setUpdateFields() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }

    if (this.firstName !== undefined || this.lastName !== undefined) {
      const firstName = this.firstName || '';
      const lastName  = this.lastName  || '';
      this.fullName   = `${firstName} ${lastName}`.trim();
    }

    if (this.birthDate) {
      this.age = calculateAge(this.birthDate);
    }

     if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
}
