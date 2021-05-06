import { Request, Response } from 'express'
import { IUser } from '../interfaces/userInterface'
import * as db from '../models/userModel'

// helpers
const getUser = (req: Request): IUser => {
  let user = req.session?.user
  return user
}

export const setUser = (req: Request, user: IUser) => {
  if (req.session) {
    req.session.user = user
  }
}

export const userUpdateIsAdmin = async (req: Request, res: Response) => {
  const user = getUser(req)
  user.isAdmin = req.body.isAdmin

  await db.userUpdateIsAdmin(user.userName, user.isAdmin)
  setUser(req, user)

  res.status(200).send(user)
}
