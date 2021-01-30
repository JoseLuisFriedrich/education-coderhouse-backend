import fs from 'fs'

class FileClass {
  filePath: string
  lastId: number = 0
  products: Array<any> = []

  constructor(filePath: string) {
    this.filePath = filePath

    this.products = this.read()
    if (this.products.length > 0) {
      this.lastId = this.products[this.products.length - 1].id
    }
  }

  read(): Array<any> {
    try {
      const products: string = fs.readFileSync(this.filePath, 'utf-8')
      return JSON.parse(products)
    } catch (ex) {
      console.log("file either don't exist or has errors")
      return []
    }
  }

  showInConsole() {
    this.products.map(product => console.log(product))
  }

  async append(product: Object) {
    this.lastId += 1

    product = { id: this.lastId, ...product }
    console.log('added', product)

    this.products.push(product)

    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(this.products, null, 2))
    } catch (ex) {
      console.log(ex)
    }
  }
}

const file: FileClass = new FileClass('D:/products.txt')
file.showInConsole()
file.append({ title: 'Generic Wooden Towels', price: 123.45 })
file.append({ title: 'Gorgeous Rubber Chair', price: 678.99 })
