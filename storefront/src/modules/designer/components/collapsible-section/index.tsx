"use client"

import { useState, ReactNode } from "react"
import { Plus } from "@medusajs/icons"

type CollapsibleSectionProps = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white border border-gray-200 rounded-3xl mb-1 shadow-sm">
      <div
        className="flex justify-between items-center p-5 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-2xl font-semibold">{title}</h3>
        <div className="flex items-center gap-x-2">
          <Plus className={`transition-transform duration-200 ${isOpen ? "transform rotate-45" : ""}`} />
        </div>
      </div>
      {isOpen && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  )
}

export default CollapsibleSection
