import { Product } from './product'

export interface Cart {
  id: string
  timestamp: string
  products: Array<Product>
}
