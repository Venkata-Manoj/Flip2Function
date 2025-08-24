"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useOrientation } from "@/hooks/use-orientation"
import { AlarmClock } from "@/components/alarm-clock"
import { Stopwatch } from "@/components/stopwatch"
import { Timer } from "@/components/timer"
import { Weather } from "@/components/weather"
import { ThemeToggle } from "@/components/theme-toggle"
import { HelpSection } from "@/components/help-section"
import { ParticleBackground } from "@/components/particle-background"
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
      }, 400)
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
        return "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300/30 shadow-amber-500/20 shadow-lg"
      case "landscape-left":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300/30 shadow-blue-500/20 shadow-lg"
      case "portrait-down":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300/30 shadow-purple-500/20 shadow-lg"
      case "landscape-right":
        return "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-300/30 shadow-teal-500/20 shadow-lg"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  const getBackgroundGradient = () => {
    switch (orientation) {
      case "portrait-up":
        return "bg-gradient-to-br from-amber-50/50 via-background to-amber-100/30 dark:from-amber-950/30 dark:via-background dark:to-amber-900/20"
      case "landscape-left":
        return "bg-gradient-to-br from-blue-50/50 via-background to-blue-100/30 dark:from-blue-950/30 dark:via-background dark:to-blue-900/20"
      case "portrait-down":
        return "bg-gradient-to-br from-purple-50/50 via-background to-purple-100/30 dark:from-purple-950/30 dark:via-background dark:to-purple-900/20"
      case "landscape-right":
        return "bg-gradient-to-br from-teal-50/50 via-background to-teal-100/30 dark:from-teal-950/30 dark:via-background dark:to-teal-900/20"
      default:
        return "bg-gradient-to-br from-background via-background to-muted/20"
    }
  }

  return (
    <div
      className={`min-h-screen p-4 flex transition-all duration-700 text-foreground justify-center items-center flex-col relative overflow-hidden ${getBackgroundGradient()}`}
    >
      <ParticleBackground />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          className="text-center mb-8 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <div className="relative">
                <Smartphone className="h-8 w-8 text-primary drop-shadow-lg" />
                <RotateCcw
                  className="h-4 w-4 text-muted-foreground absolute -top-1 -right-1 animate-spin drop-shadow-sm"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg">
                Flip2Function
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>

          <div className="space-y-3">
            <motion.div
              className={`inline-flex px-6 py-3 text-base font-bold rounded-2xl backdrop-blur-md border transition-all duration-500 ${getFeatureColor()}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {getFeatureName()}
            </motion.div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
              {getOrientationInstruction()}
            </p>
          </div>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={orientation}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                scale: { duration: 0.3 },
              }}
              className="bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl p-8 hover:shadow-3xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              {renderFeature()}
            </motion.div>
          </AnimatePresence>
        </div>

        <HelpSection />

        <motion.footer
          className="mt-8 pt-6 border-t border-white/10 dark:border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground/80 mb-3 font-medium">
              Designed by{" "}
              <span className="font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Manoj
              </span>
            </p>
            <motion.a
              href="https://www.linkedin.com/in/venkata-manoj/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-all duration-300 hover:underline bg-white/5 dark:bg-black/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 dark:border-white/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Connect on LinkedIn
              <ExternalLink className="h-4 w-4" />
            </motion.a>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
