/* eslint-disable jest/require-top-level-describe */

import documentProcessor from ".";

test('documentProcessor', () => {
  expect.hasAssertions()

  expect(documentProcessor([])).toStrictEqual([])
})

// TODO: Write test cases