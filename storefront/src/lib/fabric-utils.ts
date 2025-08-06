// Fabric.js utilities for product customization

import { fabric } from 'fabric'
import type { 
  CustomizationArea, 
  TextCustomization, 
  ImageCustomization,
  CustomizationData 
} from '../../../shared/types'
import { CANVAS_CONFIG, PRODUCT_CUSTOMIZATION } from '../../../shared/constants'

export class ProductDesigner {
  private canvas: fabric.Canvas
  private customizationAreas: CustomizationArea[]
  
  constructor(canvasElement: HTMLCanvasElement, areas: CustomizationArea[] = []) {
    this.canvas = new fabric.Canvas(canvasElement, {
      width: CANVAS_CONFIG.DEFAULT_WIDTH,
      height: CANVAS_CONFIG.DEFAULT_HEIGHT,
      backgroundColor: CANVAS_CONFIG.BACKGROUND_COLOR,
    })
    
    this.customizationAreas = areas
    this.initializeAreas()
  }

  private initializeAreas() {
    // Add customization area overlays
    this.customizationAreas.forEach(area => {
      const overlay = new fabric.Rect({
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
        fill: 'transparent',
        stroke: '#ddd',
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        strokeWidth: 1,
      })
      
      this.canvas.add(overlay)
    })
  }

  addText(text: string, areaId: string, options: Partial<TextCustomization> = {}) {
    const area = this.customizationAreas.find(a => a.id === areaId)
    if (!area || (area.type !== 'text' && area.type !== 'both')) {
      throw new Error('Invalid area for text customization')
    }

    const textObject = new fabric.Text(text, {
      left: area.x + (options.x || 0),
      top: area.y + (options.y || 0),
      fontFamily: options.font || PRODUCT_CUSTOMIZATION.DEFAULT_FONTS[0],
      fill: options.color || PRODUCT_CUSTOMIZATION.DEFAULT_COLORS[0],
      fontSize: options.size || 20,
      selectable: true,
      hasControls: true,
    })

    // Constrain movement within the area
    textObject.on('moving', () => {
      this.constrainToArea(textObject, area)
    })

    this.canvas.add(textObject)
    this.canvas.setActiveObject(textObject)
    return textObject
  }

  addImage(imageUrl: string, areaId: string, options: Partial<ImageCustomization> = {}) {
    const area = this.customizationAreas.find(a => a.id === areaId)
    if (!area || (area.type !== 'image' && area.type !== 'both')) {
      throw new Error('Invalid area for image customization')
    }

    return new Promise<fabric.Image>((resolve, reject) => {
      fabric.Image.fromURL(imageUrl, (img) => {
        if (!img) {
          reject(new Error('Failed to load image'))
          return
        }

        img.set({
          left: area.x + (options.x || 0),
          top: area.y + (options.y || 0),
          scaleX: (options.width || 100) / (img.width || 1),
          scaleY: (options.height || 100) / (img.height || 1),
          angle: options.rotation || 0,
          selectable: true,
          hasControls: true,
        })

        // Constrain movement within the area
        img.on('moving', () => {
          this.constrainToArea(img, area)
        })

        this.canvas.add(img)
        this.canvas.setActiveObject(img)
        resolve(img)
      })
    })
  }

  private constrainToArea(object: fabric.Object, area: CustomizationArea) {
    const objBounds = object.getBoundingRect()
    
    // Constrain to area boundaries
    if (objBounds.left < area.x) {
      object.set('left', area.x)
    }
    if (objBounds.top < area.y) {
      object.set('top', area.y)
    }
    if (objBounds.left + objBounds.width > area.x + area.width) {
      object.set('left', area.x + area.width - objBounds.width)
    }
    if (objBounds.top + objBounds.height > area.y + area.height) {
      object.set('top', area.y + area.height - objBounds.height)
    }
  }

  getCustomizationData(): CustomizationData {
    const customizations = this.canvas.getObjects()
      .filter(obj => obj.type === 'text' || obj.type === 'image')
      .map(obj => {
        // Find which area this object belongs to
        const objBounds = obj.getBoundingRect()
        const area = this.customizationAreas.find(a => 
          objBounds.left >= a.x && 
          objBounds.top >= a.y &&
          objBounds.left + objBounds.width <= a.x + a.width &&
          objBounds.top + objBounds.height <= a.y + a.height
        )

        if (!area) return null

        if (obj.type === 'text') {
          const textObj = obj as fabric.Text
          return {
            area_id: area.id,
            type: 'text' as const,
            data: {
              text: textObj.text || '',
              font: textObj.fontFamily || '',
              color: textObj.fill as string || '',
              size: textObj.fontSize || 20,
              x: (textObj.left || 0) - area.x,
              y: (textObj.top || 0) - area.y,
            }
          }
        } else if (obj.type === 'image') {
          const imgObj = obj as fabric.Image
          return {
            area_id: area.id,
            type: 'image' as const,
            data: {
              image_url: (imgObj as any)._originalElement?.src || '',
              x: (imgObj.left || 0) - area.x,
              y: (imgObj.top || 0) - area.y,
              width: (imgObj.width || 0) * (imgObj.scaleX || 1),
              height: (imgObj.height || 0) * (imgObj.scaleY || 1),
              rotation: imgObj.angle || 0,
            }
          }
        }

        return null
      })
      .filter(Boolean)

    return {
      product_id: '', // To be set by the calling component
      variant_id: '', // To be set by the calling component
      customizations: customizations as any[],
    }
  }

  exportAsImage(): string {
    return this.canvas.toDataURL({
      format: 'png',
      quality: 1,
    })
  }

  clear() {
    this.canvas.clear()
    this.initializeAreas()
  }

  destroy() {
    this.canvas.dispose()
  }
}