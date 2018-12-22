export function getInterval(str: string, interval = 16): number {
  if (/\D[\,]\s$/.test(str)) return interval * 20
  if (/[^\/]\n\n$/.test(str)) return interval * 40
  if (/[\.\?\!]\s$/.test(str)) return interval * 60
  return 0
}


export function handleStyle(style: string,el:Element): void {
  el.innerHTML = style
}

export function createContainer(container:Element,id:string):Element {

  if(container.querySelector(`#${id}`) === null){
    let el = document.createElement('div')
    el.id = id
    
    let pre = document.createElement('pre')
    pre.id = `${id}-pre`

    el.append(pre)
    
    container.append(el)
  }

  return container.querySelector(`#${id}-pre`)
}

export function isMobile():boolean {
  return document.body.clientWidth < 750 ? true : false
}

export function getStyleEl():Element {
  let newStyle = document.createElement('style')
  let head = document.querySelector('head')
  head.appendChild(newStyle)
  let allStyle = document.querySelectorAll('style')

  return allStyle[allStyle.length - 1]
}
