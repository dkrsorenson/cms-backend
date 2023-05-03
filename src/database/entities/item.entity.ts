import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum ItemStatus {
  Active = 'active',
  Draft = 'draft',
  Inactive = 'inactive',
  Archived = 'archived',
}

export enum ItemVisibility {
  Public = 'public',
  Private = 'private',
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
  description!: string

  @Column({ type: 'enum', enum: ItemStatus })
  status!: ItemStatus

  @Column({ type: 'enum', enum: ItemVisibility })
  visibility!: ItemVisibility

  @Column({ name: 'created_at', update: false })
  createdAt!: Date

  @Column({ name: 'updated_at', update: false })
  updatedAt!: Date
}
