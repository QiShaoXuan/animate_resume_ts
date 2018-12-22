import {Core, CoreOptions, LoadParams} from "./interface";
import {
  getInterval,
  handleStyle,
  getStyleEl,
  createContainer,
} from "./untils/untils";
import * as Prism from 'prismjs';
import * as marked from 'marked'

class AnimateResume implements Core {
  container: Element
  options: CoreOptions
  isSkip: boolean

  constructor(container: Element, options: CoreOptions) {
    this.container = container
    this.options = options
    this.isSkip = false
  }

  private load(contents: Array<LoadParams>) {
    // contents.length && load(contents[0]).then(() => this.load(contents.slice(1)))
    if (contents.length) {
      let container = createContainer(this.container, contents[0].id)
      this.loadItem(contents[0], container)
        .then(() => this.load(contents.slice(1)))
        .catch(() => this.skipAnimate())
    }
  }

  private loadItem(item: LoadParams, container: Element): Promise<void> {
    return new Promise((resolve, reject) => {
      // let container = container
      let num = 0
      let sum = item.load.length
      let originContent = item.rewrite ? '' : container.innerHTML
      let interval = 16

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
      let container = createContainer(this.container, item.id)

      switch (item.type){
        case 'css':
          this.skipStyle(item,container)
          break
        case 'md':
          this.skipMd(item,container)
          break
      }
    })
  }

  private skipStyle(item:LoadParams,container:Element){
    let styleStr = item.load
    let styleEl = getStyleEl()
    let originContent = ''
    let code = Prism.highlight(styleStr, Prism.languages.css)

    if (!item.rewrite) {
      originContent = container.innerHTML
    }

    styleEl.innerHTML = styleStr
    container.innerHTML = originContent + code
  }

  private skipMd(item:LoadParams,container:Element){
    container.innerHTML = marked(item.load)
  }


  public animate() {
    this.load(this.options.content)
  }

  public skip() {
    this.isSkip = true
  }
}

// ----------------------------------
import {style1, style2} from '../load/style'
import {resume} from "../load/resume";

let load1: LoadParams = {
  load: style1,
  type: 'css',
  id: 'style-container',
  rewrite: true
}
let load2: LoadParams = {
  load: resume,
  type: 'md',
  id: 'resume-container',
  rewrite: true
}
let load3: LoadParams = {
  load: style2,
  type: 'css',
  id: 'style-container',
  rewrite: false
}

const container = document.querySelector('.animate-container')
const ar = new AnimateResume(container, {content: [load1, load2, load3]})
ar.animate()

const skipBtn = document.querySelector('#skip-btn')
skipBtn.addEventListener('click', function () {
  ar.skip()
})
