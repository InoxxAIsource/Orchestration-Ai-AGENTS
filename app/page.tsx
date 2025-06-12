"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import FloatingIcons from "@/components/floating-icons"
import { TermsModal } from "@/components/terms-modal"

export default function Home() {
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <Link href="/" className="mr-8 text-xl font-bold">
            InoxxAI
          </Link>
          <nav className="hidden md:flex items-center space-x-1">
            <div className="relative group">
              <button className="px-3 py-2 flex items-center text-gray-700 hover:text-gray-900">
                Product <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 top-full w-64 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-50">
                <Link href="/playground" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Agent Playground
                </Link>
                <Link href="/orchestration" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Orchestration Builder
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">AI Agents</div>
                <Link href="/agents/agentic" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Agentic AI Agents
                </Link>
                <Link href="/agents/multimodal" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Multimodal AI Agents
                </Link>
                <Link href="/agents/industry" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Specialized Industry Agents
                </Link>
                <Link href="/agents/voice" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Voice-Enabled AI Agent
                </Link>
                <Link href="/agents/utility" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Utility-Based Agents
                </Link>
                <Link href="/agents/autonomous" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  Autonomous agents
                </Link>
                <Link href="/agents/descience" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">
                  DeScience Agent
                </Link>
              </div>
            </div>
            <Link href="/customers" className="px-3 py-2 text-gray-700 hover:text-gray-900">
              Customers
            </Link>
            <Link href="/about" className="px-3 py-2 text-gray-700 hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/signin"
            className="hidden sm:inline-block px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-full"
          >
            Sign in
          </Link>
          <Link href="/playground">
            <Button className="bg-[#4339F2] hover:bg-[#3730d8] text-white rounded-full">Playground</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#e8f5b8] via-[#f0f8c8] to-[#f8fce0] py-16 md:py-24 relative overflow-hidden">
        <FloatingIcons />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Decentralized AI agents orchestrating secure, intelligent workflows
            </h1>
            <div className="mb-16 flex gap-4 justify-center">
              <Link href="/playground">
                <Button className="bg-[#4339F2] hover:bg-[#3730d8] text-white rounded-full px-8 py-6 text-lg">
                  Playground
                </Button>
              </Link>
              <Link href="/orchestration">
                <Button variant="outline" className="rounded-full px-8 py-6 text-lg">
                  Build Workflows
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-[#f8fce0] to-[#fcfef0] py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Plug AI into your operational stack where work actually runs.
              </h3>
              <p className="text-gray-700">
                From messaging apps to ticketing systems, let agents respond, act, and ship inside your live workflows.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Integrate autonomous agents into your developer workflows.
              </h3>
              <p className="text-gray-700">
                Bridge AI with your existing tools CI/CD, issue trackers, team chat to automate code reviews, alerts,
                and support flows.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Deploy AI as microservices inside your team's workflow tools.
              </h3>
              <p className="text-gray-700">
                Use agents as functional endpoints embedded across Slack, ServiceNow, or custom dashboards—without
                breaking the stack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-[#fdf6e9] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">How agent orchestration works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#4339F2] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Agents</h3>
              <p className="text-gray-600 text-sm">
                Build specialized AI agents with custom tools and knowledge bases for specific tasks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#4339F2] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">🔗</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect Workflows</h3>
              <p className="text-gray-600 text-sm">
                Link agents together in powerful workflows that automate complex business processes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-[#4339F2] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Deploy & Scale</h3>
              <p className="text-gray-600 text-sm">
                Deploy your agent workflows and scale them across your organization with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#4339F2] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to build your first agent workflow?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using InoxxAI to automate their workflows with AI agents.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/playground">
              <Button className="bg-white text-[#4339F2] hover:bg-gray-100 rounded-full px-8 py-6 text-lg">
                Start Building
              </Button>
            </Link>
            <Link href="/orchestration">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#4339F2] rounded-full px-8 py-6 text-lg"
              >
                View Examples
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">&copy; 2024 InoxxAI. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setIsTermsOpen(true)}
                className="text-gray-600 hover:text-gray-900 text-sm underline"
              >
                Terms of Use
              </button>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms Modal */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </main>
  )
}
