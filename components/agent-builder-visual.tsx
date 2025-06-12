"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowRight, MessageSquare, Search, User } from "lucide-react"

export default function AgentBuilderVisual() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`relative transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-[500px] mx-auto">
        <div className="relative">
          {/* Main flowchart */}
          <div className="flex flex-col items-center">
            {/* Start node */}
            <div className="mb-2 text-xs font-semibold text-gray-500">START</div>

            {/* Trigger node */}
            <div className="bg-[#f8f8f8] rounded-lg p-4 mb-4 w-full max-w-[400px] border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Trigger</div>
                  <div className="text-xs text-gray-500">Agent starts when user sends a chat message</div>
                </div>
              </div>
            </div>

            <ArrowDown className="h-6 w-6 text-gray-400 my-2" />

            {/* Search node */}
            <div className="bg-[#f8f8f8] rounded-lg p-4 mb-4 w-full max-w-[400px] border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Search className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">People profile search</div>
                  <div className="text-xs text-gray-500">Get the current user's profile</div>
                </div>
              </div>
            </div>

            <ArrowDown className="h-6 w-6 text-gray-400 my-2" />

            {/* Branch node */}
            <div className="bg-[#f8f8f8] rounded-lg p-4 mb-4 w-full max-w-[400px] border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="bg-pink-100 p-2 rounded-full">
                  <ArrowRight className="h-4 w-4 text-pink-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Branch</div>
                  <div className="text-xs text-gray-500">Agent decides which branch to follow</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full max-w-[400px] mb-4">
              <div className="text-xs text-gray-500">New employee</div>
              <div className="text-xs text-gray-500">Fallback</div>
            </div>

            {/* Response nodes */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-[400px]">
              <div className="bg-[#f8f8f8] rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">Respond</div>
                    <div className="text-[10px] text-gray-500">Let the user know their status</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#f8f8f8] rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium">Find a recent email</div>
                    <div className="text-[10px] text-gray-500">Let AI decide actions to take</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance cycle card */}
          <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/4 bg-white rounded-lg shadow-lg p-4 w-[300px] border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 p-1 rounded-full">
                <ArrowRight className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm font-medium">Performance cycle eligibility</div>
            </div>
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span>96</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                <span>243</span>
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              Provides information on employee performance reviews and eligibility based on tenure
            </div>
            <div className="bg-gray-100 rounded-md p-2 text-xs text-gray-700">Ask anything...</div>
            <div className="mt-4">
              <div className="text-xs mb-1">Am I eligible for this upcoming cycle?</div>
              <div className="flex gap-2">
                <div className="bg-gray-100 rounded-md p-1 text-xs">Peer reviews</div>
                <div className="bg-gray-100 rounded-md p-1 text-xs">Self review best practices</div>
              </div>
              <div className="mt-3 text-xs text-blue-600">View agent details</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
