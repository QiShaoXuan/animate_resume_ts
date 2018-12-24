import {LoadParams} from "./animateResume/interface";
import AnimateResume from './animateResume/index'
import {style1, style2} from '../load/style'
import {resume} from "../load/resume";

const load1: LoadParams = {
  load: style1,
  type: 'css',
  id: 'style-container',
  rewrite: true
}
const load2: LoadParams = {
  load: resume,
  type: 'md',
  id: 'resume-container',
  rewrite: true
}
const load3: LoadParams = {
  load: style2,
  type: 'css',
  id: 'style-container',
  rewrite: false
}

const container = document.querySelector('.animate-container')

const ar = new AnimateResume(container, {
  content: [load1, load2, load3],
  mobileAnimate: {
    styleID: 'style-container',
    resumeID: 'resume-container'
  }
})

const skipBtn: HTMLElement = document.querySelector('#skip-btn')

skipBtn.addEventListener('click', function () {
  ar.skip()
  skipBtn.style.display = 'none'
})

ar.animate(() => {
  skipBtn.style.display = 'none'
})

