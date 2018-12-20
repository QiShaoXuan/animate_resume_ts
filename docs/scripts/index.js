(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define(['jquery'], factory) :
	(factory(global.$));
}(this, (function ($) { 'use strict';

function getInterval(str, interval = 16) {
    if (/\D[\,]\s$/.test(str))
        return interval * 20;
    if (/[^\/]\n\n$/.test(str))
        return interval * 40;
    if (/[\.\?\!]\s$/.test(str))
        return interval * 60;
    return 0;
}

// import * as Prism from 'prismjs';
function load(item) {
    return new Promise((resolve, reject) => {
        console.log($);
        let container = item.container;
        let num = 0;
        let sum = item.load.length;
        let containerOriginContent = item.rewrite ? '' : container.innerHTML;
        let interval = 16;
        const startLoad = () => {
            setTimeout(() => {
                num += 1;
                if (num <= sum) {
                    let str = item.load.substr(0, num);
                    // let code = Prism.highlight(str, Prism.languages.css)
                    let nextInterval = getInterval(str, interval);
                    container.scrollTop = 100000;
                    container.innerHTML = containerOriginContent + str;
                    setTimeout(() => {
                        startLoad();
                    }, nextInterval);
                }
                else {
                    return resolve();
                }
            }, interval);
        };
        startLoad();
    });
}

class AnimateResume {
    constructor(options) {
        this.options = options;
    }
    load(contents) {
        contents.length && load(contents[0]).then(() => this.load(contents.slice(1)));
    }
    animate() {
        this.load(this.options.content);
    }
    skip() { }
}
// ----------------------------------
let load1 = {
    load: 'abcdefg',
    type: 'css',
    container: document.querySelector('#style-editor'),
    rewrite: true
};
let load2 = {
    load: 'hijklmn',
    type: 'css',
    container: document.querySelector('#style-editor'),
    rewrite: false
};
const ar = new AnimateResume({ content: [load1, load2] });
ar.animate();

})));

//# sourceMappingURL=index.js.map
