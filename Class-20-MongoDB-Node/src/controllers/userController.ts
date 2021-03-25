import { Request, Response } from 'express'
import { v4 as guid } from 'uuid'
import { IUser } from '../interfaces/userInterface'
import faker from 'faker/locale/es'

// helpers
const getUser = (req: Request): IUser => {
  const user: IUser = req.session?.user ? req.session.user : { id: guid(), isAdmin: false, username: '[AUTOGENERADO] ' + faker.name.findName() }
  return user
}

const setUser = (req: Request, user: IUser) => {
  if (req.session) {
    req.session.user = user
  }
}

// main
export const userGet = (req: Request, res: Response) => {
  const user = getUser(req)
  setUser(req, user)

  res.status(200).send(user)
}

export const userUpdateIsAdmin = (req: Request, res: Response) => {
  const user = getUser(req)
  user.isAdmin = req.body.isAdmin
  setUser(req, user)

  res.status(200).send(user)
}
