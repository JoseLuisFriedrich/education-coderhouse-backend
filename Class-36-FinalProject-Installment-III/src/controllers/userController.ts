import { Request, Response } from 'express'
import { IUser } from '../interfaces/userInterface'
import * as db from '../models/userModel'
import * as mail from '../helpers/mailHelper'

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

export const userIsAuthenticated = async (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user: IUser | null = await db.userGetById((req.user as IUser).id)
    if (user) {
      setUser(req, user)
      res.status(200).send(user)
    } else {
      res.status(200).send(req.user)
    }
  } else {
    res.status(401).send('ERROR')
  }
}

export const userLogout = async (req: Request, res: Response) => {
  req.session?.destroy(err => {
    if (err) {
      res.status(500).send({ status: 'ERROR', body: err })
      return
    }
  })

  req.logout()
  await mail.send('Facebook Logout')
  res.status(200).send('ok')
}

export const userUpdateIsAdmin = async (req: Request, res: Response) => {
  const user = getUser(req)
  user.isAdmin = req.body.isAdmin

  await db.userUpdateIsAdmin(user.userName, user.isAdmin)
  setUser(req, user)

  res.status(200).send(user)
}
