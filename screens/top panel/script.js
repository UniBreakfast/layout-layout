fetch('/screens/top panel').then(r => r.text()).then(html => {
  const header = html.match(/<body>([\s\S]*)<\/body>/)[1]
  document.body.innerHTML = header + document.body.innerHTML
})