"use client"

import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "system":
        return <Monitor className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "🌞"
      case "dark":
        return "🌙"
      case "system":
        return "⚙️"
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className="h-8 w-8 p-0 rounded-full hover:bg-accent/50 transition-all duration-200"
      title={`Current theme: ${theme}`}
    >
      <span className="text-lg">{getLabel()}</span>
    </Button>
  )
}
