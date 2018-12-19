export default function appear(container,text) {
   return new Promise(resolve => {
      let dom = document.querySelector(container)
      let loadStr = text
      let num = 0
      let isEnd = false
      let sum = loadStr.length
      const start = function (interval) {
         setTimeout(() => {
            if (num === 0 && isEnd) {
               return resolve()
            }
            if (isEnd){
               num -= 1
            }else{
               num += 1
               if(num == sum){
                  isEnd = true
               }
            }
            dom.innerText = loadStr.substr(0,num)
            start(isEnd?10:50)
         },interval)
      }
      start(50)
   })
}