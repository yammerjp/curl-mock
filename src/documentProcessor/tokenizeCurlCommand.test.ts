/* eslint-disable jest/require-top-level-describe */
import { tokenizeCurlCommand } from './tokenizeCurlCommand'

test('tokenizeCurlCommand', () => {
  expect.hasAssertions()

  expect(tokenizeCurlCommand('asdfasdfa asdf')).toStrictEqual(['asdfasdfa', 'asdf'])
  expect(tokenizeCurlCommand('')).toStrictEqual([])
  expect(tokenizeCurlCommand('hello,world!')).toStrictEqual(['hello,world!'])
  expect(tokenizeCurlCommand('hello, world!')).toStrictEqual(['hello,', 'world!'])
  expect(tokenizeCurlCommand('hell"o, world!"')).toStrictEqual(['hello, world!'])
  expect(tokenizeCurlCommand("hell'o, world!'")).toStrictEqual(['hello, world!'])
  expect(tokenizeCurlCommand('  "hello, world!"   ')).toStrictEqual(['hello, world!'])
  expect(tokenizeCurlCommand("  'hello, world!'   ")).toStrictEqual(['hello, world!'])
  expect(tokenizeCurlCommand('asd "fasdfa asdf"')).toStrictEqual(['asd', 'fasdfa asdf'])
  expect(
    tokenizeCurlCommand(
      "curl http://localhost:3000/hello2 --header 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'"
    )
  ).toStrictEqual([
    'curl',
    'http://localhost:3000/hello2',
    '--header',
    'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
  ])
})
