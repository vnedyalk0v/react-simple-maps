import React, { createContext, useContext, ReactNode } from "react"
import { ZoomPanContextType } from "../types"

const ZoomPanContext = createContext<ZoomPanContextType | undefined>(undefined)

const defaultValue: ZoomPanContextType = {
  x: 0,
  y: 0,
  k: 1,
  transformString: "translate(0 0) scale(1)",
}

interface ZoomPanProviderProps {
  value?: ZoomPanContextType
  children: ReactNode
}

const ZoomPanProvider: React.FC<ZoomPanProviderProps> = ({ value = defaultValue, children }) => {
  return <ZoomPanContext.Provider value={value}>{children}</ZoomPanContext.Provider>
}

const useZoomPanContext = (): ZoomPanContextType => {
  const context = useContext(ZoomPanContext)
  if (context === undefined) {
    throw new Error("useZoomPanContext must be used within a ZoomPanProvider")
  }
  return context
}

export { ZoomPanContext, ZoomPanProvider, useZoomPanContext }
