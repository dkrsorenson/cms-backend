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
  UpdateItemPayload,
  UpdateItemResponse,
} from '../types/item/item.types'

const itemRepository = appDataSource.getRepository(Item)

/**
 * Gets a list of items from the repository
 * @returns The list of items response or an error response
 */
export async function getItems(): Promise<GetItemsResponse> {
  const items = await itemRepository.find({ where: { status: ItemStatus.Published } })

  return {
    count: items.length,
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
