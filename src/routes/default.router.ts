import { Router } from 'express'
import { StatusCode } from '../types/http-status-codes'

export const defaultRouter = Router()

defaultRouter.get('/', (req, res) => {
  res.status(StatusCode.OK).send('Hey there!')
})

export default defaultRouter
