const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload script loaded");

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {
    const validChannels = ['close-window', 'minimize-window', 'maximize-window'];
    console.log("Sending data via IPC", channel, data);
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
});
