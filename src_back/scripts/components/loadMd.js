import marked from 'marked'
import config from './config'

export function loadMd(options = {
  containerName: '',
  content: '',
}) {
  return new Promise((resolve,reject) => {
    let container = document.querySelector(options.containerName)
    let mdStr = options.content
    let interval = 50
    let num = 0
    let sum = mdStr.length

    const start = function () {
      setTimeout(() => {
        num += 1
        let wordNow = mdStr.substring(num -1,num)

        container.scrollTop = 100000

        if (num <= sum) {
          if(wordNow === '\n'){
            container.innerHTML = marked(mdStr.substr(0,num))
          }else{
            container.innerHTML = container.innerHTML + wordNow
          }
          if(config.pause){
            return reject()
          }else{
            start()
          }
        } else {
          container.scrollTop = 0
          return resolve()
        }
      }, 50)
    }

    start()
  })
}

export function skipMd(options = {
  containerName: '',
  content: '',
}) {
  let container = document.querySelector(options.containerName)
  let mdStr = options.content

  container.innerHTML = marked(mdStr)
}
