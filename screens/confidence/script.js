
setInterval(switchAlignContent, 1000);

function switchAlignContent() {
  changes.style.alignContent =
    changes.scrollWidth > changes.clientWidth? 'flex-start' : 'center'
}