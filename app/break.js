const { ipcRenderer, remote } = require('electron')
const Utils = remote.require('./utils/utils')
const HtmlTranslate = require('./utils/htmlTranslate')

document.addEventListener('DOMContentLoaded', event => {
  new HtmlTranslate(document).translate()
})

document.addEventListener('dragover', event => event.preventDefault())
document.addEventListener('drop', event => event.preventDefault())

document.getElementById('close').addEventListener('click', event =>
  ipcRenderer.send('finish-break', false)
)

document.getElementById('postpone').addEventListener('click', event =>
  ipcRenderer.send('postpone-break')
)

ipcRenderer.on('breakIdea', (event, message) => {
  let breakIdea = document.getElementsByClassName('break-idea')[0]
  breakIdea.innerHTML = message[0]
  let breakText = document.getElementsByClassName('break-text')[0]
  breakText.innerHTML = message[1]
})

ipcRenderer.on('progress', (event, started, duration, strictMode, postpone, postponePercent) => {
  let progress = document.getElementById('progress')
  let progressTime = document.getElementById('progress-time')
  let postponeElement = document.getElementById('postpone')
  let closeElement = document.getElementById('close')

  window.setInterval(function () {
    if (Date.now() - started < duration) {
      const passedPercent = (Date.now() - started) / duration * 100
      postponeElement.style.visibility = 'visible'
        // Utils.canPostpone(postpone, passedPercent, postponePercent) ? 'visible' : 'hidden'
      closeElement.style.visibility = 'visible'
        // Utils.canSkip(strictMode, postpone, passedPercent, postponePercent) ? 'visible' : 'hidden'
      progress.value = passedPercent * progress.max / 100
      progressTime.innerHTML = Utils.formatRemaining(Math.trunc((duration - Date.now() + started) / 1000))
    }
  }, 100)
})
