import { Request, Response } from 'express'
import { v4 as guid } from 'uuid'
import { IUser } from '../interfaces/userInterface'
// import faker from 'faker/locale/es'

// helpers
const getUser = (req: Request): IUser => {
  let user = req.session?.user //: IUser
  // let secondsDiff: any = user
  //   ? Number(Number(req.params.expiration) - Math.abs((new Date(new Date().toISOString()).getTime() - new Date(user.loginDate).getTime()) / 1000))
  //   : -1

  //I inherit settings from the previous session so the 60sec session expiration doesn't interfere with the test
  //|| secondsDiff < 0
  if (!user) {
    user = {
      id: guid(),
      isAdmin: false,
      username: req.params.user,
      loginDate: new Date().toISOString(),
      expiration: Number(req.params.expiration),
    }
    setUser(req, user)
  }

  //I save the user in the localStorage, so I when user request data from the server is because the session expired
  //So I update the loginDate since
  user.loginDate = new Date().toISOString()
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
  res.status(200).send(user)
}

export const userUpdateIsAdmin = (req: Request, res: Response) => {
  const user = getUser(req)
  user.isAdmin = req.body.isAdmin
  setUser(req, user)

  res.status(200).send(user)
}

export const userLogout = (req: Request, res: Response) => {
  req.session?.destroy(err => {
    if (err) {
      res.status(500).send({ status: 'ERROR', body: err })
      return
    }

    res.status(200).send('ok')
  })
}
