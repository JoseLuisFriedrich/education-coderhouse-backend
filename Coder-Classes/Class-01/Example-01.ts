let variable: string = 'jlf'
console.log(variable)

interface User {
  name: string
  id: number
}

class NuevaCuenta implements User {
  name: string
  id: number

  constructor(name: string, id: number) {
    this.name = name
    this.id = id
  }
}

const user: User = new NuevaCuenta('pepe2', 1583)
console.log(user)
