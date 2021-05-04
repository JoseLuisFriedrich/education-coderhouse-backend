import bCrypt from 'bcrypt'
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

export const createHash = password => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

export const isValidPassword = (password1, password2) => {
  return bCrypt.compareSync(password1, password2)
}

// main
// export const userGet = async (req: Request, res: Response) => {
//   const user: IUser = { ...req.body }

//   const dbUser = await db.userGetByUserName(user.userName)
//   if (dbUser && isValidPassword(user.password, dbUser.password)) {
//     dbUser.loginDate = new Date().toISOString()
//     dbUser.expiration = Number(user.expiration)
//     setUser(req, user)
//     res.status(200).send(dbUser.toObject())
//   } else {
//     res.status(409).send('user does not exists / incorrect')
//   }
// }

// export const userCreate = async (req: Request, res: Response) => {
//   const user: IUser = { ...req.body }

//   if (await db.userGetByUserName(user.userName)) {
//     res.status(409).send('user already exists')
//   } else {
//     user.isAdmin = false
//     user.loginDate = new Date().toISOString()
//     user.expiration = Number(user.expiration)
//     user.password = createHash(user.password)
//     setUser(req, user)
//     await db.userInsert(user)
//     res.status(201).send(user)
//   }
// }

export const userUpdateIsAdmin = async (req: Request, res: Response) => {
  const user = getUser(req)
  user.isAdmin = req.body.isAdmin

  await db.userUpdateIsAdmin(user.userName, user.isAdmin)
  setUser(req, user)

  res.status(200).send(user)
}

// export const userLogout = (req: Request, res: Response) => {
//   req.session?.destroy(err => {
//     if (err) {
//       res.status(500).send({ status: 'ERROR', body: err })
//       return
//     }

//     res.status(200).send('ok')
//   })
// }
