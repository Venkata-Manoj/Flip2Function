"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlarmClockIcon,Clock, Bell, BellOff, Volume2, Sunrise } from "lucide-react"

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
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <AlarmClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300">Alarm Clock</h2>
      </div>

      <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800 bg-slate-900">
        <div className="text-5xl font-mono font-bold text-blue-700 dark:text-blue-300 tracking-wider">
          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="text-sm text-blue-600/70 dark:text-blue-400/70 font-medium">
          {currentTime.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
        </div>
      </div>

      {isAlarmRinging && (
        <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-800 rounded-2xl animate-pulse shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50 animate-bounce">
              <Volume2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400 animate-pulse">ALARM RINGING!</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSnooze}
              variant="outline"
              className="flex-1 h-14 text-lg font-semibold border-2 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all duration-200 bg-transparent text-black"
            >
              <Bell className="h-5 w-5 mr-2" />
              Snooze 5min
            </Button>
            <Button
              onClick={handleDismiss}
              className="flex-1 h-14 text-lg font-semibold bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-all duration-200"
            >
              <BellOff className="h-5 w-5 mr-2" />
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {!isAlarmRinging && (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="alarm-time"
              className="text-base font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2"
            >
              <Sunrise className="h-4 w-4" />
              Set Alarm Time
            </Label>
            <Input
              id="alarm-time"
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="text-xl text-center h-14 border-2 border-blue-200 dark:border-blue-800 rounded-xl focus:border-blue-400 dark:focus:border-blue-600 transition-all duration-200"
              disabled={isAlarmSet}
            />
          </div>

          {isAlarmSet && timeRemaining && (
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border-2 border-green-200 dark:border-green-800 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/50">
                  <Bell className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-lg font-bold text-green-700 dark:text-green-300">Alarm Active</span>
              </div>
              <p className="text-sm text-green-600/70 dark:text-green-400/70 mb-2">Time remaining:</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300 font-mono">{timeRemaining}</p>
              {snoozeCount > 0 && (
                <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-2">
                  Snoozed {snoozeCount} time{snoozeCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {!isAlarmSet ? (
              <Button
                onClick={handleSetAlarm}
                disabled={!alarmTime}
                className="flex-1 h-16 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <Bell className="h-5 w-5 mr-2" />
                Set Alarm
              </Button>
            ) : (
              <Button
                onClick={handleCancelAlarm}
                variant="destructive"
                className="flex-1 h-16 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <BellOff className="h-5 w-5 mr-2" />
                Cancel Alarm
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
