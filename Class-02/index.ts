const operation = (number1: number, number2: number, operator: string): Promise<number> => {
  return new Promise(async resolve => {
    let operationModule: string

    switch (operator) {
      case '+':
        operationModule = './Operation_Addition'
        break
      case '-':
        operationModule = './Operation_Subtraction'
        break
      default:
        throw new Error('incorrect operator')
    }

    const module = await import(operationModule)
    const result = new module.Operation(number1, number2).Result()
    resolve(result)
  })
}

const operations = async () => {
  const addition: number = await operation(4, 2, '+')
  const substraction: number = await operation(4, 2, '-')

  console.log('+ =>', addition)
  console.log('- =>', substraction)
}

operations()
