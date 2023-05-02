import { Router } from 'express'
import { StatusCode } from '../types/http-status-codes'

export const nonexistentRouter = Router()

nonexistentRouter.use('*', (req, res) => {
  res.status(StatusCode.NOT_FOUND).send({ message: 'Sorry, nothing to see here.' })
})

export default nonexistentRouter
