import BScroll from 'better-scroll'
export default function endAnimate() {
  let body = document.querySelector('body')
  let styleContainer = document.querySelector('.style-container')
  let style = document.querySelector('#style-editor')
  let mdContainer = document.querySelector('.resume-container')
  let md = document.querySelector('#resume-content')
  body.style.cssText = 'overflow:hidden'

  let cs = {
    width: 'calc(100% - 2rem)',
    height: 'calc(100% - 4rem)',
    overflow: 'hidden',
    border: '1px solid #ccc',
    background: 'rgb(48, 48, 48)',
    position: 'absolute',
    left: '1rem',
  }

  for(let key in cs){
    styleContainer.style[key] = cs[key]
    mdContainer.style[key] = cs[key]
  }
  styleContainer.style.top = '1rem'
  mdContainer.style.top = 'calc(100% + 1rem)'

  let innerStyle = {
    transition:'all 0s',
    maxHeight:'none',
    overflow:'visible',
    position:'static',
    width:'100%',
    border:'none',
    height:'auto'
  }

  for(let key in innerStyle){
    style.style[key] = innerStyle[key]
    md.style[key] = innerStyle[key]
  }
  style.style.transform ='rotateX(0deg)'
  md.style.paddingBottom = '10rem'


  setTimeout(() => {
    mdContainer.style.transition = 'transform .5s ease-out'
    styleContainer.style.transition = 'transform .5s ease-out'
    mdContainer.style.transform = 'translateY(calc(-100% - 4rem))'
    styleContainer.style.transform = 'translateY(calc(-100% - 1rem))'
  },500)

  let styleScroll = new BScroll('.style-container', {
    pullUpLoad: {
      threshold: 20
    }
  })

  let mdScroll = new BScroll('.resume-container', {
    pullDownRefresh: {
      threshold: 20,
    }
  })
  styleScroll.on('pullingUp', function () {
    mdContainer.style.transform = 'translateY(calc(-100% - 4rem))'
    styleContainer.style.transform = 'translateY(calc(-100% - 1rem))'
    styleScroll.finishPullUp()
  })
  mdScroll.on('pullingDown',function () {
    mdContainer.style.transform = 'translateY(0)'
    styleContainer.style.transform = 'translateY(0)'
    mdScroll.finishPullDown()
  })
}
