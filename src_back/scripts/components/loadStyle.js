import Prism from 'prismjs'
import config from './config'

export function loadStyle(options = {
  containerName: '',
  content: '',
  rewrite: true,
}) {
  return new Promise((resolve,reject) => {
    let styleStr = options.content
    let container = document.querySelector(options.containerName)
    let num = 0
    let sum = styleStr.length
    let containerOriginContent = ''
    let styleContainer = getStyleContainer()
    let interval = 16
    if (!options.rewrite) {
      containerOriginContent = container.innerHTML
    }

    const start = function () {
      setTimeout(() => {
        num += 1
        if (num <= sum) {
          let str = styleStr.substr(0, num)
          let code = Prism.highlight(str, Prism.languages.css)
          let nextInterval = setInterval(str, interval)

          container.scrollTop = 100000

          container.innerHTML = containerOriginContent + code
          styleContainer.innerText = str

          if(config.pause){
            return reject()
          }else{
            setTimeout(() => {
              start()
            }, nextInterval)
          }

        } else {
          return resolve()
        }
      }, interval)
    }

    start()
  })
}

export function skipStyle(options = {
  containerName: '',
  content: '',
  rewrite:true,
}) {
  let styleStr = options.content
  let container = document.querySelector(options.containerName)
  let styleContainer = getStyleContainer()
  let containerOriginContent = ''
  let code = Prism.highlight(styleStr, Prism.languages.css)

  if (!options.rewrite) {
    containerOriginContent = container.innerHTML
  }

  container.innerHTML = containerOriginContent + code
  styleContainer.innerText = styleStr
}

function setInterval(str, interval = 16) {
  if (/\D[\,]\s$/.test(str)) return interval * 20
  if (/[^\/]\n\n$/.test(str)) return interval * 40
  if (/[\.\?\!]\s$/.test(str)) return interval * 60
  return 0
}

function getStyleContainer() {
  let newStyle = document.createElement('style')
  let head = document.querySelector('head')
  head.appendChild(newStyle)
  let allStyle = document.querySelectorAll('style')

  return allStyle[allStyle.length - 1]
}
