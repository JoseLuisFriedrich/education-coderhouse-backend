import autocannon from 'autocannon'
import { PassThrough } from 'stream'

const run = url => {
  const buf: any = []
  const outputStream = new PassThrough()

  const inst = autocannon({
    url,
    connections: 50,
    duration: 20,
  })

  autocannon.track(inst, { outputStream })

  outputStream.on('data', data => buf.push(data))
  inst.on('done', function () {
    process.stdout.write(Buffer.concat(buf))
  })
}

run('http://localhost:8080/api/productMock/random/100000')
run('http://localhost:8080/api/productMock/randomBlocking/100000')
