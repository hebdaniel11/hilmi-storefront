// Shared types for the ecommerce application

export interface CustomizableProduct {
  id: string
  title: string
  description?: string
  handle: string
  images: ProductImage[]
  variants: ProductVariant[]
  customizable: boolean
  customization_options?: CustomizationOptions
}

export interface ProductImage {
  id: string
  url: string
  alt_text?: string
}

export interface ProductVariant {
  id: string
  title: string
  price: number
  inventory_quantity?: number
  options: Record<string, string>
}

export interface CustomizationOptions {
  allowed_areas: CustomizationArea[]
  text_options?: TextCustomizationOptions
  image_options?: ImageCustomizationOptions
}

export interface CustomizationArea {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  type: 'text' | 'image' | 'both'
}

export interface TextCustomizationOptions {
  fonts: string[]
  colors: string[]
  max_characters?: number
}

export interface ImageCustomizationOptions {
  max_width: number
  max_height: number
  allowed_formats: string[]
}

export interface CustomizationData {
  product_id: string
  variant_id: string
  customizations: Customization[]
}

export interface Customization {
  area_id: string
  type: 'text' | 'image'
  data: TextCustomization | ImageCustomization
}

export interface TextCustomization {
  text: string
  font: string
  color: string
  size: number
  x: number
  y: number
}

export interface ImageCustomization {
  image_url: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
}