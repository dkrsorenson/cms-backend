import { appDataSource } from '../database/datasource'
import { Item } from '../database/entities/item.entity'

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
 * @param id The item ID
 * @returns The list of items response or an error response
 */
export async function getItems(): Promise<GetItemsResponse> {
  const items = await itemRepository.find()

  return {
    count: items.length,
    items: items,
  }
}

/**
 * Gets the item by ID from the repository
 * @param id The item ID
 * @returns The item response or an error response
 */
export async function getItemById(id: number): Promise<Result<GetItemResponse, ErrorResponse>> {
  const item = await itemRepository.findOneBy({ id: id })

  if (!item) {
    return {
      result: 'error',
      statusCode: StatusCode.NOT_FOUND,
      error: {
        message: 'Item not found.',
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
export async function createItem(payload: CreateItemPayload): Promise<CreateItemResponse> {
  const item = itemRepository.create({
    userId: payload.userId,
    title: payload.title,
    content: payload.content,
    status: payload.status,
    visibility: payload.visibility,
  })

  const createdItem = await itemRepository.save(item)

  return {
    id: createdItem.id,
  }
}

/**
 * Updates an item in the repository
 * @param id The item ID
 * @returns The updated item response or an error response
 */
export async function updateItem(
  id: number,
  payload: UpdateItemPayload,
): Promise<Result<UpdateItemResponse, ErrorResponse>> {
  const item = await itemRepository.findOne({ where: { id: id } })
  if (!item) {
    console.error(`Item not found [item ID: ${id}]`)

    return {
      result: 'error',
      statusCode: StatusCode.NOT_FOUND,
      error: {
        message: 'Item not found.',
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
 * Deletes an item from the repository
 * @param id The item ID
 * @returns The deleted item response or an error response
 */
export async function deleteItem(id: number): Promise<Result<DeleteItemResponse, ErrorResponse>> {
  const item = await itemRepository.findOne({ where: { id: id } })
  if (!item) {
    console.error(`Item not found [item ID: ${id}]`)

    return {
      result: 'error',
      statusCode: StatusCode.NOT_FOUND,
      error: {
        message: 'Item not found.',
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
