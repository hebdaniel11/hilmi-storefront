"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Canvas, IText, Image as FabricImage } from 'fabric'
import ColorSelector from "../components/color-selector"
import CollapsibleSection from "../components/collapsible-section"
import ArtworkUploader from "../components/artwork-uploader"
import TextTools from "../components/text-tools"
import DesignerFooter from "../components/designer-footer"
import DesignCanvas from "../components/design-canvas"
import FloatingTextToolbar from "../components/floating-text-toolbar"
import { CustomizationArea } from "../../../shared/types"
import { DEFAULT_CUSTOMIZATION_AREAS, PRODUCT_CUSTOMIZATION } from "../../../shared/constants"
import { DecorationTechnique } from "../components/decoration-techniques"
import { FabricObject } from "fabric"

type ProductDesignerTemplateProps = {
  product: HttpTypes.StoreProduct
}

const ProductDesignerTemplate: React.FC<ProductDesignerTemplateProps> = ({ product }) => {
  const [view, setView] = useState("front")
  const canvasRef = useRef<Canvas | null>(null)
  const [customizationCount, setCustomizationCount] = useState(0)
  const [usedDecorationTechniques, setUsedDecorationTechniques] = useState<DecorationTechnique[]>([])
  const [selectedTextObject, setSelectedTextObject] = useState<IText | null>(null)
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null)

  // This is a stable factory function for creating our constraint logic.
  // It takes a Fabric object and the area it should be constrained to.
  const createConstrainHandler = useCallback((obj: FabricObject, area: CustomizationArea) => {
    return () => {
      const canvas = canvasRef.current;
      if (!obj || !canvas) return;

      obj.setCoords();

      const bounds = obj.getBoundingRect();
      const areaRight = area.x + area.width;
      const areaBottom = area.y + area.height;
      
      let needsSet = false;

      // Prevent scaling object bigger than area
      if (bounds.width > area.width) {
          obj.scaleX = area.width / (obj.width || 1);
          needsSet = true;
      }
      if (bounds.height > area.height) {
          obj.scaleY = area.height / (obj.height || 1);
          needsSet = true;
      }

      // After scaling down, must recalculate bounds
      if (needsSet) {
          obj.setCoords();
          const newBounds = obj.getBoundingRect();
          bounds.width = newBounds.width;
          bounds.height = newBounds.height;
      }

      let newLeft = obj.left ?? 0;
      let newTop = obj.top ?? 0;

      // Adjust position for centered origin
      const halfWidth = bounds.width / 2;
      const halfHeight = bounds.height / 2;
      
      if (newLeft - halfWidth < area.x) {
          newLeft = area.x + halfWidth;
      }
      if (newTop - halfHeight < area.y) {
          newTop = area.y + halfHeight;
      }
      if (newLeft + halfWidth > areaRight) {
          newLeft = areaRight - halfWidth;
      }
      if (newTop + halfHeight > areaBottom) {
          newTop = areaBottom - halfHeight;
      }

      if (newLeft !== obj.left || newTop !== obj.top || needsSet) {
          obj.set({
              left: newLeft,
              top: newTop
          });
          canvas.requestRenderAll();
      }
    };
  }, []); // canvasRef is stable, so no dependencies needed.

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

  // Define customization areas with product metadata override and default fallback
  const customizationAreas: CustomizationArea[] = useMemo(() => {
    const areasFromMeta = (product as any)?.metadata?.customization_areas as CustomizationArea[] | undefined

    const isValidAreaArray = (arr: any): arr is CustomizationArea[] => {
      return Array.isArray(arr) && arr.every((a) =>
        a && typeof a.id === 'string' && typeof a.name === 'string' &&
        typeof a.x === 'number' && typeof a.y === 'number' &&
        typeof a.width === 'number' && typeof a.height === 'number' &&
        (a.type === 'text' || a.type === 'image' || a.type === 'both')
      )
    }

    if (isValidAreaArray(areasFromMeta)) {
      return areasFromMeta
    }

    // Fallback by view
    switch (view) {
      case 'back':
        return DEFAULT_CUSTOMIZATION_AREAS.back as unknown as CustomizationArea[]
      case 'neck':
        return DEFAULT_CUSTOMIZATION_AREAS.neck as unknown as CustomizationArea[]
      case 'front':
      default:
        return DEFAULT_CUSTOMIZATION_AREAS.front as unknown as CustomizationArea[]
    }
  }, [product, view])

  // This effect runs when the view changes, updating constraints for all objects.
  useEffect(() => {
    const canvas = canvasRef.current;
    const currentArea = customizationAreas[0];
    if (!canvas || !currentArea) return;

    canvas.getObjects().forEach(obj => {
      // Apply to user-added text and images
      if (obj.type === 'i-text' || obj.type === 'image') {
        // Remove old listeners before adding new ones
        obj.off('moving');
        obj.off('scaling');

        const constrainFn = createConstrainHandler(obj, currentArea);
        obj.on('moving', constrainFn);
        obj.on('scaling', constrainFn);
      }
    });
  }, [view, customizationAreas, createConstrainHandler]);

  const handleTestImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const currentArea = customizationAreas[0]
    if (!currentArea) return
    
    console.log('Testing simple image creation...')
    
    // Test with a simple colored rectangle first
    import('fabric').then((fabricModule) => {
      const Rect = fabricModule.Rect
      const testRect = new Rect({
        left: currentArea.x + 50,
        top: currentArea.y + 50,
        width: 100,
        height: 100,
        fill: 'red',
        selectable: true,
        hasControls: true,
        evented: true,
      })
      
      canvas.add(testRect)
      canvas.requestRenderAll()
      console.log('Test rectangle added')
    })
  }

  const handleAddText = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.log('No canvas available')
      return
    }

    // Select the first area for the current view
    const currentArea = customizationAreas[0]
    if (!currentArea) {
      console.log('No customization area available')
      return
    }

    // Create the text object centered inside the area
    const textObject = new IText("hello", {
      left: currentArea.x + currentArea.width / 2,
      top: currentArea.y + currentArea.height / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: PRODUCT_CUSTOMIZATION.DEFAULT_FONTS[0],
      fill: PRODUCT_CUSTOMIZATION.DEFAULT_COLORS[1], // White text
      fontSize: 24,
      selectable: true,
      hasControls: true,
      moveable: true,
      evented: true,
    })

    // Add constraining behavior on creation
    const currentTxtArea = customizationAreas[0]
    if (currentTxtArea) {
      const constrainFn = createConstrainHandler(textObject, currentTxtArea);
      textObject.on('moving', constrainFn);
      textObject.on('scaling', constrainFn);
    }

    console.log('Text object created:', textObject)
    console.log('Text object position:', { left: textObject.left, top: textObject.top })
    console.log('Text object selectable:', textObject.selectable)
    console.log('Text object evented:', textObject.evented)

    // Add constraining behavior
    // const constrainToArea = () => {
    //   const bounds = textObject.getBoundingRect()
    //   let nextLeft = textObject.left || 0
    //   let nextTop = textObject.top || 0
    //   let needsUpdate = false

    //   if (bounds.left < area.x) {
    //     nextLeft += area.x - bounds.left
    //     needsUpdate = true
    //   }
    //   if (bounds.top < area.y) {
    //     nextTop += area.y - bounds.top
    //     needsUpdate = true
    //   }
    //   if (bounds.left + bounds.width > area.x + area.width) {
    //     nextLeft -= (bounds.left + bounds.width) - (area.x + area.width)
    //     needsUpdate = true
    //   }
    //   if (bounds.top + bounds.height > area.y + area.height) {
    //     nextTop -= (bounds.top + bounds.height) - (area.y + area.height)
    //     needsUpdate = true
    //   }
      
    //   if (needsUpdate) {
    //     textObject.set({ left: nextLeft, top: nextTop })
    //     textObject.setCoords()
    //     canvas.requestRenderAll()
    //   }
    // }

    // textObject.on('moving', constrainToArea)
    // textObject.on('scaling', constrainToArea)

    canvas.add(textObject)
    canvas.setActiveObject(textObject)
    canvas.requestRenderAll()

    // Show floating toolbar - position it in a visible location
    setSelectedTextObject(textObject)
    setToolbarPosition({
      x: 50, // Fixed position from left edge
      y: 20  // Fixed position from top
    })

    setCustomizationCount((prev) => prev + 1)
  }

  const handleAddArtwork = (artwork: {
    imageUrl: string
    technique: DecorationTechnique
  }) => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.log('No canvas available')
      return
    }

    const currentImgArea = customizationAreas[0]
    if (!currentImgArea) {
      console.log('No customization area available')
      return
    }

    console.log('Adding artwork to canvas:', artwork)
    console.log('Canvas available:', !!canvas)
    console.log('Customization area:', currentImgArea)

    // Create image from uploaded data URL
    FabricImage.fromURL(artwork.imageUrl).then((img) => {
        console.log('Image loaded:', img)
        if (!img) {
          console.error('Failed to load image')
          return
        }

        // Calculate size to fit within area while maintaining aspect ratio
        const maxWidth = currentImgArea.width * 0.8  // 80% of area width
        const maxHeight = currentImgArea.height * 0.8 // 80% of area height
        
        const imgWidth = img.width || 100
        const imgHeight = img.height || 100
        const aspectRatio = imgWidth / imgHeight

        let newWidth = maxWidth
        let newHeight = maxWidth / aspectRatio

        if (newHeight > maxHeight) {
          newHeight = maxHeight
          newWidth = maxHeight * aspectRatio
        }

        // Position image in center of area
        img.set({
          left: currentImgArea.x + currentImgArea.width / 2,
          top: currentImgArea.y + currentImgArea.height / 2,
          originX: 'center',
          originY: 'center',
          scaleX: newWidth / imgWidth,
          scaleY: newHeight / imgHeight,
          selectable: true,
          hasControls: true,
          moveable: true, // Explicitly enable movement
          evented: true,
        })

        // Add constraining behavior on creation
        if (currentImgArea) {
          const constrainFn = createConstrainHandler(img, currentImgArea);
          img.on('moving', constrainFn);
          img.on('scaling', constrainFn);
        }

        console.log('Canvas objects before adding image:', canvas.getObjects().length)
        console.log('Existing objects:', canvas.getObjects().map(obj => obj.type))
        
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.requestRenderAll()

        console.log('Artwork added to canvas successfully')
        console.log('Canvas objects after adding image:', canvas.getObjects().length)
        console.log('All objects:', canvas.getObjects().map(obj => obj.type))
        
        // Update counters after successful addition
        setCustomizationCount(prev => prev + 1)
        setUsedDecorationTechniques(prev => {
          const exists = prev.find(t => t.id === artwork.technique.id)
          return exists ? prev : [...prev, artwork.technique]
        })
      }).catch((err) => {
        console.error('Error loading artwork:', err)
        console.error('Error details:', err)
        alert('Failed to load artwork. Please try a different image.')
      })
  }

  // const constrainToArea = (object: any, area: any) => {
  //   // Temporarily disabled
  // }

  const handleCanvasReady = useCallback((canvas: Canvas) => {
    console.log('Canvas ready:', canvas)
    canvasRef.current = canvas
    
    // Add debugging for mouse events
    canvas.on('mouse:down', (e) => {
      console.log('Canvas mouse down on:', e.target?.type || 'canvas background')
    })

    canvas.on('object:moving', (e) => {
      console.log('Object moving:', e.target?.type)
    })

    // Add canvas event listeners
    canvas.on('selection:created', (e) => {
      console.log('Selection created:', e)
      const activeObject = canvas.getActiveObject()
      if (activeObject && activeObject.type === 'i-text') {
        setSelectedTextObject(activeObject as IText)
        setToolbarPosition({
          x: 50, // Fixed position 
          y: 20  // Fixed position
        })
      }
    })

    canvas.on('selection:updated', (e) => {
      console.log('Selection updated:', e)
      const activeObject = canvas.getActiveObject()
      if (activeObject && activeObject.type === 'i-text') {
        setSelectedTextObject(activeObject as IText)
        setToolbarPosition({
          x: 50, // Fixed position
          y: 20  // Fixed position
        })
      }
    })

    canvas.on('selection:cleared', () => {
      console.log('Selection cleared')
      setSelectedTextObject(null)
      setToolbarPosition(null)
    })
  }, [])

  const handleTextUpdate = useCallback((updates: { text?: string; fontFamily?: string; fill?: string; fontSize?: number }) => {
    if (!selectedTextObject) return
    
    selectedTextObject.set(updates)
    canvasRef.current?.requestRenderAll()
  }, [selectedTextObject])

  const handleCloseToolbar = useCallback(() => {
    setSelectedTextObject(null)
    setToolbarPosition(null)
    canvasRef.current?.discardActiveObject()
    canvasRef.current?.requestRenderAll()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        const canvas = canvasRef.current
        if (!canvas) return

        const activeObject = canvas.getActiveObject()
        if (activeObject) {
          canvas.remove(activeObject)
          // If the deleted object was a text object with a toolbar, hide the toolbar
          if (activeObject.type === 'i-text' && selectedTextObject && activeObject === selectedTextObject) {
            handleCloseToolbar()
          }
          canvas.requestRenderAll()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedTextObject, handleCloseToolbar])



  const frontImage = useMemo(() => {
    if (!selectedVariant) return product.images?.[0]?.url
    
    // Try to find color-specific images first
    const colorName = selectedVariant.options?.find(opt => opt.option?.title?.toLowerCase() === 'color')?.value?.toLowerCase()
    
    if (colorName) {
      const colorSpecificImg = product.images?.find(i => 
        i.url.includes("front") && i.url.toLowerCase().includes(colorName)
      )
      if (colorSpecificImg) return colorSpecificImg.url
    }
    
    // Fallback to any front image
    const img = product.images?.find(i => i.url.includes("front"))
    return img?.url || product.images?.[0]?.url
  }, [product.images, selectedVariant])

  const backImage = useMemo(() => {
    if (!selectedVariant) return product.images?.[1]?.url || frontImage
    
    // Try to find color-specific images first
    const colorName = selectedVariant.options?.find(opt => opt.option?.title?.toLowerCase() === 'color')?.value?.toLowerCase()
    
    if (colorName) {
      const colorSpecificImg = product.images?.find(i => 
        i.url.includes("back") && i.url.toLowerCase().includes(colorName)
      )
      if (colorSpecificImg) return colorSpecificImg.url
    }
    
    // Fallback to any back image
    const img = product.images?.find(i => i.url.includes("back"))
    return img?.url || product.images?.[1]?.url || frontImage
  }, [product.images, selectedVariant, frontImage])

  const neckImage = useMemo(() => {
    if (!selectedVariant) return product.images?.[2]?.url || frontImage
    
    // Try to find color-specific images first
    const colorName = selectedVariant.options?.find(opt => opt.option?.title?.toLowerCase() === 'color')?.value?.toLowerCase()
    
    if (colorName) {
      const colorSpecificImg = product.images?.find(i => 
        i.url.includes("neck") && i.url.toLowerCase().includes(colorName)
      )
      if (colorSpecificImg) return colorSpecificImg.url
    }
    
    // Fallback to any neck image
    const img = product.images?.find(i => i.url.includes("neck"))
    return img?.url || product.images?.[2]?.url || frontImage
  }, [product.images, selectedVariant, frontImage])

  const getCurrentImage = () => {
    const image = (() => {
      switch (view) {
        case "back":
          return backImage
        case "neck":
          return neckImage
        default:
          return frontImage
      }
    })()
    
    console.log('Current image URL:', image)
    console.log('Product images:', product.images)
    console.log('Selected variant:', selectedVariant)
    
    return image
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
        <div className="flex-1 flex items-center justify-center relative">
          {getCurrentImage() && (
            <div className="relative" style={{ width: '400px', height: '500px' }}>
              <Image
                src={getCurrentImage()!}
                alt={`${product.title} ${view} view`}
                width={400}
                height={500}
                style={{ width: '400px', height: '500px', objectFit: 'contain' }}
              />
              <div className="absolute inset-0 z-10 pointer-events-auto">
                <DesignCanvas
                  width={400}
                  height={500}
                  customizationAreas={customizationAreas}
                  onCanvasReady={handleCanvasReady}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Floating Text Toolbar */}
        {selectedTextObject && toolbarPosition && (
          <FloatingTextToolbar
            textObject={selectedTextObject}
            position={toolbarPosition}
            onClose={handleCloseToolbar}
            onUpdate={handleTextUpdate}
          />
        )}
        
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
            <ArtworkUploader onArtworkUpload={handleAddArtwork} />
          </CollapsibleSection>
          <CollapsibleSection title="Text">
            <TextTools onAddText={handleAddText} />
            <button 
              onClick={handleTestImage}
              className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium"
            >
              Test Rectangle
            </button>
          </CollapsibleSection>
        </div>
        <div className="mt-4">
          <DesignerFooter 
            selectedVariant={selectedVariant}
            decorationTechniques={usedDecorationTechniques}
            customizationCount={customizationCount}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductDesignerTemplate
