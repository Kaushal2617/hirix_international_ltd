"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, X, ZoomIn } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ColorVariant {
  color: string
  colorCode: string
  images: string[]
  mainImage: string
  video?: string
  price?: number
  inventory?: number
}

interface ProductGalleryProps {
  productName: string
  mainImage: string
  images?: string[]
  video?: string
  colorVariants?: ColorVariant[]
  selectedColor?: string
}

const ProductGallery = ({
  productName,
  mainImage,
  images = [],
  video,
  colorVariants = [],
  selectedColor,
}: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSelectedImage, setModalSelectedImage] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const modalScrollRef = useRef<HTMLDivElement>(null)

  // Get current color variant or use default
  const currentVariant = colorVariants.find((variant) => variant.color === selectedColor)
  const currentMainImage = currentVariant?.mainImage || mainImage
  //console.log("images "+currentVariant.images.length)
  

  const currentImages = currentVariant?.images || images
  const currentVideo = currentVariant?.video || video

  // Combine main image with additional images and video
  const allMedia = [
    // { type: "image", src: currentMainImage, alt: `${productName} - ${selectedColor || "Default"}` },
    ...currentImages.map((img, index) => ({
      type: "image" as const,
      src: img,
      alt: `${productName} - ${selectedColor || "Default"} - Image ${index + 1}`,
    })),
    ...(currentVideo
      ? [{ type: "video" as const, src: currentVideo, alt: `${productName} - ${selectedColor || "Default"} - Video` }]
      : []),
  ]
  // Reset selected image when color changes
  useEffect(() => {
    setSelectedImage(0)
    setModalSelectedImage(0)
  }, [selectedColor])

  const scrollThumbnails = (direction: "left" | "right", containerRef: React.RefObject<HTMLDivElement>) => {
    if (containerRef.current) {
      const scrollAmount = 120 // Width of thumbnail + gap
      const currentScroll = containerRef.current.scrollLeft
      const newScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount

      containerRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      })
    }
  }

  const openModal = () => {
    setModalSelectedImage(selectedImage)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = "unset" // Restore scrolling
  }

  const handleModalImageChange = (index: number) => {
    setModalSelectedImage(index)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isModalOpen) return

    if (e.key === "Escape") {
      closeModal()
    } else if (e.key === "ArrowLeft" && modalSelectedImage > 0) {
      setModalSelectedImage(modalSelectedImage - 1)
    } else if (e.key === "ArrowRight" && modalSelectedImage < allMedia.length - 1) {
      setModalSelectedImage(modalSelectedImage + 1)
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isModalOpen, modalSelectedImage])

  // Close modal on outside click
  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <>
      <div className="w-full">
        {/* Color Indicator */}
        {selectedColor && (
          <div className="mb-2 text-sm text-gray-600">
            Viewing: <span className="font-medium capitalize">{selectedColor}</span>
          </div>
        )}

        {/* Main Image/Video Display */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 group cursor-pointer">
          <AnimatePresence mode="wait">
            <motion.div
              key={`main-${selectedColor}-${selectedImage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={openModal}
              className="relative w-full h-full"
            >
              {allMedia[selectedImage]?.type === "video" ? (
                <div className="relative w-full h-full">
                  <video
                    src={allMedia[selectedImage].src}
                    className="w-full h-full object-cover"
                    controls
                    poster={currentMainImage}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <img
                  src={allMedia[selectedImage]?.src || currentMainImage}
                  alt={allMedia[selectedImage]?.alt || productName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              {/* Zoom Icon Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                  <ZoomIn className="w-6 h-6 text-gray-700" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Image Counter */}
          {allMedia.length > 0 && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {selectedImage + 1} / {allMedia.length}
            </div>
          )}
        </div>

        {/* Thumbnail Scrollable Row */}
        {allMedia.length > 0 && (
          <div className="relative">
            {/* Left Scroll Button */}
            <button
              onClick={() => scrollThumbnails("left", scrollContainerRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
              style={{ marginLeft: "-12px" }}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            {/* Right Scroll Button */}
            <button
              onClick={() => scrollThumbnails("right", scrollContainerRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
              style={{ marginRight: "-12px" }}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>

            {/* Scrollable Thumbnails Container */}
            <div className="group">
              <div
                ref={scrollContainerRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <AnimatePresence>
                  {allMedia.map((media, index) => (
                    <motion.button
                      key={`thumb-${selectedColor}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {media.type === "video" ? (
                        <div className="relative w-full h-full bg-gray-100">
                          <video src={media.src} className="w-full h-full object-cover" muted preload="metadata">
                            Your browser does not support the video tag.
                          </video>
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" fill="white" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={media.src || "/placeholder.svg"}
                          alt={media.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}

                      {/* Selected Indicator */}
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-red-500/10 border-2 border-red-500 rounded-lg" />
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
            onClick={handleModalBackdropClick}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-60 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <div className="w-full max-w-7xl mx-auto flex flex-col h-full max-h-[95vh] overflow-hidden">
              {/* Main Modal Image */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex items-center justify-center mb-4 min-h-0"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`modal-${selectedColor}-${modalSelectedImage}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {allMedia[modalSelectedImage]?.type === "video" ? (
                        <video
                          src={allMedia[modalSelectedImage].src}
                          className="w-full h-full max-w-full max-h-full object-contain"
                          controls
                          autoPlay
                          style={{ maxHeight: "calc(100vh - 200px)" }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={allMedia[modalSelectedImage]?.src || currentMainImage}
                          alt={allMedia[modalSelectedImage]?.alt || productName}
                          className="w-full h-full object-contain"
                          style={{
                            maxHeight: "calc(100vh - 200px)",
                            maxWidth: "100%",
                            height: "auto",
                            width: "auto",
                          }}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {modalSelectedImage > 0 && (
                    <button
                      onClick={() => setModalSelectedImage(modalSelectedImage - 1)}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 sm:p-3 transition-colors duration-200 z-10"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  )}

                  {modalSelectedImage < allMedia.length - 1 && (
                    <button
                      onClick={() => setModalSelectedImage(modalSelectedImage + 1)}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 sm:p-3 transition-colors duration-200 z-10"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Modal Thumbnails */}
              {allMedia.length > 1 && (
                <div className="relative">
                  {/* Left Scroll Button */}
                  <button
                    onClick={() => scrollThumbnails("left", modalScrollRef)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-200"
                    style={{ marginLeft: "-12px" }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Right Scroll Button */}
                  <button
                    onClick={() => scrollThumbnails("right", modalScrollRef)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors duration-200"
                    style={{ marginRight: "-12px" }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Modal Thumbnails Container */}
                  <div
                    ref={modalScrollRef}
                    className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-8"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {allMedia.map((media, index) => (
                      <motion.button
                        key={`modal-thumb-${selectedColor}-${index}`}
                        onClick={() => handleModalImageChange(index)}
                        className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          modalSelectedImage === index
                            ? "border-red-500 ring-2 ring-red-200"
                            : "border-white/30 hover:border-white/50"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {media.type === "video" ? (
                          <div className="relative w-full h-full bg-gray-800">
                            <video src={media.src} className="w-full h-full object-cover" muted preload="metadata">
                              Your browser does not support the video tag.
                            </video>
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <Play className="w-3 h-3 text-white" fill="white" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={media.src || "/placeholder.svg"}
                            alt={media.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}

                        {/* Selected Indicator */}
                        {modalSelectedImage === index && (
                          <div className="absolute inset-0 bg-red-500/20 border-2 border-red-500 rounded-lg" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Counter */}
              <div className="text-center text-white/70 text-sm mt-2">
                {modalSelectedImage + 1} of {allMedia.length}
                {selectedColor && <span className="ml-2">({selectedColor})</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom CSS to hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}

export default ProductGallery
