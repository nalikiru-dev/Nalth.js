import css from './imported.css'
text('.imported-css', css)

import sass from './sass.scss'
text('.imported-sass', sass)

import mod from './mod.module.css'
document.querySelector('.modules').classList.add(mod.applyColor)
text('.modules-code', JSON.stringify(mod, null, 2))

import sassMod from './mod.module.scss'
document.querySelector('.modules-sass').classList.add(sassMod.applyColor)
text('.modules-sass-code', JSON.stringify(sassMod, null, 2))

function text(el, text) {
  document.querySelector(el).textContent = text
}

if (import.meta.hot) {
  import.meta.hot.accept('./mod.module.css', (newMod) => {
    const list = document.querySelector('.modules').classList
    list.remove(mod.applyColor)
    list.add(newMod.applyColor)
    text('.modules-code', JSON.stringify(newMod.default, null, 2))
  })

  import.meta.hot.accept('./mod.module.scss', (newMod) => {
    const list = document.querySelector('.modules-sass').classList
    list.remove(mod.applyColor)
    list.add(newMod.applyColor)
    text('.modules-sass-code', JSON.stringify(newMod.default, null, 2))
  })
}

// async
import('./async')

if (import.meta.env.DEV) {
  import('./async-treeshaken')
}
