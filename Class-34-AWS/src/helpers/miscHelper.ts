export const arg = (index, defaultValue: any = '') => {
  let result: string = defaultValue

  if (process.argv.length > index + 2) {
    result = process.argv[index + 2]
  }

  return result
}
