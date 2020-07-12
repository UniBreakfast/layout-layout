x = 40
delay = 20

lis = makeArr(x, ()=> lorem.sentence().slice(0, -1))
  .map(quest => `<li>${quest}</li>`)

interval = setInterval(()=> {
  quests.innerHTML += lis.pop()
  switchAlignContent()
}, delay)

setTimeout(()=> clearInterval(interval), delay*x)

function switchAlignContent() {
  quests.style.alignContent =
  quests.scrollWidth > quests.clientWidth? 'flex-start' : 'center'
}