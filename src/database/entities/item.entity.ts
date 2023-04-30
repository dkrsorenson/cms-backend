import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum ItemStatus {
  Active = 'active',
  Inactive = 'inactive',
}

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'user_id', foreignKeyConstraintName: 'fk_item_user_id' })
  userId!: number

  @Column()
  title!: string

  @Column()
  content!: string

  @Column({ type: 'enum', enum: ItemStatus })
  status!: ItemStatus

  @Column({ name: 'created_at' })
  createdAt!: Date

  @Column({ name: 'updated_at' })
  updatedAt!: Date
}
