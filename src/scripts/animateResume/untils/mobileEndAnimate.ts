import * as BScroll from 'better-scroll'

export default function mobileEndAnimate(styleID: string, resumeID: string): void {
  let body: HTMLElement = document.querySelector('body')
  let styleContainer: HTMLElement = document.querySelector(`#${styleID}`)
  let style: HTMLElement = document.querySelector(`#${styleID}-pre`)
  let mdContainer: HTMLElement = document.querySelector(`#${resumeID}`)
  let md: HTMLElement = document.querySelector(`#${resumeID}-pre`)

  body.style.cssText = 'overflow:hidden'

  let css = {
    width: 'calc(100% - 2rem)',
    height: 'calc(100% - 4rem)',
    overflow: 'hidden',
    border: '1px solid #ccc',
    background: 'rgb(48, 48, 48)',
    position: 'absolute',
    left: '1rem',
  }
  let cssStr = (<any>Object).entries(css).map((v: Array<string>) => v.join(':')).join(';')

  styleContainer.style.cssText = cssStr
  mdContainer.style.cssText = cssStr

  styleContainer.style.top = '1rem'
  mdContainer.style.top = 'calc(100% + 1rem)'

  let preCss = {
    transition: 'all 0s',
    maxHeight: 'none',
    overflow: 'visible',
    position: 'static',
    width: '100%',
    border: 'none',
    height: 'auto',
  }
  let preCssStr = (<any>Object).entries(preCss).map((v: Array<string>) => v.join(':')).join(';')

  style.style.cssText = preCssStr
  md.style.cssText = preCssStr

  style.style.transform = 'rotateX(0deg)'
  md.style.paddingBottom = '10rem'


  setTimeout(() => {
    mdContainer.style.transition = 'transform .5s ease-out'
    styleContainer.style.transition = 'transform .5s ease-out'
    mdContainer.style.transform = 'translateY(calc(-100% - 4rem))'
    styleContainer.style.transform = 'translateY(calc(-100% - 1rem))'
  }, 500)

  let styleScroll = new (<any>BScroll)(styleContainer, {
    pullUpLoad: {
      threshold: 20
    }
  })

  let mdScroll = new (<any>BScroll)(mdContainer, {
    pullDownRefresh: {
      threshold: 20,
    }
  })

  styleScroll.on('pullingUp', function () {
    mdContainer.style.transform = 'translateY(calc(-100% - 4rem))'
    styleContainer.style.transform = 'translateY(calc(-100% - 1rem))'
    styleScroll.finishPullUp()
  })
  mdScroll.on('pullingDown', function () {
    mdContainer.style.transform = 'translateY(0)'
    styleContainer.style.transform = 'translateY(0)'
    mdScroll.finishPullDown()
  })
}
