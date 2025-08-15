"use client"

import { useState } from "react"
import { PRODUCT_CUSTOMIZATION } from "../../../../shared/constants"

interface TextToolsProps {
  onAddText?: () => void
}

const TextTools: React.FC<TextToolsProps> = ({ onAddText }) => {
  const handleAddText = () => {
    if (onAddText) {
      onAddText()
    }
  }



  return (
    <div>
      <button
        onClick={handleAddText}
        className="w-full px-4 py-2 bg-black text-white rounded-md text-sm font-medium"
      >
        Add Text
      </button>
    </div>
  )
}

export default TextTools
