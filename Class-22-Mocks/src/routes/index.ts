import cartApi from './cartRoute'
import chatIo from './chatRoute'
import productsApi from './productRoute'
import productMockApi from './productMockRoute'
import userApi from './userRoute'

const router = (app: any, io: any) => {
  // socketIO
  chatIo(io)

  // routes
  app.use('/api/cart', cartApi())
  app.use('/api/products', productsApi(io))
  app.use('/api/productMock', productMockApi(io))
  app.use('/api/user', userApi())

  return this
}

export default router
