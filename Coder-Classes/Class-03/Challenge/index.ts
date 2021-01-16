const showLetters = async (text: string, delay: number = 1000, callback?: Function) => {
  const letters: Array<string> = text.split('')
  const id: number = setInterval(() => {
    console.log(letters.shift())

    if (!letters.length) {
      console.log('')
      clearInterval(id)
      if (callback) {
        callback()
      }
    }
  }, 1000)

  return await new Promise(resolve => setTimeout(resolve, delay + letters.length * 1000))
}

const end: Function = () => console.log('finished')

showLetters('bar', 3000).then(() => {
  showLetters('foo', 5000).then(() => {
    showLetters('foo', 1000, end)
  })
})
