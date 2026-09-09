const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(channel, listener) {
    ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(channel, ...args) {
    ipcRenderer.off(channel, ...args)
  },
  send(channel, ...args) {
    ipcRenderer.send(channel, ...args)
  },
  invoke(channel, ...args) {
    return ipcRenderer.invoke(channel, ...args)
  },
})

// Desktop monitoring bridge — only available in Electron
contextBridge.exposeInMainWorld('desktopMonitor', {
  start: (token) => ipcRenderer.send('monitor:start', token),
  stop: () => ipcRenderer.send('monitor:stop'),
  isElectron: true,
})
