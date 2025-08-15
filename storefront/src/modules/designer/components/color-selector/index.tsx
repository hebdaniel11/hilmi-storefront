"use client"

import { HttpTypes } from "@medusajs/types"

type ColorSelectorProps = {
  variants: HttpTypes.StoreProductVariant[]
  selectedVariant: HttpTypes.StoreProductVariant
  setSelectedVariant: (variant: HttpTypes.StoreProductVariant) => void
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ variants, selectedVariant, setSelectedVariant }) => {
  const selectedColorName = selectedVariant.options?.find(opt => opt.option?.title?.toLowerCase() === 'color')?.value

  return (
    <div className="mt-2">
      <div className="flex items-center gap-x-2">
        <h3 className="text-md font-medium">Color:</h3>
        <span className="text-md text-gray-700">{selectedColorName}</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {variants.map((variant) => {
          const colorName = variant.options?.find(opt => opt.option?.title?.toLowerCase() === 'color')?.value
          return (
            <div
              key={variant.id}
              className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                selectedVariant.id === variant.id ? "border-black" : "border-gray-200"
              }`}
              style={{ backgroundColor: (variant.metadata?.hex_color as string) || "gray" }}
              onClick={() => setSelectedVariant(variant)}
              title={colorName}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ColorSelector
