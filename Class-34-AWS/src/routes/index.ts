import cartApi from './cartRoute'
import chatApi from './chatRoute'
import infoApi from './infoRoute'
import productsApi from './productRoute'
import productMockApi from './productMockRoute'
import userApi from './userRoute'

const router = (app: any, io: any) => {
  app.use('/api/cart', cartApi())
  app.use('/api/chat', chatApi(io))
  app.use('/api/info', infoApi())
  app.use('/api/products', productsApi(io))
  app.use('/api/productMock', productMockApi())
  app.use('/api/user', userApi())

  return this
}

export default router
