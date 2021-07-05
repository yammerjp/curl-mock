export default function httpHeaderLineParser (token: string): {
  key: string | undefined
  value: string
} {
  if (!/^[a-zA-Z0-9-]+:( )*/.test(token)) {
    throw new Error('Failed to parse request. HTTP header format is invalid.')
  }
  const devidedByColon = token.split(':')
  const key = devidedByColon[0]
  const value = devidedByColon.slice(1).join(':').trim()
  return { key, value }
}