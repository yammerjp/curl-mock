/* eslint-disable jest/require-top-level-describe */
import deepInclude from '../../src/utils/deepInclude'

test('deepInclude', () => {
  expect.hasAssertions()
  const including = {
    message: 'hello',
    number: 3,
    null: null,
    array: [3, null, 'hey', { obake: 'denai', koreha: 0 }, ['arr0', 'arr1']]
  }

  const included = {
    message: 'hello',
    null: null,
    array: [3, null, 'hey', { obake: 'denai' }]
  }

  expect(deepInclude(including, included)).toBe(true)
  expect(deepInclude(including, including)).toBe(true)
  expect(deepInclude(included, included)).toBe(true)
  expect(deepInclude(included, including)).toBe(false)
})
