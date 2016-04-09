const ipcRenderer = require('electron').ipcRenderer;

var updateOnlineStatus = function() {
  ipcRenderer.send('online-status-changed', navigator.onLine);
};

window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline',  updateOnlineStatus);

updateOnlineStatus();
