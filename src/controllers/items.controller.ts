import { Request, Response } from 'express'

import { getItems } from '../services/items.service'

/**
 * Handles request for the list of items
 * @param req The request object
 * @param res The response object
 */
export async function list(req: Request, res: Response): Promise<void> {
  try {
    const items = await getItems()

    res.status(200).json(items)
  } catch (err) {
    console.error(err)
    res.status(400).json('message: Failed to retrieve list of items')
  }
}
