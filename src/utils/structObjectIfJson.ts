import type { HTTPRequestBody } from '../endpoint'

function structObjectIfJson(body: string | undefined): HTTPRequestBody | undefined {
  try {
    if (body === undefined) {
      return undefined
    }
    return JSON.parse(body)
  } catch {
    return body
  }
}

export default structObjectIfJson
