import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum ItemStatus {
  Published = 'published',
  Draft = 'draft',
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
  content!: string

  @Column({ type: 'enum', enum: ItemStatus })
  status!: ItemStatus

  @Column({ type: 'enum', enum: ItemVisibility })
  visibility!: ItemVisibility

  @Column({ name: 'created_at' })
  createdAt!: Date

  @Column({ name: 'updated_at' })
  updatedAt!: Date
}
