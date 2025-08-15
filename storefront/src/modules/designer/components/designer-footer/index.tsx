import { useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import QuantityInput from "../quantity-input"
import { DecorationTechnique } from "../decoration-techniques"

interface DesignerFooterProps {
  selectedVariant?: HttpTypes.StoreProductVariant
  decorationTechniques?: DecorationTechnique[]
  customizationCount?: number
}

const DesignerFooter: React.FC<DesignerFooterProps> = ({ 
  selectedVariant,
  decorationTechniques = [],
  customizationCount = 0
}) => {
  const basePrice = useMemo(() => {
    if (!selectedVariant?.prices?.[0]) return 0
    // Convert from cents to dollars (Medusa stores prices in cents)
    return selectedVariant.prices[0].amount / 100
  }, [selectedVariant])

  const decorationCost = useMemo(() => {
    if (decorationTechniques.length === 0) return 0
    
    // Calculate additional cost based on decoration techniques
    const avgModifier = decorationTechniques.reduce((sum, tech) => sum + tech.price_modifier, 0) / decorationTechniques.length
    return basePrice * avgModifier
  }, [basePrice, decorationTechniques])

  const customizationCost = useMemo(() => {
    // Additional cost per customization (text/image)
    const costPerCustomization = 2.50
    return customizationCount * costPerCustomization
  }, [customizationCount])

  const totalUnitCost = useMemo(() => {
    return basePrice + decorationCost + customizationCost
  }, [basePrice, decorationCost, customizationCost])

  const estimatedDelivery = useMemo(() => {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 7) // 7 days from now
    return deliveryDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }, [])

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex justify-between items-end mb-4">
        <div className="text-center">
          <p className="text-base text-gray-500 font-semibold mb-1">Quantity</p>
          <QuantityInput />
        </div>
        <div className="text-left mb-1">
          <p className="text-base text-gray-500 font-semibold mb-1">Unit cost</p>
          <p className="text-base font-semibold">
            ${totalUnitCost.toFixed(2)}
          </p>
          {(decorationCost > 0 || customizationCost > 0) && (
            <p className="text-xs text-gray-500">
              Base: ${basePrice.toFixed(2)}
              {decorationCost > 0 && ` + Decoration: $${decorationCost.toFixed(2)}`}
              {customizationCost > 0 && ` + Custom: $${customizationCost.toFixed(2)}`}
            </p>
          )}
        </div>
        <div className="text-left mb-1">
          <p className="text-base text-gray-500 font-semibold mb-1">Delivery</p>
          <p className="text-base font-semibold">{estimatedDelivery}</p>
        </div>
      </div>
      <button className="w-full bg-black text-white py-3 rounded-2xl">
        Confirm Changes & Review
      </button>
    </div>
  )
}

export default DesignerFooter
