import express, { Request, Response, Router } from 'express'
import { v4 as guid } from 'uuid'
import faker from 'faker/locale/es'

export interface User {
  id: number
  username: string
  isAdmin: boolean
}

const userRouter = () => {
  const router: Router = express.Router()

  const get = (req: Request): User => {
    const user: User = req.session?.user ? req.session.user : { id: guid(), isAdmin: false, username: faker.name.findName() }
    return user
  }

  const set = (req: Request, user: User) => {
    if (req.session) {
      req.session.user = user
    }
  }

  router.get('/', (req: Request, res: Response) => {
    const user = get(req)
    set(req, user)

    res.status(200).send(user)
  })

  router.patch('/:id/isAdmin', (req: Request, res: Response) => {
    const user = get(req)
    //const id = req.params.id
    user.isAdmin = req.body.isAdmin
    set(req, user)
    res.status(200).send(user)
  })

  return router
}

export default userRouter
