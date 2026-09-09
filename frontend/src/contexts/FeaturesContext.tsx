import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface UserFeatures {
  hasPayroll: boolean
  hasExpenses: boolean
  hasOnboarding: boolean
  hasOffboarding: boolean
  hasAssets: boolean
}

interface FeaturesContextType {
  features: UserFeatures
  refreshFeatures: () => void
}

const defaultFeatures: UserFeatures = {
  hasPayroll: false,
  hasExpenses: true,
  hasOnboarding: false,
  hasOffboarding: false,
  hasAssets: false,
}

const FeaturesContext = createContext<FeaturesContextType>({
  features: defaultFeatures,
  refreshFeatures: () => {},
})

export const FeaturesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth()
  const [features, setFeatures] = useState<UserFeatures>(defaultFeatures)

  const refreshFeatures = useCallback(async () => {
    if (!token || !isAuthenticated) return
    try {
      const res = await axios.get(`${API}/users/me/features`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFeatures(res.data)
    } catch {
      // keep defaults on error
    }
  }, [token, isAuthenticated])

  useEffect(() => {
    refreshFeatures()
  }, [refreshFeatures])

  return (
    <FeaturesContext.Provider value={{ features, refreshFeatures }}>
      {children}
    </FeaturesContext.Provider>
  )
}

export const useFeatures = () => useContext(FeaturesContext)
