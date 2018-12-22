import {LoadParams} from "../interface";
import {getInterval, handleStyle,getStyleEl} from "./untils";
import * as Prism from 'prismjs';
import * as marked from 'marked'
// import 'prismjs/components/prism-markdown';


export function load(item: LoadParams, container: Element): Promise<void> {
  return new Promise((resolve, reject) => {
    // let container = container
    let num = 0
    let sum = item.load.length
    let containerOriginContent = item.rewrite ? '' : container.innerHTML
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
              code =  marked(str)
              break
          }

          let nextInterval = getInterval(str, interval)

          container.scrollTop = 100000

          container.innerHTML = containerOriginContent + code

          setTimeout(() => {
            startLoad()
          }, nextInterval)

        } else {
          return resolve()
        }
      }, interval)
    }

    startLoad()
  })
}



