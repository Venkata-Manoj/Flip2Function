"use client"

import { useOrientation } from "@/hooks/use-orientation"
import { AlarmClock } from "@/components/alarm-clock"
import { Stopwatch } from "@/components/stopwatch"
import { Timer } from "@/components/timer"
import { Weather } from "@/components/weather"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Smartphone } from "lucide-react"
import { useState, useEffect } from "react"

export default function HomePage() {
  const orientation = useOrientation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [previousOrientation, setPreviousOrientation] = useState(orientation)

  useEffect(() => {
    if (orientation !== previousOrientation) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setPreviousOrientation(orientation)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [orientation, previousOrientation])

  const renderFeature = () => {
    const currentOrientation = isTransitioning ? previousOrientation : orientation

    switch (currentOrientation) {
      case "portrait-up":
        return <AlarmClock />
      case "landscape-left":
        return <Stopwatch />
      case "portrait-down":
        return <Timer />
      case "landscape-right":
        return <Weather />
      default:
        return <AlarmClock />
    }
  }

  const getFeatureName = () => {
    const currentOrientation = isTransitioning ? previousOrientation : orientation

    switch (currentOrientation) {
      case "portrait-up":
        return "Alarm Clock"
      case "landscape-left":
        return "Stopwatch"
      case "portrait-down":
        return "Timer"
      case "landscape-right":
        return "Weather"
      default:
        return "Alarm Clock"
    }
  }

  const getOrientationInstruction = () => {
    switch (orientation) {
      case "portrait-up":
        return "Hold upright for Alarm Clock"
      case "landscape-left":
        return "Rotate left for Stopwatch"
      case "portrait-down":
        return "Flip upside-down for Timer"
      case "landscape-right":
        return "Rotate right for Weather"
      default:
        return "Rotate device to switch features"
    }
  }

  const getFeatureColor = () => {
    switch (orientation) {
      case "portrait-up":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      case "landscape-left":
        return "bg-green-500/10 text-green-700 border-green-200"
      case "portrait-down":
        return "bg-orange-500/10 text-orange-700 border-orange-200"
      case "landscape-right":
        return "bg-purple-500/10 text-purple-700 border-purple-200"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Smartphone className="h-8 w-8 text-primary" />
              <RotateCcw
                className="h-4 w-4 text-muted-foreground absolute -top-1 -right-1 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Flip2Function
            </h1>
          </div>

          <div className="space-y-2">
            <Badge
              variant="secondary"
              className={`px-4 py-2 text-sm font-medium transition-all duration-500 ${getFeatureColor()}`}
            >
              {getFeatureName()}
            </Badge>
            <p className="text-xs text-muted-foreground leading-relaxed">{getOrientationInstruction()}</p>
          </div>
        </div>

        <div className="relative">
          {isTransitioning && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center transition-opacity duration-300">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Switching to {getFeatureName()}...</span>
              </div>
            </div>
          )}

          <Card
            className={`p-6 shadow-lg border-0 bg-card/50 backdrop-blur-sm transition-all duration-500 ease-out ${
              isTransitioning ? "scale-95 opacity-50" : "scale-100 opacity-100"
            }`}
          >
            <div className={`transition-all duration-300 ${isTransitioning ? "blur-sm" : "blur-0"}`}>
              {renderFeature()}
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div
              className={`p-2 rounded-md transition-colors ${orientation === "portrait-up" ? "bg-blue-500/10 text-blue-700" : "hover:bg-muted/50"}`}
            >
              📱 Upright → Alarm
            </div>
            <div
              className={`p-2 rounded-md transition-colors ${orientation === "landscape-left" ? "bg-green-500/10 text-green-700" : "hover:bg-muted/50"}`}
            >
              📱 Left → Stopwatch
            </div>
            <div
              className={`p-2 rounded-md transition-colors ${orientation === "portrait-down" ? "bg-orange-500/10 text-orange-700" : "hover:bg-muted/50"}`}
            >
              🙃 Upside → Timer
            </div>
            <div
              className={`p-2 rounded-md transition-colors ${orientation === "landscape-right" ? "bg-purple-500/10 text-purple-700" : "hover:bg-muted/50"}`}
            >
              📱 Right → Weather
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
