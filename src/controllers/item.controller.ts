import { Request, Response } from 'express'
import { inject } from 'inversify'
import { controller, httpPost, httpGet, httpDelete, httpPatch } from 'inversify-express-utils'

import { StatusCode } from '../types/http-status-codes'
import { TYPES } from '../types/injectable.types'

import { ItemStatus, ItemVisibility } from '../database/entities/item.entity'

import { CheckUserMiddleware, CheckJwtMiddleware, ValidateRequestMiddleware } from '../middlewares'
import {
  createItemValidator,
  deleteItemValidator,
  getItemByIdValidator,
  getItemsValidator,
  updateItemValidator,
} from '../middlewares/validators/item.validators'

import { IItemService } from '../services/item.service'

export interface IItemController {
  listItems(req: Request, res: Response): Promise<void>
  getItemById(req: Request, res: Response): Promise<void>
  createItem(req: Request, res: Response): Promise<void>
  updateItem(req: Request, res: Response): Promise<void>
  deleteItem(req: Request, res: Response): Promise<void>
}

@controller('/api/v1/items')
export class ItemController implements IItemController {
  @inject(TYPES.ItemService) itemService!: IItemService

  /**
   * Handles request to retrieve the filtered, sorted, and paginated list of the user's items
   * @param req The request object
   * @param res The response object
   */
  @httpGet('/', CheckJwtMiddleware, CheckUserMiddleware, ...getItemsValidator, ValidateRequestMiddleware)
  async listItems(req: Request, res: Response): Promise<void> {
    try {
      // Verify user was set
      if (!req.user) {
        throw new Error('An unexpected error occurred. Could not identify user.')
      }

      // Get all qs options
      const queryObj = { ...req.query }

      // Get the item properties to filter by
      // Note: Excluding filtering by create/updated at date for now
      const excludedFields = ['page', 'sort', 'limit']
      excludedFields.forEach(x => delete queryObj[x])

      // Build qs for where clause
      const queryString = JSON.stringify(queryObj)

      const response = await this.itemService.getItems(req.user.id, {
        page: Number(req.query?.page),
        limit: Number(req.query?.limit),
        sort: String(req.query?.sort),
        where: queryString,
      })

      res.status(StatusCode.OK).json(response)
    } catch (err) {
      console.error(err)
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch list of items.' })
    }
  }

  /**
   * Handles request to get an item by ID
   * @param req The request object
   * @param res The response object
   */
  @httpGet('/:id', CheckJwtMiddleware, CheckUserMiddleware, ...getItemByIdValidator, ValidateRequestMiddleware)
  async getItemById(req: Request, res: Response): Promise<void> {
    try {
      // Verify user was set
      if (!req.user) {
        throw new Error('An unexpected error occurred. Could not identify user.')
      }

      // Get params
      const { id } = req.params
      const itemId = parseInt(id)

      const response = await this.itemService.getItemById(itemId, req.user.id)

      if (response.result === 'success') {
        res.status(StatusCode.OK).json(response.value)
      } else {
        res.status(response.statusCode).json(response.error)
      }
    } catch (err) {
      console.error(err)
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch item.' })
    }
  }

  /**
   * Handles request to create a new item
   * @param req The request object
   * @param res The response object
   */
  @httpPost('/', CheckJwtMiddleware, CheckUserMiddleware, ...createItemValidator, ValidateRequestMiddleware)
  async createItem(req: Request, res: Response): Promise<void> {
    try {
      // Verify user was set
      if (!req.user) {
        throw new Error('An unexpected error occurred. Could not identify user.')
      }

      // Get req body
      const { title, description, status, visibility } = req.body

      const response = await this.itemService.createItem({
        userId: req.user.id,
        title: title,
        description: description,
        status: <ItemStatus>status,
        visibility: <ItemVisibility>visibility,
      })

      if (response.result === 'success') {
        res.status(StatusCode.CREATED).json(response.value)
      } else {
        res.status(response.statusCode).json(response.error)
      }
    } catch (err) {
      console.error(err)
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to save item.' })
    }
  }

  /**
   * Handles request to update an item by ID
   * @param req The request object
   * @param res The response object
   */
  @httpPatch('/:id', CheckJwtMiddleware, CheckUserMiddleware, ...updateItemValidator, ValidateRequestMiddleware)
  async updateItem(req: Request, res: Response): Promise<void> {
    try {
      // Verify user was set
      if (!req.user) {
        throw new Error('An unexpected error occurred. Could not identify user.')
      }

      // Get params
      const { id } = req.params
      const itemId = parseInt(id)

      const response = await this.itemService.updateItem(itemId, req.user.id, {
        title: req.body?.title,
        description: req.body?.description,
        status: req.body?.status,
        visibility: req.body?.visibility,
      })

      if (response.result === 'success') {
        res.status(StatusCode.OK).json(response.value)
      } else {
        res.status(response.statusCode).json(response.error)
      }
    } catch (err) {
      console.error(err)
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update item.' })
    }
  }

  /**
   * Handles request to delete an item by ID
   * @param req The request object
   * @param res The response object
   */
  @httpDelete('/:id', CheckJwtMiddleware, CheckUserMiddleware, ...deleteItemValidator, ValidateRequestMiddleware)
  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      // Verify user was set
      if (!req.user) {
        throw new Error('An unexpected error occurred. Could not identify user.')
      }

      // Get params
      const { id } = req.params
      const itemId = parseInt(id)

      const response = await this.itemService.deleteItem(itemId, req.user.id)

      if (response.result === 'success') {
        res.status(StatusCode.OK).json(response.value)
      } else {
        res.status(response.statusCode).json(response.error)
      }
    } catch (err) {
      console.error(err)
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete item.' })
    }
  }
}
