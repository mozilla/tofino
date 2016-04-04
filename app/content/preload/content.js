
const ipc = require('electron').ipcRenderer;
require('./hover-status');
require('./context-menu');

window.addEventListener('message', (event) => {
  if (event.origin !== 'atom://') {
    return;
  }

  const data = JSON.parse(event.data);
  if (data.source !== 'page') {
    return;
  }

  if (data.target === 'host') {
    ipc.sendToHost('channel-message', data.source, data.type, data.data);
  } else if (data.target === 'main') {
    ipc.send('channel-message', data.source, data.type, data.data);
  }
}, false);

ipc.on('channel-message', (event, source, type, data) => {
  const message = {
    target: 'page',
    source,
    type,
    data,
  };
  window.postMessage(JSON.stringify(message), 'atom://');
});
