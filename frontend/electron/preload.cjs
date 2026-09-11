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
  pause: () => ipcRenderer.send('monitor:pause'),
  resume: () => ipcRenderer.send('monitor:resume'),
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

// Desktop Native Features bridge
contextBridge.exposeInMainWorld('desktopNative', {
  // Native OS Notifications
  showNotification: (title, body) => ipcRenderer.send('show-notification', { title, body }),

  // Always-on-Top / Focus Mode
  setAlwaysOnTop: (isTop) => ipcRenderer.invoke('set-always-on-top', isTop),

  // Auto-Launch on Startup
  setAutoLaunch: (enable) => ipcRenderer.invoke('set-auto-launch', enable),
  getAutoLaunch: () => ipcRenderer.invoke('get-auto-launch'),

  // Idle Detection — returns seconds the system has been idle
  getSystemIdleTime: () => ipcRenderer.invoke('get-system-idle-time'),

  isElectron: true,
})
