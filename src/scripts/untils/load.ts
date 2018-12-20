import {LoadParams} from "../interface";
import {getInterval} from "./getInterval";
// import * as Prism from 'prismjs';
import * as $ from 'jquery'
export function load(item: LoadParams): Promise<void> {
  return new Promise((resolve, reject) => {
console.log($)

    let container = item.container
    let num = 0
    let sum = item.load.length
    let containerOriginContent = item.rewrite ? '' : container.innerHTML
    let interval = 16
    const startLoad = (): void => {
      setTimeout(() => {
        num += 1
        if (num <= sum) {

          let str = item.load.substr(0, num)
          // let code = Prism.highlight(str, Prism.languages.css)
          let nextInterval = getInterval(str, interval)

          container.scrollTop = 100000

          container.innerHTML = containerOriginContent + str

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
