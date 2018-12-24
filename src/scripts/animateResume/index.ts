import {Core, CoreOptions, LoadParams} from "./interface";
import {
  getInterval,
  handleStyle,
  getStyleEl,
  createContainer,
  isMobile
} from "./untils/untils";
import mobileEndAnimate from './untils/mobileEndAnimate'
import * as Prism from 'prismjs';
import * as marked from 'marked'

export default class AnimateResume implements Core {
  container: Element
  options: CoreOptions
  isSkip: boolean

  constructor(container: Element, options: CoreOptions) {
    this.container = container
    this.options = options
    this.isSkip = false
  }

  private load(contents: Array<LoadParams>,fn?:Function) {
    if (contents.length) {
      this.loadItem(contents[0])
        .then(() => this.load(contents.slice(1),fn))
        .catch(() => this.skipAnimate())
    } else {

      if (isMobile()) {
        mobileEndAnimate(this.options.mobileAnimate.styleID, this.options.mobileAnimate.resumeID)
      }

      fn && fn()
    }
  }

  private loadItem(item: LoadParams): Promise<void> {
    return new Promise((resolve, reject) => {
      const container = createContainer(this.container, item.id)
      let num = 0
      const sum = item.load.length
      let originContent = item.rewrite ? '' : container.innerHTML
      const interval = 16

      let styleEl: Element
      if (item.type === 'css') {
        styleEl = getStyleEl()
      }

      const startLoad = (): void => {
        setTimeout(() => {
          num += 1
          if (num <= sum) {

            let str = item.load.substr(0, num)

            let code: string

            switch (item.type) {
              case 'css':
                handleStyle(str, styleEl)
                code = Prism.highlight(str, Prism.languages.css)
                break
              case 'md':
                code = marked(str)
                break
            }

            let nextInterval = getInterval(str, interval)

            container.scrollTop = 100000

            container.innerHTML = originContent + code

            if (this.isSkip) {
              reject()
            } else {
              setTimeout(() => {
                startLoad()
              }, nextInterval)
            }

          } else {
            return resolve()
          }
        }, interval)
      }

      startLoad()
    })
  }

  private skipAnimate() {
    this.options.content.forEach((item) => {
      const container = createContainer(this.container, item.id)

      switch (item.type) {
        case 'css':
          this.skipStyle(item, container)
          break
        case 'md':
          this.skipMd(item, container)
          break
      }
    })

    if (isMobile()) {
      mobileEndAnimate(this.options.mobileAnimate.styleID, this.options.mobileAnimate.resumeID)
    }
  }

  private skipStyle(item: LoadParams, container: Element) {
    const styleStr = item.load
    const styleEl = getStyleEl()
    let originContent = ''
    const code = Prism.highlight(styleStr, Prism.languages.css)

    if (!item.rewrite) {
      originContent = container.innerHTML
    }

    styleEl.innerHTML = styleStr
    container.innerHTML = originContent + code
  }

  private skipMd(item: LoadParams, container: Element) {
    container.innerHTML = marked(item.load)
  }

  public animate(fn?:Function) {
    this.load(this.options.content,fn)
  }

  public skip() {
    this.isSkip = true
  }
}
