export default function responseParser(body: string, type: ResponseType): Response | undefined {
  if (type !== 'response') {
    console.error({ error: 'unknown response type', value: type })
    return undefined
  }
  return {
    status: 200,
    header: { 'Content-Type': 'text/plain' },
    body
  }
}
