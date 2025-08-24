"use client"

import { useState, useEffect } from "react"

export type OrientationType = "portrait-up" | "portrait-down" | "landscape-left" | "landscape-right"

export function useOrientation() {
  const [orientation, setOrientation] = useState<OrientationType>("portrait-up")

  useEffect(() => {
    const updateOrientation = () => {
      if (typeof window === "undefined") return

      const angle = window.screen?.orientation?.angle ?? 0

      switch (angle) {
        case 0:
          setOrientation("portrait-up")
          break
        case 90:
          setOrientation("landscape-left")
          break
        case 180:
          setOrientation("portrait-down")
          break
        case 270:
          setOrientation("landscape-right")
          break
        default:
          // Fallback for browsers without screen.orientation
          const isLandscape = window.innerWidth > window.innerHeight
          setOrientation(isLandscape ? "landscape-left" : "portrait-up")
      }
    }

    // Initial check
    updateOrientation()

    // Listen for orientation changes
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener("change", updateOrientation)
    } else {
      // Fallback for older browsers
      window.addEventListener("orientationchange", updateOrientation)
      window.addEventListener("resize", updateOrientation)
    }

    return () => {
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener("change", updateOrientation)
      } else {
        window.removeEventListener("orientationchange", updateOrientation)
        window.removeEventListener("resize", updateOrientation)
      }
    }
  }, [])

  return orientation
}
