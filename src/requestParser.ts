export default function requestParser(curlCmdStr: string, port: string): Request|undefined {
  const tokens = curlCmdStr.split(' ')
  if (tokens.length === 0 || tokens[0] !== 'curl') {
    console.error({ error: 'request is invalid format (need "curl" on head)' })
    return
  }
  const url = tokens.find(t => /^http:\/\/localhost(:\d+)?/.test(t))
  if (!url) {
      console.error({ error: 'request is invalid format (need url' })
    return
  }
  const pathParts = url.split('/').slice(3)
  let path = ''
  if (pathParts === undefined || pathParts.length === 0) {
    path = '/'
  } else {
    path = '/' + pathParts.join('/')
  }
  return { path, port }
}
