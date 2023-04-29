import { appDataSource } from '../database/database'
import { Items } from '../models/items.model'

const itemsRepository = appDataSource.getRepository(Items)

/**
 * Gets a list of items from the repository
 * @returns List of items
 */
export async function getItems(): Promise<Items[]> {
  return itemsRepository.find()
}
