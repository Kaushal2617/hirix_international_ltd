"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface ColorVariant {
  color: string
  colorCode: string
  images: string[]
  mainImage: string
  video?: string
  price?: number
  inventory?: number
}

interface ColorSelectorProps {
  colorVariants: ColorVariant[]
  selectedColor: string
  onColorChange: (color: string) => void
  className?: string
}

const ColorSelector = ({ colorVariants, selectedColor, onColorChange, className = "" }: ColorSelectorProps) => {
  if (!colorVariants || colorVariants.length <= 1) {
    return null
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Color:</span>
        <span className="text-sm font-semibold text-gray-900 capitalize">{selectedColor}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {colorVariants.map((variant) => (
          <motion.button
            key={variant.color}
            onClick={() => onColorChange(variant.color)}
            className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 ${
              selectedColor === variant.color
                ? "border-red-500 ring-2 ring-red-200 scale-110"
                : "border-gray-300 hover:border-gray-400 hover:scale-105"
            }`}
            whileHover={{ scale: selectedColor === variant.color ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`Select ${variant.color}`}
            aria-label={`Select ${variant.color} color`}
          >
            {/* Color Circle */}
            <div className="w-full h-full rounded-full" style={{ backgroundColor: variant.colorCode }} />

            {/* Selected Indicator */}
            {selectedColor === variant.color && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white rounded-full p-1">
                  <Check className="w-4 h-4 text-red-500" />
                </div>
              </motion.div>
            )}

            {/* Out of Stock Indicator */}
            {variant.inventory === 0 && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">✕</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Color Names for Better UX */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        {colorVariants.map((variant) => (
          <button
            key={`name-${variant.color}`}
            onClick={() => onColorChange(variant.color)}
            className={`px-2 py-1 rounded-full border transition-colors ${
              selectedColor === variant.color
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {variant.color}
            {variant.inventory === 0 && " (Out of Stock)"}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ColorSelector
