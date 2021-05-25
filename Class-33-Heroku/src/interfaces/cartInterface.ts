// interface
export interface ICartProduct {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
}

export interface ICart {
  id: string
  timestamp: string
  products: Array<ICartProduct>
}
