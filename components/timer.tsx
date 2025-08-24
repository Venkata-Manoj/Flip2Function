"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Clock3, Play, Pause, RotateCcw, Volume2 } from "lucide-react"

export function Timer() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsFinished(true)
            triggerTimerEnd()
            return 0
          }
          return prev - 1
        })
      }, 1000)
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
  }, [isRunning, timeRemaining])

  const triggerTimerEnd = () => {
    // Create audio notification
    if (typeof window !== "undefined") {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // Create a pleasant chime sound
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
        oscillator.type = "sine"
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)

        oscillator.start()

        // Play for 2 seconds
        setTimeout(() => {
          try {
            oscillator.stop()
          } catch (e) {
            // Oscillator already stopped
          }
        }, 2000)

        audioRef.current = { stop: () => oscillator.stop() } as any
      } catch (error) {
        console.log("Audio not supported")
      }
    }
  }

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    return {
      hours: hrs.toString().padStart(2, "0"),
      minutes: mins.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    }
  }

  const handleStart = () => {
    if (timeRemaining === 0) {
      // Set new timer
      const total = hours * 3600 + minutes * 60 + seconds
      if (total > 0) {
        setTotalTime(total)
        setTimeRemaining(total)
        setIsRunning(true)
        setIsFinished(false)
      }
    } else {
      // Resume existing timer
      setIsRunning(true)
      setIsFinished(false)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeRemaining(0)
    setTotalTime(0)
    setIsFinished(false)

    if (audioRef.current) {
      try {
        ;(audioRef.current as any).stop()
      } catch (e) {
        // Audio already stopped
      }
    }
  }

  const handleDismiss = () => {
    setIsFinished(false)
    handleReset()
  }

  const currentTime = formatTime(timeRemaining)
  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0

  return (
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock3 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Timer</h2>
      </div>

      {isFinished && (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg animate-pulse">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Volume2 className="h-5 w-5 text-accent animate-bounce" />
            <span className="text-lg font-semibold text-accent">Time's Up!</span>
          </div>
          <Button onClick={handleDismiss} className="w-full">
            Dismiss
          </Button>
        </div>
      )}

      {!isFinished && (
        <>
          {/* Time Display */}
          <div className="space-y-4">
            {timeRemaining > 0 ? (
              <>
                <div className="text-5xl font-mono font-bold text-primary leading-none">
                  {currentTime.hours !== "00" && `${currentTime.hours}:`}
                  {currentTime.minutes}:{currentTime.seconds}
                </div>
                <Progress value={progress} className="w-full h-3" />
                <p className="text-sm text-muted-foreground">
                  {Math.round(progress)}% complete • {timeRemaining} seconds remaining
                </p>
              </>
            ) : (
              <div className="text-4xl font-mono font-bold text-muted-foreground">00:00</div>
            )}
          </div>

          {/* Time Input */}
          {timeRemaining === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="hours" className="text-xs font-medium">
                    Hours
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, Math.min(23, Number.parseInt(e.target.value) || 0)))}
                    className="text-center text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="minutes" className="text-xs font-medium">
                    Minutes
                  </Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number.parseInt(e.target.value) || 0)))}
                    className="text-center text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="seconds" className="text-xs font-medium">
                    Seconds
                  </Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number.parseInt(e.target.value) || 0)))}
                    className="text-center text-lg"
                  />
                </div>
              </div>

              {/* Quick Set Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMinutes(1)
                    setSeconds(0)
                    setHours(0)
                  }}
                  className="text-xs"
                >
                  1m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMinutes(5)
                    setSeconds(0)
                    setHours(0)
                  }}
                  className="text-xs"
                >
                  5m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMinutes(10)
                    setSeconds(0)
                    setHours(0)
                  }}
                  className="text-xs"
                >
                  10m
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMinutes(30)
                    setSeconds(0)
                    setHours(0)
                  }}
                  className="text-xs"
                >
                  30m
                </Button>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-3 justify-center">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                size="lg"
                className="h-14 px-8 text-lg font-semibold"
                disabled={timeRemaining === 0 && hours === 0 && minutes === 0 && seconds === 0}
              >
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} variant="secondary" size="lg" className="h-14 px-8 text-lg font-semibold">
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}

            <Button onClick={handleReset} variant="destructive" size="lg" className="h-14 px-6">
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-accent animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">
              {isRunning ? "Running" : timeRemaining > 0 ? "Paused" : "Ready"}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
