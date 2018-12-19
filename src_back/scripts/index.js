// import indexCss from '../styles/index.scss'

import config from './components/config'
import {loadStyle, skipStyle} from "./components/loadStyle"
import {loadMd, skipMd} from './components/loadMd'
import endAnimate from './components/endAnimate'

import {style1, style2} from "../load/style"
import {resume} from '../load/resume'


let skipBtn = document.querySelector('#skip-btn')
skipBtn.addEventListener('click', function () {
  config.pause = true
})

loadStyle({
  containerName: '#style-editor',
  content: style1
})
  .then(() => loadMd({
    containerName: '#resume-content',
    content: resume
  }))
  .then(() => loadStyle({
    containerName: '#style-editor',
    content: style2,
    write: false,
  }))
  .then(() => {
    skipBtn.style.display = 'none'
    if (config.isMobile) {
      endAnimate()
    }
  })
  .catch(() => {
    skipBtn.style.display = 'none'

    skipStyle({
      containerName: '#style-editor',
      content: style1
    })
    skipMd({
      containerName: '#resume-content',
      content: resume
    })
    skipStyle({
      containerName: '#style-editor',
      content: style2,
      write: false,
    })
    if (config.isMobile) {
      endAnimate()
    }
  })

//
// const r = new resume(container,{
//   content:[
//     {
//       content:'',
//       type:'',
//
//     }
//   ],
//
// })
//  r.animate()
//
// r.skip()




