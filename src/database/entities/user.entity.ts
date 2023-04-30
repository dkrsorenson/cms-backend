import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm'

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  @Generated('uuid')
  uid!: string

  @Column({ unique: true })
  username!: string

  @Column({ name: 'pin_hash' })
  pinHash!: string

  @Column({ type: 'enum', enum: UserStatus })
  status!: UserStatus

  @Column({ name: 'created_at' })
  createdAt!: Date

  @Column({ name: 'updated_at' })
  updatedAt!: Date
}
