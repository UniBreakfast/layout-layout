var slot = document.querySelector('.component-slot')

Promise.all([
  fetch('Components/ItemList/ItemList.html').then(r => r.text()),
  ...['base.css', 'ItemList.css', 'custom.css'].map(filename =>
    fetch('Components/ItemList/'+filename).then(r => r.text()).then(css => {
      const style = document.createElement('style')
      style.innerHTML = css
      document.head.append(style)
      return new Promise(resolve => style.onload = resolve)
    })
  )
]).then(([html])=> slot.innerHTML = html)