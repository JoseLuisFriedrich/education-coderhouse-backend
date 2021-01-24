
const http = require('http')

const server = http.createServer((req, res) => {
  res.write(JSON.stringify({
    id: getRndInteger(1, 10),
    title: 'Producto ' + getRndInteger(1, 10),
    price: getRndInteger(1, 10, false),
    thumbnail: 'Foto ' + getRndInteger(1, 10)
  }))

  res.end()
})

server.listen(3000, function () {
  console.log('Server: ' + this.address().port)
})

const getRndInteger = (min, max, integer = true) => {
  const result = Math.random() * (max - min + 1) + min
  return integer ? Math.floor(result) : result
}
