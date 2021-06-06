import bCrypt from 'bcrypt'
import { Request, Response } from 'express'

import { IUser } from '../interfaces/userInterface'
import * as db from '../models/userModel'
import * as mail from '../helpers/mailHelper'

// helpers
const getUser = (req: Request): IUser | null => {
  let user = null
  if (req.isAuthenticated()) {
    user = req.session?.passport.user
  }

  return user
}

export const createHash = password => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

export const isValidPassword = (password1, password2) => {
  return bCrypt.compareSync(password1, password2)
}

export const userSignup = async (req: Request, res: Response) => {
  res.status(200).send(req.user)
}

export const userLogin = async (req: Request, res: Response) => {
  res.status(200).send(req.user)
}

export const userLogout = async (req: Request, res: Response) => {
  await mail.send('Logout')
  req.logout()
  res.status(200).send('OK')
}

export const userIsAuthenticated = async (req: Request, res: Response) => {
  const user = getUser(req)
  if (user) {
    res.status(200).send(user)
  } else {
    res.status(401).send('ERROR')
  }
}

export const userUpdateIsAdmin = async (req: Request, res: Response) => {
  const user = getUser(req)

  if (user) {
    user.isAdmin = req.body.isAdmin
    await db.userUpdateIsAdmin(user.userName, user.isAdmin)
  }

  res.status(200).send(user)
}
