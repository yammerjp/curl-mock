/* eslint-disable jest/require-top-level-describe */

import { parseResponse } from './parseResponse'

test('parseResponse', () => {
  expect.hasAssertions()

  expect(parseResponse('', 'response')).toStrictEqual({
      status: 200,
      header: {
          'Content-Type': 'text/plain',
      },
      body: '',
  })
})

