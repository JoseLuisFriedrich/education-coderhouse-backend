export const arg = (index, defaultValue: any = null) => {
  let result: string | null = defaultValue

  if (process.argv.length > index + 2) {
    result = process.argv[index + 2]
  }

  return result
}
