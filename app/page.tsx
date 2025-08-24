"use client"

import { useOrientation } from "@/hooks/use-orientation"
import { AlarmClock } from "@/components/alarm-clock"
import { Stopwatch } from "@/components/stopwatch"
import { Timer } from "@/components/timer"
import { Weather } from "@/components/weather"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { HelpSection } from "@/components/help-section"
import { RotateCcw, Smartphone, ExternalLink } from "lucide-react"
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
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
      case "landscape-left":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
      case "portrait-down":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
      case "landscape-right":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  const getBackgroundGradient = () => {
    switch (orientation) {
      case "portrait-up":
        return "bg-gradient-to-br from-blue-50 via-background to-blue-100/20 dark:from-blue-950/20 dark:via-background dark:to-blue-900/10"
      case "landscape-left":
        return "bg-gradient-to-br from-green-50 via-background to-green-100/20 dark:from-green-950/20 dark:via-background dark:to-green-900/10"
      case "portrait-down":
        return "bg-gradient-to-br from-purple-50 via-background to-purple-100/20 dark:from-purple-950/20 dark:via-background dark:to-purple-900/10"
      case "landscape-right":
        return "bg-gradient-to-br from-orange-50 via-background to-orange-100/20 dark:from-orange-950/20 dark:via-background dark:to-orange-900/10"
      default:
        return "bg-gradient-to-br from-background via-background to-muted/20"
    }
  }

  return (
    <div
      className={`min-h-screen p-4 flex transition-all duration-700 text-foreground justify-center items-center flex-col ${getBackgroundGradient()}`}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-between mb-4 text-slate-700 opacity-100">
            <div className="flex-1" />
            <div className="flex items-center gap-3">
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
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
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
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center transition-opacity duration-300">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Switching to {getFeatureName()}...</span>
              </div>
            </div>
          )}

          <Card
            className={`p-6 shadow-xl border-0 bg-card/80 backdrop-blur-md transition-all duration-500 ease-out rounded-xl ${
              isTransitioning ? "scale-95 opacity-50" : "scale-100 opacity-100"
            }`}
          >
            <div className={`transition-all duration-300 ${isTransitioning ? "blur-sm" : "blur-0"}`}>
              {renderFeature()}
            </div>
          </Card>
        </div>

        <HelpSection />

        <footer className="mt-8 pt-6 border-t border-border/30">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Designed by{" "}
              <span className="font-semibold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Manoj
              </span>
            </p>
            <a
              href="https://www.linkedin.com/in/venkata-manoj/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-all duration-200 hover:underline hover:scale-105"
            >
              Connect on LinkedIn
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
