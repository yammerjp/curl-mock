import remark from 'remark'
import fs from 'fs/promises'

const { parse } = remark()

type Node = {
  type: string
  lang?: string
  value?: string
  children: Node[]
}

export default async function readFile(path: string): Promise<Block[]> {
  const fileString = await fs.readFile(path)
  const tree = parse(fileString)
  const markdownBlocks = (tree as Node).children
  const BlocksIncludeUndefined: Array<Block | undefined> = markdownBlocks.map((mdb: Node): Block | undefined => {
    if (mdb.type !== 'code') {
      return undefined
    }
    const { value } = mdb
    if (mdb.lang === 'curldoc-host' && value !== undefined) {
      return {
        type: 'host',
        value
      }
    }
    if (mdb.lang === 'curldoc-request' && value !== undefined) {
      return {
        type: 'request',
        value
      }
    }
    if (mdb.lang === 'curldoc-response' && value !== undefined) {
      return {
        type: 'response',
        value
      }
    }
    return undefined
  })
  return BlocksIncludeUndefined.filter((b) => b) as Block[]
}
