import cartApi from './cartRoute'
import chatIo from './chatRoute'
import productsApi from './productRoute'
import productMockApi from './productMockRoute'
import userApi from './userRoute'

const router = (app: any, io: any) => {
  // socketIO
  chatIo(io)

  // routes
  app.use('/cart/api', cartApi())
  app.use('/products/api', productsApi(io))
  app.use('/productMock/api', productMockApi(io))
  app.use('/user/api', userApi())

  return this
}

export default router
