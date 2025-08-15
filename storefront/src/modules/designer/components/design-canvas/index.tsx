"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, Rect, Text, Image as FabricImage, FabricObject } from 'fabric'
import { CustomizationArea } from "../../../shared/types"

interface DesignCanvasProps {
  width?: number
  height?: number
  backgroundImage?: string
  customizationAreas?: CustomizationArea[]
  onCanvasReady?: (canvas: Canvas) => void
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({
  width = 400,
  height = 500,
  backgroundImage,
  customizationAreas = [],
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasInstanceRef = useRef<Canvas | null>(null)
  const [isCanvasReady, setIsCanvasReady] = useState(false)

  // Initialize canvas once
  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize Fabric.js canvas
    const fabricCanvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      selection: true,
      interactive: true,
    })

    // Ensure canvas is interactive
    console.log('Canvas selection enabled:', fabricCanvas.selection)
    console.log('Canvas dimensions:', { width: fabricCanvas.width, height: fabricCanvas.height })

    canvasInstanceRef.current = fabricCanvas

    setIsCanvasReady(true)
    if (onCanvasReady) {
      onCanvasReady(fabricCanvas)
    }

    // Cleanup function
    return () => {
      fabricCanvas.dispose()
      canvasInstanceRef.current = null
    }
  }, [width, height, onCanvasReady])

  // Update background image separately
  useEffect(() => {
    const fabricCanvas = canvasInstanceRef.current
    if (!fabricCanvas) return

    if (backgroundImage) {
      FabricImage.fromURL(backgroundImage).then((img) => {
        if (img && fabricCanvas) {
          img.set({
            left: 0,
            top: 0,
            selectable: false,
            evented: false,
            scaleX: width / (img.width || 1),
            scaleY: height / (img.height || 1),
          })
          fabricCanvas.backgroundImage = img
          fabricCanvas.renderAll()
        }
      }).catch((err) => {
        console.error('Failed to load background image:', err)
      })
    } else {
      fabricCanvas.backgroundImage = null
      fabricCanvas.renderAll()
    }
  }, [backgroundImage, width, height])

  // Update customization areas separately
  useEffect(() => {
    const fabricCanvas = canvasInstanceRef.current
    if (!fabricCanvas) return

    console.log('Updating customization areas, current objects:', fabricCanvas.getObjects().map(obj => ({ type: obj.type, selectable: obj.selectable })))

    // Remove existing area overlays (but keep user-added objects)
    const objectsToRemove = fabricCanvas.getObjects().filter(obj => 
      obj.data?.isOverlay === true
    )
    console.log('Removing old overlays:', objectsToRemove.length)
    objectsToRemove.forEach(obj => fabricCanvas.remove(obj))

    // Add new customization areas as overlays
    customizationAreas.forEach((area) => {
      const overlay = new Rect({
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
        fill: 'transparent',
        stroke: 'rgba(221, 221, 221, 0.6)',
        strokeDashArray: [5, 5],
        strokeWidth: 2,
        selectable: false,
        evented: false,
        data: { isOverlay: true }, // Custom property to identify overlays
      })

      fabricCanvas.add(overlay)
    })

    fabricCanvas.renderAll()
    console.log('Customization areas updated, final objects count:', fabricCanvas.getObjects().length)
  }, [customizationAreas])

  // const getCanvas = () => canvasInstanceRef.current

  return (
    <div className="relative" style={{ width, height }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ 
          backgroundColor: 'transparent',
          width: '100%',
          height: '100%'
        }}
      />
      {!isCanvasReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-500">Loading canvas...</div>
        </div>
      )}
    </div>
  )
}

export default DesignCanvas