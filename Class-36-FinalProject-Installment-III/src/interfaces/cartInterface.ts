// interface
export interface ICartProduct {
  _id: string
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
