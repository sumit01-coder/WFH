/**
 * electron/monitor.cjs
 * Background activity monitor — runs in the Electron main process.
 * Polls the active window every 5 seconds and batches logs to the backend.
 * Takes a screenshot every 5 minutes.
 */

const { ipcMain } = require('electron')

const fs = require('fs')
const path = require('path')
const os = require('os')

const logPath = path.join(os.homedir(), 'wfh_monitor_debug.txt')
function logToFile(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`
  fs.appendFileSync(logPath, line)
}

let monitorInterval = null
let screenshotInterval = null
let authToken = null
let apiBase = 'http://localhost:5000/api'

// Buffer of activity logs to send in batches
let logBuffer = []

// Try to get active window info using active-win
async function getActiveWindow() {
  try {
    const activeWin = require('active-win');
    const win = await activeWin();
    if (!win) {
      return { appName: 'Unknown', windowTitle: '' };
    }
    return {
      appName: win.owner?.name || win.title || 'Unknown',
      windowTitle: win.title || '',
    };
  } catch (err) {
    logToFile('[Monitor] Failed to get active window: ' + err.message);
    return { appName: 'Unknown', windowTitle: '' };
  }
}

// Flush buffer to backend
async function flushLogs() {
  if (!authToken || logBuffer.length === 0) return
  const toSend = [...logBuffer]
  logBuffer = []
  try {
    const res = await fetch(`${apiBase}/monitor/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ logs: toSend }),
    })
    
    if (!res.ok) {
      logToFile('[Monitor] Backend rejected logs with status: ' + res.status);
      // Put back on failure
      logBuffer = [...toSend, ...logBuffer]
    } else {
      logToFile(`[Monitor] Successfully pushed ${toSend.length} logs to backend`);
    }
  } catch (err) {
    logToFile('[Monitor] Fetch failed: ' + err.message);
    logBuffer = [...toSend, ...logBuffer]
  }
}

// Take and upload a screenshot
async function captureScreenshot() {
  if (!authToken) return
  try {
    const screenshot = require('screenshot-desktop')
    const imgBuffer = await screenshot({ format: 'jpg' })
    const formData = new FormData()
    const blob = new Blob([imgBuffer], { type: 'image/jpeg' })
    formData.append('screenshot', blob, 'screenshot.jpg')
    await fetch(`${apiBase}/monitor/screenshot`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    })
    logToFile('[Monitor] Screenshot uploaded');
  } catch (err) {
    logToFile('[Monitor] Screenshot failed: ' + err.message)
  }
}

// Start monitoring
function startMonitoring(token) {
  if (monitorInterval) {
    logToFile('[Monitor] Already running');
    return // already running
  }
  authToken = token

  logToFile('[Monitor] Started activity tracking')

  let lastApp = ''
  let lastTitle = ''
  let lastTime = Date.now()

  monitorInterval = setInterval(async () => {
    const { appName, windowTitle } = await getActiveWindow()
    const now = Date.now()
    const durationSec = Math.round((now - lastTime) / 1000)
    lastTime = now

    if (durationSec > 0) {
      logBuffer.push({
        appName: lastApp || appName,
        windowTitle: lastTitle || windowTitle,
        durationSec,
        isIdle: false,
        recordedAt: new Date(now - durationSec * 1000).toISOString(),
      })
    }

    lastApp = appName
    lastTitle = windowTitle

    // Flush every 10 entries
    if (logBuffer.length >= 10) {
      flushLogs()
    }
  }, 5000) // every 5 seconds

  // Flush remaining logs every 30 seconds
  setInterval(flushLogs, 30000)

  // Screenshot every 5 minutes
  screenshotInterval = setInterval(captureScreenshot, 5 * 60 * 1000)
}

// Stop monitoring
function stopMonitoring() {
  if (monitorInterval) {
    clearInterval(monitorInterval)
    monitorInterval = null
  }
  if (screenshotInterval) {
    clearInterval(screenshotInterval)
    screenshotInterval = null
  }
  flushLogs() // send any remaining logs
  authToken = null
  logToFile('[Monitor] Stopped activity tracking')
}

// IPC handlers — called from renderer (React) via preload bridge
ipcMain.on('monitor:start', (event, token) => {
  logToFile('[Monitor] Received monitor:start IPC');
  startMonitoring(token)
})

ipcMain.on('monitor:stop', () => {
  logToFile('[Monitor] Received monitor:stop IPC');
  stopMonitoring()
})

module.exports = { startMonitoring, stopMonitoring }
