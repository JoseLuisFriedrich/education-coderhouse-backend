import { Request, Response } from 'express'
import { v4 as guid } from 'uuid'
import { User } from '../interfaces/user'
import faker from 'faker/locale/es'

// Helper
const get = (req: Request): User => {
  const user: User = req.session?.user ? req.session.user : { id: guid(), isAdmin: false, username: faker.name.findName() }
  return user
}

const set = (req: Request, user: User) => {
  if (req.session) {
    req.session.user = user
  }
}

// Main
export const userGet = (req: Request, res: Response) => {
  const user = get(req)
  set(req, user)

  res.status(200).send(user)
}

export const userUpdateIsAdmin = (req: Request, res: Response) => {
  const user = get(req)
  user.isAdmin = req.body.isAdmin
  set(req, user)
  res.status(200).send(user)
}
