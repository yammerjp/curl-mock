import mockServer from './mockServer'
import readFile from './readFile'

readFile('example/helloworld.md').then(console.log)

const inputRequest = 'curl http://localhost:3000'
const inputResponse = 'hello, world!'

const { error } = mockServer.addFromString(inputRequest, inputResponse)
if (error) {
  console.error(error)
  process.exit(1)
}

mockServer.start()