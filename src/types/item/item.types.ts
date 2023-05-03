import { Item, ItemStatus, ItemVisibility } from '../../database/entities/item.entity'

export type FilterItemsPayload = {
  page?: number
  limit?: number
  sort?: string
  where?: string
}

export type GetItemsResponse = {
  count: number
  totalCount: number
  page: number
  perPageCount: number
  items: Item[]
}

export type GetItemResponse = {
  item: Item
}

export type CreateItemPayload = {
  userId: number
  title: string
  description: string
  status: ItemStatus
  visibility: ItemVisibility
}

export type CreateItemResponse = {
  id: number
}

export type UpdateItemPayload = {
  title?: string
  description?: string
  status?: ItemStatus
  visibility?: ItemVisibility
}

export type UpdateItemResponse = {
  message: string
}

export type DeleteItemResponse = {
  message: string
}
