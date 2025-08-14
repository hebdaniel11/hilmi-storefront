"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import ColorSelector from "../components/color-selector"
import CollapsibleSection from "../components/collapsible-section"
import ArtworkUploader from "../components/artwork-uploader"
import TextTools from "../components/text-tools"
import DesignerFooter from "../components/designer-footer"

type ProductDesignerTemplateProps = {
  product: HttpTypes.StoreProduct
}

const ProductDesignerTemplate: React.FC<ProductDesignerTemplateProps> = ({ product }) => {
  const [view, setView] = useState("front")

  const uniqueColors = useMemo(() => {
    const colors = new Map<string, HttpTypes.StoreProductVariant>()
    product.variants?.forEach((variant) => {
      const colorOption = variant.options?.find(
        (opt) => opt.option?.title?.toLowerCase() === "color"
      )
      if (colorOption?.value && (colorOption.value.toLowerCase() === 'white' || colorOption.value.toLowerCase() === 'black')) {
        const colorName = colorOption.value
        const existingEntry = colors.get(colorName)
        if (!existingEntry || (!existingEntry.metadata?.hex_color && variant.metadata?.hex_color)) {
          colors.set(colorName, variant)
        }
      }
    })
    return Array.from(colors.values())
  }, [product.variants])

  const [selectedVariant, setSelectedVariant] = useState<HttpTypes.StoreProductVariant | undefined>(uniqueColors[0])

  useEffect(() => {
    if (!selectedVariant && uniqueColors.length > 0) {
      setSelectedVariant(uniqueColors[0])
    }
  }, [selectedVariant, uniqueColors])

  const frontImage = useMemo(() => {
    const img = product.images?.find(i => i.url.includes("front"))
    return img?.url || product.images?.[0]?.url
  }, [product.images])

  const backImage = useMemo(() => {
    const img = product.images?.find(i => i.url.includes("back"))
    return img?.url || product.images?.[1]?.url || frontImage
  }, [product.images, frontImage])

  const neckImage = useMemo(() => {
    const img = product.images?.find(i => i.url.includes("neck"))
    return img?.url || product.images?.[2]?.url || frontImage
  }, [product.images, frontImage])

  const getCurrentImage = () => {
    switch (view) {
      case "back":
        return backImage
      case "neck":
        return neckImage
      default:
        return frontImage
    }
  }

  if (!selectedVariant) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <h1 className="text-2xl font-helvetica-neue-bold">Hilmi</h1>
      </div>
      {/* Product Preview */}
      <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-md">
          <h2 className="text-md font-semibold">{product.title}</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {getCurrentImage() && (
            <Image
              src={getCurrentImage()!}
              alt={`${product.title} ${view} view`}
              width={810}
              height={1080}
              className="object-contain"
            />
          )}
        </div>
        <div className="flex items-center justify-center bg-gray-200 rounded-md p-1 mb-4">
          <button onClick={() => setView("front")} className={`px-4 py-2 text-sm rounded-md ${view === "front" ? "bg-white" : "bg-gray-200 text-gray-500"}`}>Front</button>
          <button onClick={() => setView("back")} className={`px-4 py-2 text-sm rounded-md ${view === "back" ? "bg-white" : "bg-gray-200 text-gray-500"}`}>Back</button>
          <button onClick={() => setView("neck")} className={`px-4 py-2 text-sm rounded-md ${view === "neck" ? "bg-white" : "bg-gray-200 text-gray-500"}`}>Neck</button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-[28.33%] bg-gray-100 flex flex-col p-8">
        <div className="overflow-y-auto flex-1">
          <CollapsibleSection title="Garment Color" defaultOpen={true}>
            <ColorSelector
              variants={uniqueColors}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
            />
          </CollapsibleSection>
          <CollapsibleSection title="Artwork">
            <ArtworkUploader />
          </CollapsibleSection>
          <CollapsibleSection title="Text">
            <TextTools />
          </CollapsibleSection>
        </div>
        <div className="mt-4">
          <DesignerFooter />
        </div>
      </div>
    </div>
  )
}

export default ProductDesignerTemplate
