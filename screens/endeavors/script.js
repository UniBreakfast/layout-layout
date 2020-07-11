x = 40
delay = 20

lis = makeArr(x, ()=> lorem.sentence().slice(0, -1))
  .map(endeavor => `<li>${endeavor}</li>`)

interval = setInterval(()=> {
  endeavors.innerHTML += lis.pop()
  switchAlignContent()
}, delay)

setTimeout(()=> clearInterval(interval), delay*x)

function switchAlignContent() {
  endeavors.style.alignContent =
    endeavors.scrollWidth > endeavors.clientWidth? 'flex-start' : 'center'
}