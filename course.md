# 又双叒叕是一个动态简历

## 先看效果

[请戳这里看预览](https://qishaoxuan.github.io/animate_resume_ts/)
[这里是代码](https://github.com/QiShaoXuan/animate_resume_ts)

## 见过了？别走，这是与众不同的地方

- 针对移动端优化了体验
- 支持动画跳过
- 支持多段动画
- 标点字符特殊处理，停留时间略长于字符时间
- typescript 编写
- 对功能进行了封装处理，可以直接引入使用

## 基本准备

### 字符逐个弹出效果的实现

原理很简单，一个闭包，逐一截取字符串，`setTimeout` 渲染在页面上即可

```js
/**
 * @param {HTMLElement} container - 渲染字符的容器
 * @param {string} text - 需要渲染的字符串
 */
function loadItem(container, text) {
  let num = 0
  let sum = text.length
  let interval = 16

  const startLoad = () => {
    setTimeout(() => {
      num += 1
      if (num <= sum) {

        let str = text.substr(0, num)

        container.scrollTop = 100000

        container.innerHTML = str

        setTimeout(() => {
          startLoad()
        }, interval)

      }
    }, interval)
  }

  startLoad()
}
```

### `html` 上的 `CSS` 字符自动生效

只要在字符串开始渲染时，在 `html` 中添加一个 `style` 标签，将渲染的 `CSS` 代码写入到标签中即可

创建一个 `style` 标签
```js
function getStyleEl() {
  let newStyle = document.createElement('style')
  let head = document.querySelector('head')
  head.appendChild(newStyle)
  let allStyle = document.querySelectorAll('style')

  return allStyle[allStyle.length - 1]
}
```

将 `CSS` 代码写入
```js
/**
 * 
 * @param {string} style - CSS 代码
 * @param {HTMLElement} el - 创建的 style 标签
 */
function handleStyle(style, el) {
  el.innerHTML = style
}
```

### `CSS` 代码高亮，`markdown` 自动转换

这里需要借助 `prismjs` 和 `marked` 两个代码处理库（当然也可以用其他的）

需要在上述的 `loadTtem` 函数中添加判断

```js
let code
switch (type) {
  case 'css':
    handleStyle(str, styleEl)
    code = Prism.highlight(str, Prism.languages.css)
    break
  case 'md':
    code = marked(str)
    break
}
```

## 进阶处理

### 分析

基本的核心功能已经准备好了

下面我们开始分析过程，开始编写代码

需求如下：

1. 支持多段动画加载
2. 支持动画跳过（直接加载完成）
3. 移动端特殊处理

基于上述需求，我们需要先对接口进行定义

我们设想函数是这样使用的

```js
/**
 * @param {HTMLElement} container - 字符渲染的容器
 * @param {Object} options - 动画参数
 * 
 * @param {string} options.content.load - 需要渲染的字符串
 * @param {'css' | 'md'} options.content.type - 渲染后高亮的方式，当前仅支持 'css' | 'md' 两个参数
 * @param {string} options.content.id - 渲染容器的 id
 * @param {boolean} options.content.rewrite - 是否需要重写
 * 
 * @param {Object}? options.mobileAnimate - 移动端需要特殊处理
 * @param {string} options.mobileAnimate.styleID - css 加载的容器 ，id 应与 content 中 css 容器的 id 相同
 * @param {string} options.mobileAnimate.string - markdown 加载的容器，id 应与 content 中 md 容器的 id 相同
 */
let ar = new AnimateResume(container, {
  content:[
    {
      load:'',
      type:'css',
      id:'',
      rewrite:'',
    },
    ...
  ],
  mobileAnimate:{
    styleID:'',
    resumeID:''
  }
})
ar.animate()
ar.skip()
```

使用前需要实例化一个并传入参数，通过 `animate` 方法开始动画，`skip` 方法跳过动画

根据上述参数设想，我们可以写出如下的 `typescript` 接口，不了解 `typescript` 的同学可以直接跳过，只看上面代码的注释即可

```typescript
interface Core {
  container: Element
  options: CoreOptions
  isSkip: boolean

  animate: () => void
  skip: () => void
}

interface CoreOptions {
  content: Array<LoadParams>
  mobileAnimate?: {
    styleID: string
    resumeID: string
  }
}

interface LoadParams {
  load: string
  type: 'css' | 'md'
  id: string
  rewrite?: boolean
}
```

### 实现

基本的架构已经分析好了，现在可以开始实现了

#### 逐一加载

首先，因为动画是多段完成的，所以我们通过参数 `content` 传入的是一个二维数组，其中每个 item 存放着我们想要加载的内容和对应要求，如何让动画一段一段的完成呢？很自然的能想到 `Promise` 方法，通过 `Promise.then()` 来实现。

所以我们可以将这个需求抽象为：一个未知长度的数组，需要逐一的在未知时间后加载下一项。

实现也很简单，代码如下：

```js
function load(contents) {
  if (contents.length) {
    this.loadItem(contents[0])
      .then(() => this.load(contents.slice(1)))
  }
}
```

可以想到，上述中的 `loadItem` 方法应该返回一个 `new Promise` ,内部当字符串加载完成后返回 `resolve()`，然后继续执行下一段 `load` 方法

#### 支持跳过

如何才能中断当前的动画，直接加载完成呢？

最初我尝试直接暴力的通过在 `loadItem` 时检查加载字数和一个全局变量来判断是否 `setTimeout`，
但很明显这么做及其不优雅，而且有 bug（但我忘了是什么 bug 了...）。

优雅实现：在类中声明 `this.isSkip = false`（相当于全局变量），在 `skip()` 方法调用时，将其改变为 true，在 `loadItem` 中 `setTimeout` 前检查该变量，如果为 true 则抛出 `reject()`

所以上述的 `load` 方法需要添加变为：

```js
function load(contents) {
  if (contents.length) {
    this.loadItem(contents[0])
      .then(() => this.load(contents.slice(1)))
      .catch(() => this.skipAnimate())
  }
}
```

`skipAnimate` 即为对应的跳过动画方法

#### 移动端处理

没有动图…… 请[点击预览](https://qishaoxuan.github.io/animate_resume_ts/)在手机或者谷歌调试中自行查看

展示样式我们可以直接在渲染的 `CSS` 代码动画中自定义，所以不过多解释

这里只说一下两个页面上下滑动的效果实现

我们需要借助 `better-scroll` 插件来帮助优化，分别设置上部分页面上拉刷新事件和下部分页面的下拉刷新事件，在对应事件触发时，通过 `transform:translateY(x)` 来实现页面的整体滑动，代码如下

```js
  let styleScroll = new BScroll(styleContainer, {
    pullUpLoad: {
      threshold: 20
    }
  })

  let mdScroll = new BScroll(mdContainer, {
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
```

需要注意的是如果下方简历内容长度不够，不会触发 `better-scroll` 的滑动检测，导致无法出现预想的滑动效果。

#### 标点处理

根据传入的字符来判断下一个字符出现的延迟时间，即 `setTimeout` 方法的第二个参数。

```typescript
function getInterval(str: string, interval = 16): number {
  if (/\D[\,]\s$/.test(str)) return interval * 20
  if (/[^\/]\n\n$/.test(str)) return interval * 40
  if (/[\.\?\!]\s$/.test(str)) return interval * 60
  return 0
}
```

参考自 https://github.com/STRML/strml.net/blob/master/app.js ，算是拾人牙慧了。

## 结束

基本的实现思路已经说完，具体的代码贴上来实在是篇幅太长，请[查看源码](https://github.com/QiShaoXuan/animate_resume_ts)。

不了解 `typescript` 的同学可以看[这里](https://github.com/QiShaoXuan/animate_resume)，这是我年初时用 `js` 写的，不过算是面向过程编写，没有做过多的封装处理。

## 写在最后

第一次见到[http://strml.net/](http://strml.net/) 时，是在初学前端大概三四个月的样子，当时看到这样的展现形式着实是被惊艳到了，那时还是个小白，连 `highlight` 这样的插件都不知道，更不知道还能在`style`里自定义东西，更更更不知道网站下面就放着`View Source`这么个大字，只是一心想的要自己也写一个，就那么硬生生自己写正则，通过不同的特殊符号加载对应的标签处理变色，再通过 `dom.style....=...' 设置样式，然后居然还写的有模有样，第一次找工作时还居然敢拿出来给面试官看了（笑）。

年初的时候试着重写了这个项目，感觉已是没有什么难度了，不过也是面向过程，一顿操作罢了。这些天初学 `typescript` 想着拿个什么东西练个手，所以又把这个项目用 `ts` 重构了，并且进一步的进行了封装。感觉可以出来溜溜了，所以写下了这篇文章。














