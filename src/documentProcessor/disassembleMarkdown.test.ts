/* eslint-disable jest/require-top-level-describe */

import { disassembleMarkdown } from "./disassembleMarkdown";

test('disassembleMarkdown', () => {
  expect.hasAssertions()

  expect(disassembleMarkdown(`
# h1

Markdown document

\`\`\`curldoc-request
This is curldoc request text 1
\`\`\`


\`\`\`
codeblock without specifying any languages
\`\`\`

\`\`\`curldoc-response
This is curldoc response text 1
\`\`\`

\`\`\`
codeblock without specifying any languages
\`\`\`

\`\`\`curldoc-request
This is curldoc request text 2
\`\`\`


\`\`\`curldoc-response
This is curldoc response text 2
\`\`\`

hello, hoge, fuga
  `)).toStrictEqual([
    {
      request: 'This is curldoc request text 1',
      response: 'This is curldoc response text 1',
      responseType: 'response',
    },
    {
      request: 'This is curldoc request text 2',
      response: 'This is curldoc response text 2',
      responseType: 'response',
    }
  ])
})

// TODO: Write test cases