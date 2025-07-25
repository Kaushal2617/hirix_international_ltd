export interface ColorVariant {
    color: string
    colorCode: string // hex code for display
    images: string[]
    mainImage: string
    video?: string
    price?: number // optional different pricing per color
    inventory?: number // optional different inventory per color
  }
  
  export interface Product {
    id: number
    name: string
    description: string
    price: number
    oldPrice?: number
    category: string
    subcategory: string
    rating: number
    reviewCount: number
    inventory: number
    material: string
    color: string // default color
    image: string // default main image
    images?: string[] // default additional images
    video?: string // default video
    colorVariants?: ColorVariant[] // different color options
    dimensions?: {
      length: number
      width: number
      height: number
    }
    weight?: number
    details?: string[]
    variants: string[]
  }
  