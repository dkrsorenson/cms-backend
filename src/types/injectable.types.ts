const TYPES = {
  AuthService: Symbol.for('IAuthService'),
  UserService: Symbol.for('IUserService'),
  ItemService: Symbol.for('IItemService'),
  AuthController: Symbol.for('IAuthController'),
  UserController: Symbol.for('IUserController'),
  ItemController: Symbol.for('IItemController'),
  BaseController: Symbol.for('IBaseController'),
  DatabaseService: Symbol.for('IDatabaseService'),
}

export { TYPES }
