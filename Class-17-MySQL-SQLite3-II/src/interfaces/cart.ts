import { IProduct } from './product'

export interface ICart {
  id: string
  timestamp: string
  products: Array<IProduct>
}
