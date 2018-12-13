let config = {
  pause: false,
  isMobile: isMobile()
}
function isMobile() {
  return document.body.clientWidth < 750 ? true : false
}
export default  config
