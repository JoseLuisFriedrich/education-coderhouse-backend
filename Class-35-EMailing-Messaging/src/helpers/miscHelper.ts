export const arg = (index, defaultValue: any = null) => {
  let result: string | null = defaultValue

  let args = process.argv
  const lastArg = args[args.length - 1]
  if (lastArg.includes(' ')) {
    args.pop()
    args.push(...lastArg.split(' '))
  }

  if (args.length > index + 2) {
    result = args[index + 2]
  }

  return result
}
