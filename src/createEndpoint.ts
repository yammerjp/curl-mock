import requestParser from './requestParser'
import responseParser from './responseParser'

export default function createEndpointFromBlocks(blocks: Block[]): Endpoint[] {
    let port = '3000'
    let request: Request|undefined
    const endpoints: Endpoint[] = []

    for (const b of blocks) {
        if (b.type === 'host') {
            const hostAndPort = b.value.split('/')[2]
            if (hostAndPort.includes(':')) {
                port = hostAndPort.split(':')[1]
            }
            continue
        }

        if (b.type === 'request') {
            if (request) {
                console.error({ error: 'request block is duplicated' })
            }
            request = requestParser(b.value, port)
            if (!request) {
                console.error({ error: 'failed to parse request string', value: b.value })
            }
            continue
        }

        if (b.type === 'response') {
            if (!request) {
                console.error({ error: 'request is not defined' })
                continue
            }
            const response = responseParser(b.value, b.type)
            if (!response) {
                console.error({ error: 'failed to parse response string', value: b.value })
                continue
            }
            endpoints.push({
                request: Object.assign(request),
                response,
            })
            request = undefined
            continue
        }
        console.error({ error: 'Unknown block type', value: b.type })
    }
    return endpoints
}