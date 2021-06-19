/* eslint-disable jest/require-top-level-describe */
import { requestParser, tokenizer } from './requestParser'

test('tokenize', () => {
  expect.hasAssertions()

  expect(tokenizer('asdfasdfa asdf')).toStrictEqual(['asdfasdfa', 'asdf'])
  expect(tokenizer('')).toStrictEqual([])
  expect(tokenizer('hello,world!')).toStrictEqual(['hello,world!'])
  expect(tokenizer('hello, world!')).toStrictEqual(['hello,', 'world!'])
  expect(tokenizer('hell"o, world!"')).toStrictEqual(['hello, world!'])
  expect(tokenizer("hell'o, world!'")).toStrictEqual(['hello, world!'])
  expect(tokenizer('  "hello, world!"   ')).toStrictEqual(['hello, world!'])
  expect(tokenizer("  'hello, world!'   ")).toStrictEqual(['hello, world!'])
  expect(tokenizer('asd "fasdfa asdf"')).toStrictEqual(['asd', 'fasdfa asdf'])
  expect(
    tokenizer(
      "curl http://localhost:3000/hello2 --header 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'"
    )
  ).toStrictEqual([
    'curl',
    'http://localhost:3000/hello2',
    '--header',
    'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
  ])
})

test('requestParser', () => {
  expect.hasAssertions()

  expect(
    requestParser(
      "curl http://localhost:3000/hello2 --header 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'"
    )
  ).toStrictEqual({
    path: '/hello2',
    header: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
    },
  })
})
