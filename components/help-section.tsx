"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function HelpSection() {
  const [isOpen, setIsOpen] = useState(false)

  const orientationGuide = [
    {
      orientation: "Portrait Upright",
      feature: "Alarm Clock",
      icon: "⏰",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      orientation: "Landscape Left",
      feature: "Stopwatch",
      icon: "⏱️",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      orientation: "Portrait Upside Down",
      feature: "Timer",
      icon: "⏲️",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      orientation: "Landscape Right",
      feature: "Weather",
      icon: "🌤️",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
  ]

  return (
    <Card className="mt-6 overflow-hidden bg-card/30 backdrop-blur-sm border-border/50">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 justify-between hover:bg-accent/30 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Orientation Guide</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 pt-0 space-y-3">
          {orientationGuide.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${item.bgColor}`}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-black">{item.orientation}</div>
                <div className={`text-xs ${item.color}`}>{item.feature}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
