import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column()
  description!: string

  @Column({ name: 'is_active' })
  isActive!: boolean
}
