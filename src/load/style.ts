import {isMobile} from '../scripts/untils/untils'

const is_mobile: boolean = isMobile()

export const style1:string = `/**
 *
 * Hey. My name's qishaoxuan. I'm a web developer.
 *
 * I build a animating resume
 *
 * Let's begin. We start by animating... yes, everything.
 */

* {
  transition: all 1s;
}

/**
 * It seems to do noting. But you'll see.
 *
 * Black on white is really boring,
 * change threm first.
 */

html {
  background: #216583;
  font-size: 10px;
  overflow: hidden;
}

/***
 * Hold on...
 */

pre, a {
  color: #ffffff;
}

/**
 * That's better.
 *
 * Working in this big rempty space is tough.
 *
 * I'm going to make a nice area to show the content.
 */

pre:not(:empty) {
  ${is_mobile ?
  `max-height: 46%;width: calc(100% - 2rem);`
  :
  `max-height: 100%;`}
  font-size: 1.4rem;
  overflow: auto;
  background: rgb(48, 48, 48);
  border: 1px solid #ccc;
  padding: 1rem 1rem 2rem;
  white-space: pre-wrap;
  outline: 0;
}

#style-container {
  height:92%;
  width: 49%;
  ${is_mobile ? '' : 'transform: translateX(95%);'}
  position: absolute;
  left: 1rem;
  top: 1rem;
}

/**
 * This is good, but all the text is white!
 * Let's make it more readable.
 */

#style-container  { color: #DEDEDE }
.comment       { color: #857F6B; font-style: italic; }
.selector      { color: #D7BA7D; }
.keyword       { color: #569CD6; }
.property      { color: #569CD6; }
.function      { color: #C366A3; }
.punctuation   { color: #FFCF00; }

/**
 * It\`s time to get a little perspective.
 */

body {
  perspective: 100rem;
}

#style-container {
  ${is_mobile ? 'transform: rotateX(-10deg);' : 'transform: translateX(98.5%) rotateY(-10deg);'}
  transform-origin: right;
}

/**
 * Okey, it is time to show the resume.
 * You must not just come to see the pretty colors.
 */

 #resume-container {
  height:92%;
  width: 49%;
  white-space: normal;
 ${is_mobile ? 
  `position: absolute;
 left: 1rem;
 bottom: 3rem;
 height: 48%;`
  : `position: absolute;
  left: 1rem;
  top: 1rem;
  transform: rotateY(10deg);
  transform-origin: left;`}
}
`

export const style2 = `/**
 * That markdown on the left doesn't look great. Let's render it.
 */

#resume-container{
  padding: 2rem;
  font-size: 1.4rem;
}
#resume-container h1{
  display: inline-block;
  border-bottom: 1px solid;
  margin: 2.5rem 0 1rem;
  font-size: 2.6rem;
}
#resume-container a{
  color: #ffffff;
  text-decoration: none;
}
#resume-container ul> li{
  margin-bottom: .3rem;
}
#resume-container ul> li::before{
  content: '•';
  margin-right: .5rem;
  color: '#ffffff';
}

/**
 * Okey, this is almost done.
 *
 * This page is inspired by http://strml.net/， which was what I met when I was a beginner of js.
 *
 * It is really surprise me, and now I can code it by my self.
 *
 * Ertainly，most of sentences is from that, my English is very poor~ after all.
 *
 */`
