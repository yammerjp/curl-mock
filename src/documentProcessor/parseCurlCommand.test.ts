/* eslint-disable jest/require-top-level-describe */
import { parseCurlCommand } from './parseCurlCommand'

test('parseCurlCommand()', () => {
  expect.hasAssertions()

  expect(
    parseCurlCommand(
      "curl http://localhost:3000/hello2 --header 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'"
    )
  ).toStrictEqual({
    path: '/hello2',
    header: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
    },
    method: 'GET',
    body: ''
  })
})
