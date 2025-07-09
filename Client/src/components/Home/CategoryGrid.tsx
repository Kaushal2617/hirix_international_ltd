"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Grid } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Category type now includes image (optional)
interface Category {
  id: string
  name: string
  slug: string
  image?: string
  items?: number
  link: string
}

interface CategoryGridProps {
  categories?: Category[]
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories = [] }) => {
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Only show categories with image
  const categoriesWithImage = categories.filter((cat) => !!cat.image)

  // Duplicate for seamless looping
  const marqueeCategories = [...categoriesWithImage, ...categoriesWithImage]

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleCategoryClick = (link: string) => {
    if (link) navigate(link)
  }

  // Desktop hover handlers
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsPaused(false)
    }
  }

  // Mobile touch handlers
  const handleTouchStart = () => {
    if (isMobile) {
      setIsPaused(true)
    }
  }

  const handleTouchEnd = () => {
    if (isMobile) {
      // Resume after a short delay to allow for tap interactions
      setTimeout(() => {
        setIsPaused(false)
      }, 2000)
    }
  }

  // Handle scroll on mobile
  const handleScroll = () => {
    if (isMobile) {
      setIsScrolling(true)
      setIsPaused(true)

      // Clear existing timeout
      const timeoutId = setTimeout(() => {
        setIsScrolling(false)
        setIsPaused(false)
      }, 3000)

      return () => clearTimeout(timeoutId)
    }
  }

  if (isMobile) {
    // Mobile: Horizontal scrollable version
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Grid className="w-7 h-7 text-indigo-500 animate-bounce" />
              Shop by Category
            </h2>
            <p className="text-gray-600">Discover our wide range of products</p>
          </div>

          {/* Mobile: Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide"
            onScroll={handleScroll}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
              {categoriesWithImage.map((category, idx) => (
                <motion.div
                  key={category.id + "-mobile-" + idx}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md active:shadow-2xl transition-all duration-300 cursor-pointer flex-shrink-0"
                  style={{ height: "260px", width: "220px" }}
                  onClick={() => handleCategoryClick(category.link)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Shop ${category.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleCategoryClick(category.link)
                  }}
                >
                  <div className="relative h-3/5 overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover transform group-active:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 text-black z-10">
                    <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                    <p className="text-xs mb-3">{category.items} items</p>
                    <span className="inline-flex items-center text-xs font-medium bg-white/90 text-red-600 rounded-full px-4 py-1 shadow group-active:bg-red-500 group-active:text-white transition-colors">
                      Shop Now
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-active:bg-black/10 transition-colors duration-300 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll indicator for mobile */}
          <div className="flex justify-center mt-4">
            <p className="text-sm text-gray-500">← Swipe to explore more categories →</p>
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>
    )
  }

  // Desktop: Marquee version
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Grid className="w-7 h-7 text-indigo-500 animate-bounce" />
            Shop by Category
          </h2>
          <p className="text-gray-600">Discover our wide range of products</p>
        </div>

        {/* Desktop: Marquee */}
        <div
          className="overflow-x-hidden relative"
          style={{ maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={marqueeRef}
            className="flex gap-8 w-max"
            style={{
              animation: isPaused ? "none" : "marquee 24s linear infinite",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {marqueeCategories.map((category, idx) => (
              <motion.div
                key={category.id + "-" + idx}
                whileHover={{ y: -8, scale: 1.04, boxShadow: "0 8px 32px 0 rgba(255,0,64,0.10)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:ring-2 hover:ring-red-200 transition-all duration-300 cursor-pointer"
                style={{ height: "260px", width: "100%", maxWidth: "300px", minWidth: "220px" }}
                onClick={() => handleCategoryClick(category.link)}
                role="button"
                tabIndex={0}
                aria-label={`Shop ${category.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleCategoryClick(category.link)
                }}
              >
                <div className="relative h-3/5 overflow-hidden">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-black z-10">
                  <h3 className="text-lg font-bold mb-1">{category.name}</h3>
                  <p className="text-xs mb-3">{category.items} items</p>
                  <span className="inline-flex items-center text-xs font-medium bg-white/90 text-red-600 rounded-full px-4 py-1 shadow group-hover:bg-red-500 group-hover:text-white transition-colors">
                    Shop Now
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

export default CategoryGrid
