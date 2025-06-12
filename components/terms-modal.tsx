"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[70vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-base font-bold text-gray-900">Terms of Use</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(70vh-100px)]">
          <div className="prose max-w-none">
            <h3 className="text-xs font-medium mb-3">1. Acceptance of Terms</h3>
            <p className="mb-3 text-xs text-gray-600 leading-tight">
              By accessing and using InoxxAI's services, you accept and agree to be bound by the terms and provision of
              this agreement.
            </p>

            <h3 className="text-xs font-medium mb-3">2. Use License</h3>
            <p className="mb-3 text-xs text-gray-600 leading-tight">
              Permission is granted to temporarily download one copy of InoxxAI materials for personal, non-commercial
              transitory viewing only.
            </p>

            <h3 className="text-xs font-medium mb-3">3. Disclaimer</h3>
            <p className="mb-3 text-xs text-gray-600 leading-tight">
              The materials on InoxxAI's website are provided on an 'as is' basis. InoxxAI makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>

            <h3 className="text-xs font-medium mb-3">4. Limitations</h3>
            <p className="mb-3 text-xs text-gray-600 leading-tight">
              In no event shall InoxxAI or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on InoxxAI's website.
            </p>

            <h3 className="text-xs font-medium mb-3">5. AI Agent Usage</h3>
            <p className="mb-3 text-xs text-gray-600 leading-tight">
              Users are responsible for the ethical use of AI agents and workflows created through our platform. Any
              misuse of AI capabilities is strictly prohibited.
            </p>

            <h3 className="text-xs font-medium mb-3">6. Data Privacy</h3>
            <p className="mb-3 text-xs text-gray-600 leading-tight">
              We are committed to protecting your privacy. All data processed through our AI agents is handled in
              accordance with our Privacy Policy and applicable data protection laws.
            </p>

            <h3 className="text-xs font-medium mb-3">7. Service Availability</h3>
            <p className="mb-3 text-xs text-gray-600 leading-tight">
              While we strive to maintain 99.9% uptime, InoxxAI does not guarantee uninterrupted service availability.
              Scheduled maintenance will be communicated in advance.
            </p>

            <h3 className="text-xs font-medium mb-3">8. Modifications</h3>
            <p className="mb-3 text-xs text-gray-600 leading-tight">
              InoxxAI may revise these terms of service at any time without notice. By using this website, you are
              agreeing to be bound by the then current version of these terms of service.
            </p>

            <h3 className="text-xs font-medium mb-3">9. Governing Law</h3>
            <p className="mb-3 text-xs text-gray-600 leading-tight">
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction
              in which InoxxAI operates.
            </p>

            <h3 className="text-xs font-medium mb-3">10. Contact Information</h3>
            <p className="mb-3 text-xs text-gray-600 leading-tight">
              If you have any questions about these Terms of Use, please contact us at legal@inoxxai.com
            </p>

            <p className="text-xs text-gray-500 mt-6">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
