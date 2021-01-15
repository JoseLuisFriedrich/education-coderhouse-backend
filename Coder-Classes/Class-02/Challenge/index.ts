const operation = (number1: number, number2: number, operator: string): Promise<number> => {
  return new Promise(resolve => {
    let operationModule: string

    switch (operator) {
      case '+':
        operationModule = './Operation_Addition.js'
        break
      case '-':
        operationModule = './Operation_Subtraction.js'
        break
      default:
        throw new Error('incorrect operator')
    }

    import(operationModule).then(response => resolve(new response.Operation(number1, number2).Result()))
  })
}

const operations = async () => {
  const addition: number = await operation(2, 2, '+')
  const substraction: number = await operation(4, 2, '-')

  console.log('+ =>', addition)
  console.log('- =>', substraction)
}

operations()
