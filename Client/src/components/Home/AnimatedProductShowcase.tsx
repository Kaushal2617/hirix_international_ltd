"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, easeInOut } from "framer-motion"
import { Link } from "react-router-dom"
import { Sparkles } from "lucide-react"

const showcaseCategories = [
  {
    id: 1,
    title: "Showcase 1",
    image: "/images/minibanner1_resized.jpg",
    link: "/sale",
  },
  {
    id: 2,
    title: "Showcase 2",
    image: "https://hirixdirect.co.uk/uploads/products/68497fff89d09_2000552802.jpg",
    link: "/sale",
  },
  {
    id: 3,
    title: "Showcase 3",
    image: "https://hirixdirect.co.uk/uploads/products/6838835888137_1305586369.jpg",
    link: "/sale",
  },
  {
    id: 4,
    title: "Showcase 4",
    image: "https://hirixdirect.co.uk/uploads/products/679c996c889db_1155877497.jpg",
    link: "/sale",
  },
]

const transitionDuration = 0.8
const displayDuration = 3

const AnimatedProductShowcase = () => {
  const [leftIdx, setLeftIdx] = useState(0)
  const [rightIdx, setRightIdx] = useState(1)
  const [mobileIdx, setMobileIdx] = useState(0)
  const [leftKey, setLeftKey] = useState(0)
  const [rightKey, setRightKey] = useState(1)
  const [mobileKey, setMobileKey] = useState(0)

  // Mobile single card timer - cycles through all images
  useEffect(() => {
    const interval = setInterval(() => {
      setMobileIdx((prev) => (prev + 1) % showcaseCategories.length)
      setMobileKey((prev) => prev + 1)
    }, displayDuration * 1000)

    return () => clearInterval(interval)
  }, [])

  // Left card timer for desktop
  useEffect(() => {
    const interval = setInterval(() => {
      setLeftIdx((prev) => (prev + 2) % showcaseCategories.length)
      setLeftKey((prev) => prev + 1)
    }, displayDuration * 1000)

    return () => clearInterval(interval)
  }, [])

  // Right card timer for desktop (staggered)
  useEffect(() => {
    const interval = setInterval(
      () => {
        setRightIdx((prev) => (prev + 2) % showcaseCategories.length)
        setRightKey((prev) => prev + 1)
      },
      displayDuration * 1000 + displayDuration * 500,
    )

    return () => clearInterval(interval)
  }, [])

  const leftCategory = showcaseCategories[leftIdx]
  const rightCategory = showcaseCategories[rightIdx]
  const mobileCategory = showcaseCategories[mobileIdx]

  const cardVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.9, ease: easeInOut } },
    exit: { opacity: 0, transition: { duration: 0.9, ease: easeInOut } },
  }

  return (
    <section className="py-10 bg-gradient-to-r from-gray-50 to-white mb-8 pb-4 sm:mb-2 sm:pb-1 md:mb-0 md:pb-0">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-pink-500 animate-bounce" />
            Discover More
          </h2>
          <p className="text-gray-600">A glimpse at our trending products</p>
        </div>

        {/* Mobile View - Single Card */}
        <div className="block md:hidden">
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl flex-1">
              <div className="relative h-96">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`mobile-card-${mobileKey}`}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
                  >
                    <Link to={mobileCategory.link} className="block h-full">
                      <div className="h-full w-full overflow-hidden rounded-2xl">
                        <img
                          src={mobileCategory.image || "/placeholder.svg"}
                          alt={mobileCategory.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View - Two Cards */}
        <div className="hidden md:flex md:gap-8 justify-center relative min-h-[420px] sm:min-h-[480px] md:min-h-[520px]">
          {/* Left Card */}
          <div className="relative w-full md:max-w-2xl flex-1 h-96 md:h-[28rem]">
            <AnimatePresence initial={false}>
              <motion.div
                key={`left-card-${leftKey}`}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden w-full h-96 md:h-[28rem] cursor-pointer hover:shadow-2xl transition-all duration-300 flex flex-col z-10"
              >
                <Link to={leftCategory.link} className="block h-full">
                  <div className="h-full w-full overflow-hidden rounded-2xl">
                    <img
                      src={leftCategory.image || "/placeholder.svg"}
                      alt={leftCategory.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Card */}
          <div className="relative w-full md:max-w-2xl flex-1 h-96 md:h-[28rem]">
            <AnimatePresence initial={false}>
              <motion.div
                key={`right-card-${rightKey}`}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden w-full h-96 md:h-[28rem] cursor-pointer hover:shadow-2xl transition-all duration-300 flex flex-col z-10"
              >
                <Link to={rightCategory.link} className="block h-full">
                  <div className="h-full w-full overflow-hidden rounded-2xl">
                    <img
                      src={rightCategory.image || "/placeholder.svg"}
                      alt={rightCategory.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnimatedProductShowcase
