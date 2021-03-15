import { Product } from './product'

export interface ICart {
  id: string
  timestamp: string
  products: Array<Product>
}
