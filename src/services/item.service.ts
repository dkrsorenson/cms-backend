import { appDataSource } from '../database/datasource'
import { Item } from '../models/item.model'

const itemRepository = appDataSource.getRepository(Item)

/**
 * Gets a list of items from the repository
 * @param id The item ID
 * @returns List of items
 */
export async function getItems(): Promise<Item[]> {
  return itemRepository.find()
}

/**
 * Gets the item by ID from the repository
 * @returns The item with the specified ID
 */
export async function getItemById(id: number): Promise<Item | null> {
  return itemRepository.findOneBy({ id: id })
}

/**
 * Creates an item in the repository
 */
export async function createItem(): Promise<void> {
  // return itemRepository.save()
  throw new Error(`Not implemented`)
}

/**
 * Updates an item in the repository
 * @param id The item ID
 */
export async function updateItem(id: number): Promise<void> {
  // const item = itemRepository.findOneBy({ id: id })

  throw new Error(`Not implemented`)
}
/**
 * Deletes an item from the repository
 */
export async function deleteItem(): Promise<void> {
  throw new Error(`Not implemented`)
}
