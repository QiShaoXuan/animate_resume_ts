// 加载项
export interface LoadParams {
  load: string
  type: 'css' | 'md'
  id: string
  rewrite?: boolean
}

// 实例化传入参数
export interface CoreOptions {
  content: Array<LoadParams>
  mobileAnimate?: {
    styleID: string
    resumeID: string
  }
}

// 实例化
export interface Core {
  container: Element
  options: CoreOptions
  isSkip: boolean

  animate: () => void
  skip: () => void
}
