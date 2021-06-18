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
    expect(tokenizer("curl http://localhost:3000/hello2 --header 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'"))
    .toEqual(["curl", "http://localhost:3000/hello2", "--header", "User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"])
})

test('requestParser', () => {
    expect(requestParser("curl http://localhost:3000/hello2 --header 'User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'", '80'))
    .toEqual({
        port: '80',
        path: '/hello2',
        header: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
        }
    })
})
