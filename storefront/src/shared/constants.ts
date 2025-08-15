// Shared constants for the ecommerce application

export const API_ENDPOINTS = {
  MEDUSA_BACKEND: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
  STOREFRONT: process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000',
} as const

export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
} as const

export const PRODUCT_CUSTOMIZATION = {
  MAX_TEXT_LENGTH: 100,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DEFAULT_FONTS: [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
  ],
  DEFAULT_COLORS: [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
  ],
} as const

export const CANVAS_CONFIG = {
  DEFAULT_WIDTH: 400,
  DEFAULT_HEIGHT: 400,
  BACKGROUND_COLOR: '#FFFFFF',
} as const

export const DEFAULT_CUSTOMIZATION_AREAS = {
  front: [
    // Centered area within the shirt body on a 400x500 canvas - adjusted for fixed sizing
    { id: 'front-center', name: 'Front Center', x: 125, y: 140, width: 150, height: 200, type: 'both' },
  ],
  back: [
    // Same size as front; positioned under the back collar - adjusted for fixed sizing
    { id: 'back-center', name: 'Back Center', x: 125, y: 100, width: 150, height: 200, type: 'both' },
  ],
  neck: [],
} as const