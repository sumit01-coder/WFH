import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

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

  // Open the DevTools to debug the blank screen
  // win.webContents.openDevTools()

  // Auto-updater configuration
  log.transports.file.level = "info";
  autoUpdater.logger = log;

  autoUpdater.on('checking-for-update', () => {
    win?.webContents.send('updater-message', { status: 'checking' })
  });

  autoUpdater.on('update-available', (info) => {
    win?.webContents.send('updater-message', { status: 'update-available', info })
  });

  autoUpdater.on('update-not-available', (info) => {
    win?.webContents.send('updater-message', { status: 'update-not-available', info })
  });

  autoUpdater.on('error', (err) => {
    win?.webContents.send('updater-message', { status: 'error', error: err.message })
  });

  autoUpdater.on('download-progress', (progressObj) => {
    win?.webContents.send('updater-message', { 
      status: 'downloading', 
      percent: progressObj.percent, 
      bytesPerSecond: progressObj.bytesPerSecond,
      transferred: progressObj.transferred,
      total: progressObj.total 
    })
  });

  autoUpdater.on('update-downloaded', (info) => {
    win?.webContents.send('updater-message', { status: 'update-downloaded', info })
  });

  // Check for updates shortly after window loads
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
    if (process.env.NODE_ENV !== 'development' && !VITE_DEV_SERVER_URL) {
      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify()
      }, 3000);
    }
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

// Initialize the activity monitor IPC handlers
require('./monitor.cjs')

// Update-related IPC handlers
ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdatesAndNotify()
})

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall()
})

// App version IPC handler — exposes real installed version to renderer
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})
