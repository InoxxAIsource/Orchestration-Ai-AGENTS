"use client"

import { useEffect, useState } from "react"
import { Code, FileText, MessageSquare, Settings, Users, Zap, Bug, Calendar, Database, GitBranch } from "lucide-react"

const floatingItems = [
  { icon: Code, text: "Run a code review", position: { top: "10%", left: "5%" } },
  { icon: FileText, text: "Write a PRD", position: { top: "15%", right: "8%" } },
  { icon: MessageSquare, text: "Create a support ticket", position: { top: "25%", left: "12%" } },
  { icon: Settings, text: "Configure system settings", position: { top: "35%", right: "15%" } },
  { icon: Users, text: "Schedule team meeting", position: { top: "45%", left: "8%" } },
  { icon: Zap, text: "Automate workflow", position: { top: "55%", right: "10%" } },
  { icon: Bug, text: "Debug an error", position: { top: "65%", left: "15%" } },
  { icon: Calendar, text: "Plan sprint", position: { top: "75%", right: "12%" } },
  { icon: Database, text: "Query database", position: { top: "20%", left: "85%" } },
  { icon: GitBranch, text: "Merge branches", position: { top: "60%", right: "85%" } },
  { icon: FileText, text: "Generate report", position: { top: "40%", left: "90%" } },
  { icon: MessageSquare, text: "Send notification", position: { top: "80%", left: "85%" } },
  { icon: Code, text: "Deploy to production", position: { top: "30%", left: "3%" } },
  { icon: Users, text: "Onboard new hire", position: { top: "70%", right: "5%" } },
  { icon: Settings, text: "Update documentation", position: { top: "50%", left: "2%" } },
]

export default function FloatingIcons() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingItems.map((item, index) => {
        const Icon = item.icon
        return (
          <div
            key={index}
            className={`absolute transition-all duration-1000 ${isVisible ? "opacity-30" : "opacity-0"}`}
            style={{
              ...item.position,
              animationDelay: `${index * 0.2}s`,
            }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-full p-3 shadow-sm border border-white/40 flex items-center gap-2 text-xs text-gray-600 whitespace-nowrap">
              <Icon className="h-4 w-4 text-gray-500" />
              <span className="hidden sm:inline">{item.text}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
