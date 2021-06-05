import { decrypt } from './cryptHelper'

export const arg = (index, defaultValue: any = '') => {
  let result: string = defaultValue

  let args = process.argv
  const lastArg = args[args.length - 1]
  if (lastArg.includes(' ')) {
    args.pop()
    args.push(...lastArg.split(' '))
  }

  if (args.length > index + 2) {
    result = args[index + 2]
  }

  if (result.startsWith('{')) {
    //encripted key in package.json
    return decrypt(JSON.parse(result))
  } else {
    return result
  }
}
