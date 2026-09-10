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

// Desktop Auto Updater bridge
contextBridge.exposeInMainWorld('desktopUpdater', {
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),
  installUpdate: () => ipcRenderer.send('install-update'),
  onUpdaterMessage: (callback) => {
    ipcRenderer.on('updater-message', (event, data) => callback(data))
  },
  removeListeners: () => ipcRenderer.removeAllListeners('updater-message')
})
// Desktop App Info bridge — version is fetched async from main process
contextBridge.exposeInMainWorld('desktopApp', {
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  isElectron: true,
})
