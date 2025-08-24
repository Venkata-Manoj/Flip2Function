"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Timer, Play, Pause, RotateCcw, Flag } from "lucide-react"

interface LapTime {
  id: number
  time: number
  lapTime: number
}

export function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<LapTime[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const lastLapTimeRef = useRef<number>(0)

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current)
      }, 10) // Update every 10ms for smooth display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, time])

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const ms = Math.floor((milliseconds % 1000) / 10)

    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      milliseconds: ms.toString().padStart(2, "0"),
    }
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
    lastLapTimeRef.current = 0
  }

  const handleLap = () => {
    if (isRunning && time > 0) {
      const lapTime = time - lastLapTimeRef.current
      const newLap: LapTime = {
        id: laps.length + 1,
        time: time,
        lapTime: lapTime,
      }
      setLaps((prev) => [newLap, ...prev])
      lastLapTimeRef.current = time
    }
  }

  const currentTime = formatTime(time)

  return (
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Timer className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Stopwatch</h2>
      </div>

      {/* Main Time Display */}
      <div className="space-y-2">
        <div className="text-5xl font-mono font-bold text-primary leading-none">
          {currentTime.minutes}:{currentTime.seconds}
        </div>
        <div className="text-2xl font-mono text-muted-foreground">.{currentTime.milliseconds}</div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <Button onClick={handleStart} size="lg" className="h-14 px-8 text-lg font-semibold">
            <Play className="h-5 w-5 mr-2" />
            Start
          </Button>
        ) : (
          <Button onClick={handlePause} variant="secondary" size="lg" className="h-14 px-8 text-lg font-semibold">
            <Pause className="h-5 w-5 mr-2" />
            Pause
          </Button>
        )}

        <Button
          onClick={handleLap}
          variant="outline"
          size="lg"
          className="h-14 px-6 bg-transparent"
          disabled={!isRunning}
        >
          <Flag className="h-5 w-5 mr-2" />
          Lap
        </Button>

        <Button onClick={handleReset} variant="destructive" size="lg" className="h-14 px-6" disabled={isRunning}>
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset
        </Button>
      </div>

      {/* Lap Times */}
      {laps.length > 0 && (
        <Card className="p-4 max-h-48 overflow-y-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-left">Lap Times</h3>
          <div className="space-y-2">
            {laps.map((lap, index) => {
              const lapTime = formatTime(lap.lapTime)
              const totalTime = formatTime(lap.time)
              const isFastest = laps.length > 1 && lap.lapTime === Math.min(...laps.map((l) => l.lapTime))
              const isSlowest = laps.length > 1 && lap.lapTime === Math.max(...laps.map((l) => l.lapTime))

              return (
                <div
                  key={lap.id}
                  className={`flex justify-between items-center py-2 px-3 rounded-md text-sm ${
                    isFastest
                      ? "bg-accent/20 text-accent"
                      : isSlowest
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted/50"
                  }`}
                >
                  <span className="font-medium">Lap {lap.id}</span>
                  <div className="text-right">
                    <div className="font-mono font-semibold">
                      {lapTime.minutes}:{lapTime.seconds}.{lapTime.milliseconds}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total: {totalTime.minutes}:{totalTime.seconds}.{totalTime.milliseconds}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-accent animate-pulse" : "bg-muted-foreground"}`} />
        <span className="text-xs text-muted-foreground">{isRunning ? "Running" : time > 0 ? "Paused" : "Ready"}</span>
      </div>
    </div>
  )
}
