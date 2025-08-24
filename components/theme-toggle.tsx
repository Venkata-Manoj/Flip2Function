"use client"

import { useTheme } from "@/hooks/use-theme"
import { Button } from "@/components/ui/button"

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
      className="h-10 w-10 p-0 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
      title={`Current theme: ${theme}`}
    >
      <span className="text-xl">{getLabel()}</span>
    </Button>
  )
}
