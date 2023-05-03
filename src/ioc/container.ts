import 'reflect-metadata'

import { Container } from 'inversify'
import { TYPES } from '../types/injectable.types'
import { dataSourceConfig } from '../configs/db.config'
import { DatabaseService, IDatabaseService } from '../database/database.service'
import { CheckUserMiddleware, CheckJwtMiddleware, ValidateRequestMiddleware } from '../middlewares'
import { IItemService, ItemService } from '../services/item.service'
import { AuthService, IAuthService } from '../services/auth.service'
import { IUserService, UserService } from '../services/user.service'
import { AuthController, IAuthController } from '../controllers/auth.controller'
import { IUserController, UserController } from '../controllers/user.controller'
import { IItemController, ItemController } from '../controllers/item.controller'

export function setupContainer(): Container {
  const container = new Container()

  container
    .bind<IDatabaseService>(TYPES.DatabaseService)
    .toDynamicValue(() => {
      return new DatabaseService(dataSourceConfig)
    })
    .inSingletonScope()

  // Middlewares
  container.bind<CheckUserMiddleware>(CheckUserMiddleware).toSelf()
  container.bind<CheckJwtMiddleware>(CheckJwtMiddleware).toSelf()
  container.bind<ValidateRequestMiddleware>(ValidateRequestMiddleware).toSelf()

  // Services
  container.bind<IAuthService>(TYPES.AuthService).to(AuthService)
  container.bind<IUserService>(TYPES.UserService).to(UserService)
  container.bind<IItemService>(TYPES.ItemService).to(ItemService)

  // Controllers
  container.bind<IAuthController>(TYPES.AuthController).to(AuthController)
  container.bind<IUserController>(TYPES.UserController).to(UserController)
  container.bind<IItemController>(TYPES.ItemController).to(ItemController)

  return container
}
