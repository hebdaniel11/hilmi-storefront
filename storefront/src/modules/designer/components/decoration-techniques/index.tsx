"use client"

import { useState } from "react"

export interface DecorationTechnique {
  id: string
  name: string
  description: string
  thumbnail: string
  price_modifier: number // Additional cost in percentage
}

const DECORATION_TECHNIQUES: DecorationTechnique[] = [
  {
    id: "dtg",
    name: "Digital Print (DTG)",
    description: "Direct-to-garment printing with vibrant colors and fine detail",
    thumbnail: "/static/techniques/dtg.jpg",
    price_modifier: 0 // Base price
  },
  {
    id: "dtf", 
    name: "Digital Transfer Print (DTF)",
    description: "Durable heat transfer with excellent color reproduction",
    thumbnail: "/static/techniques/dtf.jpg",
    price_modifier: 0.15 // 15% more
  },
  {
    id: "screen_print",
    name: "Screen Print (up to 10 colors)",
    description: "Classic screen printing for bold, long-lasting designs",
    thumbnail: "/static/techniques/screen-print.jpg",
    price_modifier: 0.25 // 25% more
  },
  {
    id: "puff_screen",
    name: "Puff Screen Print",
    description: "Raised screen print with dimensional texture",
    thumbnail: "/static/techniques/puff-screen.jpg",
    price_modifier: 0.35 // 35% more
  },
  {
    id: "embroidery",
    name: "Embroidery",
    description: "Premium embroidered finish for professional appearance",
    thumbnail: "/static/techniques/embroidery.jpg",
    price_modifier: 0.50 // 50% more
  }
]

interface DecorationTechniquesProps {
  selectedTechnique?: DecorationTechnique
  onTechniqueSelect: (technique: DecorationTechnique) => void
}

const DecorationTechniques: React.FC<DecorationTechniquesProps> = ({
  selectedTechnique,
  onTechniqueSelect
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 mb-3">
        Choose how you'd like your artwork applied to the garment:
      </p>
      
      {DECORATION_TECHNIQUES.map((technique) => (
        <div
          key={technique.id}
          className={`border rounded-lg p-3 cursor-pointer transition-all ${
            selectedTechnique?.id === technique.id
              ? "border-black bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onTechniqueSelect(technique)}
        >
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
              {/* Placeholder for technique thumbnail */}
              <div className="w-8 h-8 bg-gray-400 rounded"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  {technique.name}
                </h4>
                {technique.price_modifier > 0 && (
                  <span className="text-xs text-gray-500">
                    +{Math.round(technique.price_modifier * 100)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {technique.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DecorationTechniques
export { DECORATION_TECHNIQUES }