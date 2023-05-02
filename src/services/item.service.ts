import { appDataSource } from '../database/datasource'
import { Item, ItemStatus } from '../database/entities/item.entity'

import { ErrorResponse } from '../types/errors/error.types'
import { StatusCode } from '../types/http-status-codes'
import { Result } from '../types/responses/response.types'
import {
  CreateItemPayload,
  CreateItemResponse,
  DeleteItemResponse,
  GetItemResponse,
  GetItemsResponse,
  FilterItemsPayload,
  UpdateItemPayload,
  UpdateItemResponse,
} from '../types/item/item.types'

const itemRepository = appDataSource.getRepository(Item)

/**
 * Gets a filtered, sorted, and/or paginated list of the user's items from the repository
 * @param userId The user's ID
 * @param payload Object containing filtering, pagination, and sorting information
 * @returns The list of items response or an error response
 */
export async function getItems(userId: number, payload: FilterItemsPayload): Promise<GetItemsResponse> {
  // Start the query builder
  let itemsQueryBuilder = itemRepository
    .createQueryBuilder('item')
    .select([
      'item.id',
      'item.title',
      'item.content',
      'item.status',
      'item.visibility',
      'item.createdAt',
      'item.updatedAt',
    ])
    .where({ userId: userId })

  // Add filters
  const properties = payload?.where ? JSON.parse(payload?.where) : null
  if (properties) {
    if (properties?.status) {
      itemsQueryBuilder.andWhere({ status: properties.status })
    }

    if (properties?.visibility) {
      itemsQueryBuilder.andWhere({ visibility: properties.visibility })
    }

    if (properties?.createdAt) {
      itemsQueryBuilder.andWhere(`date_trunc('day', "createdAt") = :createdAt`, {
        createdAt: properties.createdAt.format('yyyy-mm-dd'),
      })
    }
  }

  // Sort and order by fields
  if (payload?.sort) {
    const sortedFields = payload.sort.split(',')
    sortedFields.forEach(field => {
      const values = field.split(':')
      if (values.length !== 2) {
        return
      }

      const property = values[0]
      const direction = values[1].toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

      itemsQueryBuilder.orderBy(`item.${property}`, direction)
    })
  }

  // Paginate and limit if added
  const limit = payload?.limit ? payload.limit : 25
  const page = payload?.page ? payload.page : 1
  const offset = limit * (page - 1)

  itemsQueryBuilder.offset(offset)
  itemsQueryBuilder.limit(limit)

  const [items, count] = await itemsQueryBuilder.getManyAndCount()

  return {
    count: items.length,
    totalCount: count,
    page: page,
    perPageCount: limit,
    items: items,
  }
}

/**
 * Gets the item by ID from the repository only if it belongs to the specified user
 * @param id The item ID
 * @param id The user ID
 * @returns The item response or an error response
 */
export async function getItemById(id: number, userId: number): Promise<Result<GetItemResponse, ErrorResponse>> {
  const item = await itemRepository.findOne({ where: { id: id } })
  if (!item) {
    return {
      result: 'error',
      statusCode: StatusCode.NOT_FOUND,
      error: {
        message: 'Item not found.',
      },
    }
  }

  // If the item doesn't belong to the user, return forbidden error
  if (item.userId !== userId) {
    return {
      result: 'error',
      statusCode: StatusCode.FORBIDDEN,
      error: {
        message: 'You do not have permission to access this item.',
      },
    }
  }

  return {
    result: 'success',
    value: {
      item: item,
    },
  }
}

/**
 * Creates an item in the repository
 * @param payload The fields to create an item
 * @returns The created item response
 */
export async function createItem(payload: CreateItemPayload): Promise<Result<CreateItemResponse, ErrorResponse>> {
  const item = itemRepository.create({
    userId: payload.userId,
    title: payload.title,
    content: payload.content,
    status: payload.status,
    visibility: payload.visibility,
  })

  const createdItem = await itemRepository.save(item)

  return {
    result: 'success',
    value: {
      id: createdItem.id,
    },
  }
}

/**
 * Updates an item in the repository only if it belongs to the specified user
 * @param id The item ID
 * @param id The user ID
 * @returns The updated item response or an error response
 */
export async function updateItem(
  id: number,
  userId: number,
  payload: UpdateItemPayload,
): Promise<Result<UpdateItemResponse, ErrorResponse>> {
  const item = await itemRepository.findOne({ where: { id: id } })
  if (!item) {
    return {
      result: 'error',
      statusCode: StatusCode.NOT_FOUND,
      error: {
        message: 'Item not found.',
      },
    }
  }

  // If the item doesn't belong to the user, return forbidden error
  if (item.userId !== userId) {
    return {
      result: 'error',
      statusCode: StatusCode.FORBIDDEN,
      error: {
        message: 'You do not have permission to access this item.',
      },
    }
  }

  const updatedItem = await itemRepository.update({ id: id }, { ...payload })

  return {
    result: 'success',
    value: {
      message: 'Successfully updated item.',
    },
  }
}
/**
 * Deletes an item from the repository only if it belongs to the specified user
 * @param id The item ID
 * @param id The user ID
 * @returns The deleted item response or an error response
 */
export async function deleteItem(id: number, userId: number): Promise<Result<DeleteItemResponse, ErrorResponse>> {
  const item = await itemRepository.findOne({ where: { id: id, userId: userId } })
  if (!item) {
    return {
      result: 'error',
      statusCode: StatusCode.NOT_FOUND,
      error: {
        message: 'Item not found.',
      },
    }
  }

  // If the item doesn't belong to the user, return forbidden error
  if (item.userId !== userId) {
    return {
      result: 'error',
      statusCode: StatusCode.FORBIDDEN,
      error: {
        message: 'You do not have permission to access this item.',
      },
    }
  }

  await itemRepository.delete({ id: id })

  return {
    result: 'success',
    value: {
      message: 'Successfully deleted item.',
    },
  }
}

export default {
  getItemById,
  getItems,
  createItem,
  updateItem,
  deleteItem,
}
