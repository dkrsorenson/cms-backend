import { inject, injectable } from 'inversify'
import { Repository } from 'typeorm'

import { IDatabaseService } from '../database/database.service'
import { Item } from '../database/entities/item.entity'

import { TYPES } from '../types/injectable.types'
import { ErrorResponse } from '../types/errors/error.types'
import { StatusCode } from '../types/http-status-codes'
import { Result } from '../types/result.type'
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

export interface IItemService {
  getItems(userId: number, payload: FilterItemsPayload): Promise<GetItemsResponse>
  getItemById(id: number, userId: number): Promise<Result<GetItemResponse, ErrorResponse>>
  createItem(payload: CreateItemPayload): Promise<Result<CreateItemResponse, ErrorResponse>>
  updateItem(id: number, userId: number, payload: UpdateItemPayload): Promise<Result<UpdateItemResponse, ErrorResponse>>
  deleteItem(id: number, userId: number): Promise<Result<DeleteItemResponse, ErrorResponse>>
}

@injectable()
export class ItemService implements IItemService {
  private itemRepository: Repository<Item>

  constructor(@inject(TYPES.DatabaseService) databaseService: IDatabaseService) {
    this.itemRepository = databaseService.getRepository(Item)
  }

  /**
   * Gets a filtered, sorted, and/or paginated list of the user's items from the repository
   * @param userId The user's ID
   * @param payload Object containing filtering, pagination, and sorting information
   * @returns The list of items response or an error response
   */
  async getItems(userId: number, payload: FilterItemsPayload): Promise<GetItemsResponse> {
    // Start the query builder
    const itemsQueryBuilder = this.itemRepository
      .createQueryBuilder('item')
      .select([
        'item.id',
        'item.title',
        'item.description',
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
    }

    // Sort and order by fields
    if (payload?.sort) {
      const columnNames = this.itemRepository.metadata.columns.map(x => x.propertyName)
      const sortedFields = payload.sort.split(',')
      sortedFields.forEach(field => {
        const values = field.split(':')
        if (values.length !== 2) {
          return
        }

        const property = values[0]
        const direction = values[1].toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

        if (columnNames.includes(property)) {
          itemsQueryBuilder.orderBy(`item.${property}`, direction)
        }
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
  async getItemById(id: number, userId: number): Promise<Result<GetItemResponse, ErrorResponse>> {
    const item = await this.itemRepository.findOne({
      select: ['id', 'title', 'description', 'status', 'visibility', 'createdAt', 'updatedAt'],
      where: { id: id, userId: userId },
    })

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
  async createItem(payload: CreateItemPayload): Promise<Result<CreateItemResponse, ErrorResponse>> {
    const item = this.itemRepository.create({
      userId: payload.userId,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      visibility: payload.visibility,
    })

    const createdItem = await this.itemRepository.save(item)

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
  async updateItem(
    id: number,
    userId: number,
    payload: UpdateItemPayload,
  ): Promise<Result<UpdateItemResponse, ErrorResponse>> {
    const item = await this.itemRepository.findOne({ where: { id: id, userId: userId } })
    if (!item) {
      return {
        result: 'error',
        statusCode: StatusCode.NOT_FOUND,
        error: {
          message: 'Item not found.',
        },
      }
    }

    await this.itemRepository.update({ id: id }, { ...payload })

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
  async deleteItem(id: number, userId: number): Promise<Result<DeleteItemResponse, ErrorResponse>> {
    const item = await this.itemRepository.findOne({ where: { id: id, userId: userId } })
    if (!item) {
      return {
        result: 'error',
        statusCode: StatusCode.NOT_FOUND,
        error: {
          message: 'Item not found.',
        },
      }
    }

    await this.itemRepository.delete({ id: id })

    return {
      result: 'success',
      value: {
        message: 'Successfully deleted item.',
      },
    }
  }
}
