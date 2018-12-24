// 根据字符结束设置间隔时间
export function getInterval(str: string, interval = 16): number {
  if (/\D[\,]\s$/.test(str)) return interval * 20
  if (/[^\/]\n\n$/.test(str)) return interval * 40
  if (/[\.\?\!]\s$/.test(str)) return interval * 60
  return 0
}

// css 写入 style
export function handleStyle(style: string, el: Element): void {
  el.innerHTML = style
}

// 新建并返回容器
export function createContainer(container: Element, id: string): Element {

  if (container.querySelector(`#${id}`) === null) {
    let el = document.createElement('div')
    el.id = id

    let pre = document.createElement('pre')
    pre.id = `${id}-pre`

    el.append(pre)

    container.append(el)
  }

  return container.querySelector(`#${id}-pre`)
}

// 判断是否为移动设备
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false
}

// 设置并获取 style 标签
export function getStyleEl(): Element {
  const newStyle = document.createElement('style')
  const head = document.querySelector('head')
  head.appendChild(newStyle)
  const allStyle = document.querySelectorAll('style')

  return allStyle[allStyle.length - 1]
}
