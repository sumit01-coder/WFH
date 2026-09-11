import { app, BrowserWindow, Menu, Tray, globalShortcut, Notification, powerMonitor, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createRequire } from 'node:module'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// ðŸš§ Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null = null
let tray: Tray | null = null

// Plain variable to track whether the user explicitly quit (vs. close â†’ minimize to tray)
let isQuitting = false

// â”€â”€â”€ IPC Handlers (register before app.whenReady) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Activity monitor â€” exposes monitor.cjs IPC channels
require('./monitor.cjs')

// Auto-updater
ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdatesAndNotify()
})
ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall()
})

// App version â€” reads from main process (safe inside .asar)
ipcMain.handle('get-app-version', () => app.getVersion())

// Always-on-Top / Focus Mode
ipcMain.handle('set-always-on-top', (_event, isTop: boolean) => {
  win?.setAlwaysOnTop(isTop)
  return isTop
})

// Auto-Launch on Startup
ipcMain.handle('set-auto-launch', (_event, enable: boolean) => {
  app.setLoginItemSettings({ openAtLogin: enable, path: app.getPath('exe') })
  return enable
})
ipcMain.handle('get-auto-launch', () => {
  return app.getLoginItemSettings().openAtLogin
})

// Native OS Notifications
ipcMain.on('show-notification', (_event, { title, body }: { title: string; body: string }) => {
  new Notification({
    title,
    body,
    icon: path.join(process.env.VITE_PUBLIC || '', 'logo.png'),
  }).show()
})

// Idle Detection â€” returns system idle time in seconds
ipcMain.handle('get-system-idle-time', () => {
  return powerMonitor.getSystemIdleTime()
})

// â”€â”€â”€ Window Creation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(process.env.VITE_PUBLIC || '', 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  })

  // â”€â”€ Auto-updater events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  log.transports.file.level = 'info'
  autoUpdater.logger = log

  autoUpdater.on('checking-for-update', () => {
    win?.webContents.send('updater-message', { status: 'checking' })
  })
  autoUpdater.on('update-available', (info) => {
    win?.webContents.send('updater-message', { status: 'update-available', info })
  })
  autoUpdater.on('update-not-available', (info) => {
    win?.webContents.send('updater-message', { status: 'update-not-available', info })
  })
  autoUpdater.on('error', (err) => {
    win?.webContents.send('updater-message', { status: 'error', error: err.message })
  })
  autoUpdater.on('download-progress', (progressObj) => {
    win?.webContents.send('updater-message', {
      status: 'downloading',
      percent: progressObj.percent,
      bytesPerSecond: progressObj.bytesPerSecond,
      transferred: progressObj.transferred,
      total: progressObj.total,
    })
  })
  autoUpdater.on('update-downloaded', (info) => {
    win?.webContents.send('updater-message', { status: 'update-downloaded', info })
  })

  // Check for updates 3 seconds after load (production only)
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
    if (!VITE_DEV_SERVER_URL) {
      setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 3000)
    }
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // Minimise to tray instead of closing
  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      win?.hide()
    }
  })
}

// â”€â”€â”€ App Lifecycle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

app.whenReady().then(() => {
  // Required for Windows OS Notifications to display correctly
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.workflowpro.app')
  }

  createWindow()

  // â”€â”€ System Tray â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const iconPath = path.join(process.env.VITE_PUBLIC || '', 'logo.png')
  tray = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show WorkNexus', click: () => { win?.show(); win?.focus() } },
    { type: 'separator' },
    {
      label: 'Quit', click: () => {
        isQuitting = true
        app.quit()
      }
    },
  ])
  tray.setToolTip('WorkNexus')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => { win?.show(); win?.focus() })

  // â”€â”€ Global Shortcut: Ctrl+Shift+W â†’ show/hide â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  globalShortcut.register('CommandOrControl+Shift+W', () => {
    if (!win) return
    if (win.isVisible() && win.isFocused()) {
      win.hide()
    } else {
      win.show()
      win.focus()
    }
  })
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

// On macOS, re-open window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    win?.show()
  }
})

// On Windows/Linux: quit when all windows are closed (but we prevent close â†’ hide,
// so this only fires when the user quits via tray menu or taskbar)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    tray?.destroy()
    app.quit()
  }
})
