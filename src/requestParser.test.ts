import { requestParser, tokenizer } from './requestParser'

test('tokenize', () => {
    expect(tokenizer('asdfasdfa asdf')).toEqual(['asdfasdfa', 'asdf'])
    expect(tokenizer('')).toEqual([])
    expect(tokenizer('hello,world!')).toEqual(['hello,world!'])
    expect(tokenizer('hello, world!')).toEqual(['hello,','world!'])
    expect(tokenizer('hell"o, world!"')).toEqual(['hello, world!'])
    expect(tokenizer("hell'o, world!'")).toEqual(['hello, world!'])
    expect(tokenizer('  "hello, world!"   ')).toEqual(['hello, world!'])
    expect(tokenizer("  'hello, world!'   ")).toEqual(['hello, world!'])
    expect(tokenizer('asd "fasdfa asdf"')).toEqual(['asd', 'fasdfa asdf'])
})