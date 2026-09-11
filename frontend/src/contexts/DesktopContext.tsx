import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

interface DesktopContextType {
  isElectron: boolean
  alwaysOnTop: boolean
  setAlwaysOnTop: (val: boolean) => Promise<void>
  autoLaunch: boolean
  setAutoLaunch: (val: boolean) => Promise<void>
  showNotification: (title: string, body: string) => void
  idleSeconds: number
  isIdle: boolean // true after 15 minutes of no input
}

const DesktopContext = createContext<DesktopContextType>({
  isElectron: false,
  alwaysOnTop: false,
  setAlwaysOnTop: async () => {},
  autoLaunch: false,
  setAutoLaunch: async () => {},
  showNotification: () => {},
  idleSeconds: 0,
  isIdle: false,
})

const IDLE_THRESHOLD_SECONDS = 15 * 60 // 15 minutes

export const DesktopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const native = (window as any).desktopNative
  const isElectron = !!native?.isElectron

  const [alwaysOnTop, setAlwaysOnTopState] = useState(false)
  const [autoLaunch, setAutoLaunchState] = useState(false)
  const [idleSeconds, setIdleSeconds] = useState(0)
  const idleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load initial auto-launch setting from OS
  useEffect(() => {
    if (isElectron) {
      native.getAutoLaunch().then((val: boolean) => setAutoLaunchState(val))
    } else if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission()
    }
  }, [isElectron])

  // Poll system idle time every 30 seconds
  useEffect(() => {
    if (!isElectron) return
    idleIntervalRef.current = setInterval(async () => {
      const secs: number = await native.getSystemIdleTime()
      setIdleSeconds(secs)
    }, 30_000)
    return () => {
      if (idleIntervalRef.current) clearInterval(idleIntervalRef.current)
    }
  }, [isElectron])

  const handleSetAlwaysOnTop = async (val: boolean) => {
    if (!isElectron) return
    await native.setAlwaysOnTop(val)
    setAlwaysOnTopState(val)
  }

  const handleSetAutoLaunch = async (val: boolean) => {
    if (!isElectron) return
    await native.setAutoLaunch(val)
    setAutoLaunchState(val)
  }

  const showNotification = (title: string, body: string) => {
    if (isElectron && native?.showNotification) {
      native.showNotification(title, body)
    } else if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body })
          }
        })
      }
    }
  }

  return (
    <DesktopContext.Provider value={{
      isElectron,
      alwaysOnTop,
      setAlwaysOnTop: handleSetAlwaysOnTop,
      autoLaunch,
      setAutoLaunch: handleSetAutoLaunch,
      showNotification,
      idleSeconds,
      isIdle: idleSeconds >= IDLE_THRESHOLD_SECONDS,
    }}>
      {children}
    </DesktopContext.Provider>
  )
}

export const useDesktop = () => useContext(DesktopContext)
