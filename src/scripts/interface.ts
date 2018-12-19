interface ContentParam {
  load: string
  type: 'css' | 'md'
  container: NodeList
  rewrite: boolean
}

export interface CoreParmas {
  content: Array<ContentParam>
}

export interface Core {
  animate: () => void
  skip: () => void
}

