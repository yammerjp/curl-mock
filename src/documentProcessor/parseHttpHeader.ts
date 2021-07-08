export default function parseHttpHeader (line: string): {
  key: string | undefined
  value: string
} {
  if (!/^[a-zA-Z0-9-]+:( )*/.test(line)) {
    throw new Error('Failed to parse request. HTTP header format is invalid.')
  }
  const devidedByColon = line.split(':')
  const key = devidedByColon[0]
  const value = devidedByColon.slice(1).join(':').trim()
  return { key, value }
}