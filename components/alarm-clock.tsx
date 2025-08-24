"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Bell, BellOff, Volume2 } from "lucide-react"

export function AlarmClock() {
  const [alarmTime, setAlarmTime] = useState("")
  const [isAlarmSet, setIsAlarmSet] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeRemaining, setTimeRemaining] = useState("")
  const [isAlarmRinging, setIsAlarmRinging] = useState(false)
  const [snoozeCount, setSnoozeCount] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // Check if alarm should trigger
      if (isAlarmSet && alarmTime && !isAlarmRinging) {
        const [hours, minutes] = alarmTime.split(":").map(Number)
        const alarmDate = new Date()
        alarmDate.setHours(hours, minutes, 0, 0)

        // If alarm time is earlier today, set for tomorrow
        if (alarmDate <= new Date()) {
          alarmDate.setDate(alarmDate.getDate() + 1)
        }

        const diff = alarmDate.getTime() - now.getTime()

        if (diff <= 1000 && diff >= 0) {
          triggerAlarm()
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [alarmTime, isAlarmSet, isAlarmRinging])

  useEffect(() => {
    if (isAlarmSet && alarmTime && !isAlarmRinging) {
      const now = new Date()
      const [hours, minutes] = alarmTime.split(":").map(Number)
      const alarmDate = new Date()
      alarmDate.setHours(hours, minutes, 0, 0)

      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1)
      }

      const diff = alarmDate.getTime() - now.getTime()

      if (diff > 0) {
        const totalHours = Math.floor(diff / (1000 * 60 * 60))
        const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const remainingSeconds = Math.floor((diff % (1000 * 60)) / 1000)

        if (totalHours > 0) {
          setTimeRemaining(`${totalHours}h ${remainingMinutes}m`)
        } else if (remainingMinutes > 0) {
          setTimeRemaining(`${remainingMinutes}m ${remainingSeconds}s`)
        } else {
          setTimeRemaining(`${remainingSeconds}s`)
        }
      }
    } else {
      setTimeRemaining("")
    }
  }, [currentTime, alarmTime, isAlarmSet, isAlarmRinging])

  const triggerAlarm = () => {
    setIsAlarmRinging(true)

    // Create audio context for alarm sound
    if (typeof window !== "undefined") {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.type = "sine"
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)

        oscillator.start()

        // Stop after 30 seconds if not dismissed
        setTimeout(() => {
          try {
            oscillator.stop()
          } catch (e) {
            // Oscillator already stopped
          }
        }, 30000)

        audioRef.current = { stop: () => oscillator.stop() } as any
      } catch (error) {
        console.log("Audio not supported")
      }
    }
  }

  const handleSetAlarm = () => {
    if (alarmTime) {
      setIsAlarmSet(true)
      setSnoozeCount(0)
    }
  }

  const handleCancelAlarm = () => {
    setIsAlarmSet(false)
    setIsAlarmRinging(false)
    setTimeRemaining("")
    setSnoozeCount(0)

    if (audioRef.current) {
      try {
        ;(audioRef.current as any).stop()
      } catch (e) {
        // Audio already stopped
      }
    }
  }

  const handleSnooze = () => {
    setIsAlarmRinging(false)
    setSnoozeCount((prev) => prev + 1)

    if (audioRef.current) {
      try {
        ;(audioRef.current as any).stop()
      } catch (e) {
        // Audio already stopped
      }
    }

    // Set new alarm time 5 minutes from now
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5)
    const newAlarmTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
    setAlarmTime(newAlarmTime)
  }

  const handleDismiss = () => {
    handleCancelAlarm()
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Alarm Clock</h2>
      </div>

      <div className="space-y-2">
        <div className="text-4xl font-mono font-bold text-primary">
          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="text-sm text-muted-foreground">
          {currentTime.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
        </div>
      </div>

      {isAlarmRinging && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-pulse">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Volume2 className="h-5 w-5 text-destructive animate-bounce" />
            <span className="text-lg font-semibold text-destructive">ALARM!</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSnooze} variant="outline" className="flex-1 bg-transparent">
              Snooze (5min)
            </Button>
            <Button onClick={handleDismiss} variant="destructive" className="flex-1">
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {!isAlarmRinging && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="alarm-time" className="text-sm font-medium">
              Set Alarm Time
            </Label>
            <Input
              id="alarm-time"
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="mt-1 text-lg text-center"
              disabled={isAlarmSet}
            />
          </div>

          {isAlarmSet && timeRemaining && (
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Alarm Set</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Time remaining:</p>
              <p className="text-xl font-bold text-accent">{timeRemaining}</p>
              {snoozeCount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Snoozed {snoozeCount} time{snoozeCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {!isAlarmSet ? (
              <Button onClick={handleSetAlarm} disabled={!alarmTime} className="flex-1 h-12">
                <Bell className="h-4 w-4 mr-2" />
                Set Alarm
              </Button>
            ) : (
              <Button onClick={handleCancelAlarm} variant="destructive" className="flex-1 h-12">
                <BellOff className="h-4 w-4 mr-2" />
                Cancel Alarm
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
