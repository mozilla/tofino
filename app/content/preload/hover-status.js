
const ipc = require('electron').ipcRenderer;

function setStatus(status) {
  ipc.sendToHost('status', status);
}

window.addEventListener('mouseover', e => {
  // Watch for mouseovers of anchor elements
  let el = e.target;
  while (el) {
    if (el.tagName === 'A') {
      // Set to title or href
      if (el.getAttribute('title')) {
        setStatus(el.getAttribute('title'));
      } else if (el.href) {
        setStatus(el.href);
      }
      return;
    }
    el = el.parentNode;
  }
  setStatus(false);
});
