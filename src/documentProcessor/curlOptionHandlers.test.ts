/* eslint-disable jest/require-top-level-describe */
import { curlOptionHandlers } from './curlOptionHandlers'

test('curlOptionHandlers handle HTTP request method options', () => {
  expect.hasAssertions()

  expect(curlOptionHandlers['-X'       ]('POST'  )).toStrictEqual({ request: { method: 'POST'  }, consumedNextToken: true })
  expect(curlOptionHandlers['--request']('POST'  )).toStrictEqual({ request: { method: 'POST'  }, consumedNextToken: true })
  expect(curlOptionHandlers['-X'       ]('GET'   )).toStrictEqual({ request: { method: 'GET'   }, consumedNextToken: true })
  expect(curlOptionHandlers['--request']('GET'   )).toStrictEqual({ request: { method: 'GET'   }, consumedNextToken: true })
  expect(curlOptionHandlers['-X'       ]('PUT'   )).toStrictEqual({ request: { method: 'PUT'   }, consumedNextToken: true })
  expect(curlOptionHandlers['--request']('PUT'   )).toStrictEqual({ request: { method: 'PUT'   }, consumedNextToken: true })
  expect(curlOptionHandlers['-X'       ]('DELETE')).toStrictEqual({ request: { method: 'DELETE'}, consumedNextToken: true })
  expect(curlOptionHandlers['--request']('DELETE')).toStrictEqual({ request: { method: 'DELETE'}, consumedNextToken: true })
})

test('curlOptionHandlers handle HTTP request header options', () => {
  expect.hasAssertions()

  expect(curlOptionHandlers['-H'      ]('Authorization: Bearer 0000000000'  )).toStrictEqual({ request: { header: {
    'Authorization': 'Bearer 0000000000'
  } }, consumedNextToken: true })
  expect(curlOptionHandlers['--header']('Authorization: Bearer 0000000000'  )).toStrictEqual({ request: { header: {
    'Authorization': 'Bearer 0000000000'
  } }, consumedNextToken: true })
  expect(curlOptionHandlers['--header']('Authorization:Bearer 0000000000'  )).toStrictEqual({ request: { header: {
    'Authorization': 'Bearer 0000000000'
  } }, consumedNextToken: true })


  expect(() => curlOptionHandlers['--header']('Colon is last of the line:')).toThrow('Failed to parse request. HTTP header format is invalid.')
  expect(() => curlOptionHandlers['--header']('Colon is not exist line')).toThrow('Failed to parse request. HTTP header format is invalid.')
})


test('curlOptionHandlers handle HTTP request body options', () => {
  expect.hasAssertions()

  expect(curlOptionHandlers['--data-raw']('hello, world!'  )).toStrictEqual({ request: { body: 'hello, world!'}, consumedNextToken: true })
})

// TODO: Write bad test cases