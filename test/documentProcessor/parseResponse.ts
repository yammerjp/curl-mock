/* eslint-disable jest/require-top-level-describe */

import { parseResponse } from '../../src/documentProcessor/parseResponse'

test('parseResponse', () => {
  expect.hasAssertions()

  expect(parseResponse('', 'response')).toStrictEqual({
      status: 200,
      header: {
          'Content-Type': 'text/plain',
      },
      body: '',
  })

  // TODO: Write test cases
})

