"use client"

import { useState } from "react"

const QuantityInput = () => {
  const [quantity, setQuantity] = useState(50)

  return (
    <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        className="w-12 bg-transparent text-left font focus:outline-none"
      />
      <div className="flex flex-col">
        <button onClick={() => setQuantity(q => q + 1)} className="h-4 flex items-center justify-center">
          {/* ChevronUp icon removed */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-4 flex items-center justify-center">
          {/* ChevronDown icon removed */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default QuantityInput
