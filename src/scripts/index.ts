import {Core, CoreOptions, LoadParams} from "./interface";
import {load} from "./untils/load";

class AnimateResume implements Core {
  options: CoreOptions

  constructor(options: CoreOptions) {
    this.options = options
  }

  private load(contents:Array<LoadParams>){
    contents.length && load(contents[0]).then(() => this.load(contents.slice(1)))
  }

  public animate() {
    this.load(this.options.content)
  }

  public skip() {}
}

// ----------------------------------

let load1: LoadParams = {
  load: 'abcdefg',
  type: 'css',
  container: document.querySelector('#style-editor'),
  rewrite: true
}
let load2: LoadParams = {
  load: 'hijklmn',
  type: 'css',
  container: document.querySelector('#style-editor'),
  rewrite: false
}

const ar = new AnimateResume({content: [load1,load2]})
ar.animate()
