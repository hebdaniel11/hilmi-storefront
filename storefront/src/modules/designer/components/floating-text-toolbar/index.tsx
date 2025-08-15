"use client"

import { useState, useEffect } from "react"
import { IText } from 'fabric'
import { PRODUCT_CUSTOMIZATION } from "../../../../shared/constants"

interface FloatingTextToolbarProps {
  textObject: IText
  position: { x: number; y: number }
  onClose: () => void
  onUpdate: (updates: { text?: string; fontFamily?: string; fill?: string; fontSize?: number }) => void
}

const FloatingTextToolbar: React.FC<FloatingTextToolbarProps> = ({
  textObject,
  position,
  onClose,
  onUpdate
}) => {
  const [text, setText] = useState(textObject.text || "")
  const [selectedFont, setSelectedFont] = useState(textObject.fontFamily || PRODUCT_CUSTOMIZATION.DEFAULT_FONTS[0])
  const [selectedColor, setSelectedColor] = useState(textObject.fill as string || PRODUCT_CUSTOMIZATION.DEFAULT_COLORS[0])
  const [fontSize, setFontSize] = useState(textObject.fontSize || 24)

  useEffect(() => {
    setText(textObject.text || "")
    setSelectedFont(textObject.fontFamily || PRODUCT_CUSTOMIZATION.DEFAULT_FONTS[0])
    setSelectedColor(textObject.fill as string || PRODUCT_CUSTOMIZATION.DEFAULT_COLORS[0])
    setFontSize(textObject.fontSize || 24)
  }, [textObject])

  const handleTextChange = (newText: string) => {
    setText(newText)
    onUpdate({ text: newText })
  }

  const handleFontChange = (newFont: string) => {
    setSelectedFont(newFont)
    onUpdate({ fontFamily: newFont })
  }

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor)
    onUpdate({ fill: newColor })
  }

  const handleSizeChange = (newSize: number) => {
    setFontSize(newSize)
    onUpdate({ fontSize: newSize })
  }

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 72)
    handleSizeChange(newSize)
  }

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12)
    handleSizeChange(newSize)
  }

  return (
    <div 
      className="absolute bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      style={{ 
        left: position.x, 
        top: position.y,
        minWidth: '520px'
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Top Row - Font, Size, and Text Alignment */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-100">
        {/* Font Selector */}
        <select
          value={selectedFont}
          onChange={(e) => handleFontChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white min-w-[120px]"
        >
          {PRODUCT_CUSTOMIZATION.DEFAULT_FONTS.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>

        {/* Font Size Display */}
        <div className="flex items-center bg-gray-50 rounded-md px-3 py-2 min-w-[60px] justify-center">
          <span className="text-sm font-medium">{fontSize}</span>
        </div>

        {/* Size Controls */}
        <button
          onClick={increaseFontSize}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-bold transition-colors"
          title="Increase font size"
        >
          A+
        </button>
        <button
          onClick={decreaseFontSize}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-bold transition-colors"
          title="Decrease font size"
        >
          A-
        </button>

        {/* Text Alignment Buttons */}
        <div className="flex">
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-l-md border-r border-gray-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h18v2H3V3zm0 8h12v2H3v-2zm0 8h18v2H3v-2zm0-4h12v2H3v-2z"/>
            </svg>
          </button>
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border-r border-gray-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h18v2H3V3zm6 8h6v2H9v-2zm-6 8h18v2H3v-2zm6-4h6v2H9v-2z"/>
            </svg>
          </button>
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h18v2H3V3zm6 8h12v2H9v-2zm-6 8h18v2H3v-2zm6-4h12v2H9v-2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Row - Text Input and Additional Tools */}
      <div className="flex items-center gap-2 p-3">
        {/* Text Styling Buttons */}
        <div className="flex">
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-l-md border-r border-gray-300 font-bold">
            B
          </button>
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border-r border-gray-300 italic">
            I
          </button>
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border-r border-gray-300 underline">
            U
          </button>
          <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h3V6a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1zM9 7h6V6a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1z"/>
            </svg>
          </button>
        </div>

        {/* Dimension Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-50 rounded-md px-3 py-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
              <path d="M21 6H3V4h18v2zm0 4H3V8h18v2zm-6 4H3v-2h12v2zm6 4H3v-2h18v2z"/>
            </svg>
            <span className="text-sm">131</span>
            <span className="text-xs text-gray-500 ml-1">mm</span>
          </div>
          <div className="flex items-center bg-gray-50 rounded-md px-3 py-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-sm">0</span>
            <span className="text-xs text-gray-500 ml-1">mm</span>
          </div>
        </div>

        {/* More Options */}
        <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>

      {/* Color Palette Row */}
      <div className="flex items-center gap-2 p-3 pt-0">
        <div className="flex gap-2">
          {PRODUCT_CUSTOMIZATION.DEFAULT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded border-2 transition-all ${
                selectedColor === color ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          {/* Add Color Button */}
          <button className="w-8 h-8 rounded border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default FloatingTextToolbar