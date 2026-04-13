'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type NavVisibilityContextValue = {
  navVisible: boolean
  setNavVisible: (v: boolean) => void
}

const NavVisibilityContext = createContext<NavVisibilityContextValue | null>(null)

export function NavVisibilityProvider({ children }: { children: ReactNode }) {
  const [navVisible, setNavVisibleState] = useState(true)
  const setNavVisible = useCallback((v: boolean) => {
    setNavVisibleState(v)
  }, [])
  const value = useMemo(() => ({ navVisible, setNavVisible }), [navVisible, setNavVisible])
  return <NavVisibilityContext.Provider value={value}>{children}</NavVisibilityContext.Provider>
}

export function useNavVisibility() {
  const ctx = useContext(NavVisibilityContext)
  if (!ctx) throw new Error('useNavVisibility requires NavVisibilityProvider')
  return ctx
}
