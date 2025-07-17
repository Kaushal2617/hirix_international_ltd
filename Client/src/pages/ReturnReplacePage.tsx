"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Package,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  XCircle,
  StarOff,
  HelpCircle,
  MessageCircle,
  MapPin,
  Upload,
  Truck,
  ChevronDown,
  ChevronUp,
  PoundSterling,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Footer from "../components/shared/Footer"

// Mock data - in a real app, this would be fetched from an API
const mockOrderItems = {
  "ORD-1234": [
    { id: 1, name: "Modern Coffee Table", price: 149.99, quantity: 1, image: "/placeholder.svg" },
    { id: 2, name: "Decorative Pillow", price: 29.99, quantity: 2, image: "/placeholder.svg" },
    { id: 3, name: "Table Lamp", price: 39.99, quantity: 1, image: "/placeholder.svg" },
  ],
  "ORD-1235": [{ id: 4, name: "Bookshelf", price: 199.99, quantity: 1, image: "/placeholder.svg" }],
  "ORD-1236": [
    { id: 5, name: "Dining Chair (Set of 2)", price: 174.99, quantity: 1, image: "/placeholder.svg" },
    { id: 6, name: "Area Rug", price: 124.99, quantity: 1, image: "/placeholder.svg" },
    { id: 7, name: "Wall Clock", price: 49.99, quantity: 1, image: "/placeholder.svg" },
  ],
}

// Form validation schema
const returnFormSchema = z.object({
  returnType: z.enum(["return", "replace"]),
  reason: z.enum(["damaged", "wrong_item", "quality_issue", "changed_mind", "other"]),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters" }).optional(),
  images: z.any().optional(),
  pickupAddress: z.object({
    useDefault: z.boolean(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }),
})

type ReturnFormValues = z.infer<typeof returnFormSchema>

const ReturnReplacePage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get("orderId")
  const itemId = searchParams.get("item") ? Number.parseInt(searchParams.get("item") || "0") : 0
  const [orderItem, setOrderItem] = useState<any>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // Collapsible states
  const [isReturnTypeExpanded, setIsReturnTypeExpanded] = useState(true)
  const [isReasonExpanded, setIsReasonExpanded] = useState(true)

  // Form setup
  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      returnType: "return",
      reason: "quality_issue",
      comment: "",
      pickupAddress: {
        useDefault: true,
        address: "",
        city: "",
        state: "",
        zip: "",
      },
    },
  })

  const returnType = form.watch("returnType")
  const useDefaultAddress = form.watch("pickupAddress.useDefault")

  // Find order item
  useEffect(() => {
    if (orderId && itemId && mockOrderItems[orderId as keyof typeof mockOrderItems]) {
      const item = mockOrderItems[orderId as keyof typeof mockOrderItems].find((item) => item.id === itemId)
      if (item) {
        setOrderItem(item)
      }
    }
  }, [orderId, itemId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // In a real app, you would upload these to a server
    // For this demo, we'll just create local URLs
    const newImages: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const imageUrl = URL.createObjectURL(file)
      newImages.push(imageUrl)
    }

    setUploadedImages([...uploadedImages, ...newImages])
  }

  const onSubmit = (data: ReturnFormValues) => {
    // In a real app, you would submit this data to your backend
    console.log("Return request submitted:", data)

    // Show success message
    toast.success(
      data.returnType === "return"
        ? "Return request submitted successfully!"
        : "Replacement request submitted successfully!",
    )

    // Navigate back to orders page
    navigate("/orders")
  }

  if (!orderItem) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="container mx-auto px-4 py-12 flex-grow text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-black">
              <XCircle className="text-red-500 w-7 h-7" />
              Item not found
            </h2>
            <p className="mt-2 text-gray-600">The requested item could not be found.</p>
            <Button variant="outline" className="mt-6 bg-transparent" onClick={() => navigate("/orders")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Orders
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="container mx-auto px-4 py-12 flex-grow z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <Button variant="outline" className="mb-8 bg-transparent" onClick={() => navigate("/orders")} asChild>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </motion.div>
          </Button>

          {/* Combined Card */}
          <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl rounded-3xl overflow-hidden">
            {/* Item Details Section */}
            <CardHeader className="border-b border-gray-100 pb-6">
              <CardTitle className="text-lg text-black flex items-center gap-2">
                <Package className="text-gray-400 w-5 h-5" /> Item Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={orderItem.image || "/placeholder.svg"}
                    alt={orderItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-black">{orderItem.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Order #{orderId}</p>
                  <p className="font-medium mt-2 text-red-500 flex items-center">
                    <PoundSterling className="w-4 h-4 mr-1" />
                    {orderItem.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {orderItem.quantity}</p>
                </div>
              </div>
            </CardContent>

            {/* Return Information Section */}
            <div className="bg-gray-50/70 px-6 py-5 border-t border-gray-100">
              <h3 className="text-lg font-medium text-black flex items-center gap-2 mb-4">
                {returnType === "return" ? (
                  <PoundSterling className="text-red-400 w-5 h-5" />
                ) : (
                  <RotateCcw className="text-red-400 w-5 h-5" />
                )}
                {returnType === "return" ? "Return Information" : "Replacement Information"}
              </h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Collapsible Return or Replace option */}
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setIsReturnTypeExpanded(!isReturnTypeExpanded)}
                      className="w-full p-4 bg-gray-50/50 hover:bg-gray-100/50 transition-colors duration-200 flex items-center justify-between"
                    >
                      <span className="text-black font-medium flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-gray-400" /> I want to:
                      </span>
                      {isReturnTypeExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <AnimatePresence>
                      {isReturnTypeExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0">
                            <FormField
                              control={form.control}
                              name="returnType"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col space-y-2"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="return" id="return" />
                                        <Label htmlFor="return" className="flex items-center gap-1">
                                          <PoundSterling className="w-4 h-4 text-red-400" /> Return for refund
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="replace" id="replace" />
                                        <Label htmlFor="replace" className="flex items-center gap-1">
                                          <RotateCcw className="w-4 h-4 text-red-400" /> Replace with same item
                                        </Label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Collapsible Reason for return/replace */}
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setIsReasonExpanded(!isReasonExpanded)}
                      className="w-full p-4 bg-gray-50/50 hover:bg-gray-100/50 transition-colors duration-200 flex items-center justify-between"
                    >
                      <span className="text-black font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400" /> Reason for{" "}
                        {returnType === "return" ? "return" : "replacement"}:
                      </span>
                      {isReasonExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <AnimatePresence>
                      {isReasonExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0">
                            <FormField
                              control={form.control}
                              name="reason"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col space-y-2"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="damaged" id="damaged" />
                                        <Label htmlFor="damaged" className="flex items-center gap-1">
                                          <AlertTriangle className="w-4 h-4 text-yellow-400" /> Product arrived damaged
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="wrong_item" id="wrong_item" />
                                        <Label htmlFor="wrong_item" className="flex items-center gap-1">
                                          <XCircle className="w-4 h-4 text-red-400" /> Received wrong item
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="quality_issue" id="quality_issue" />
                                        <Label htmlFor="quality_issue" className="flex items-center gap-1">
                                          <StarOff className="w-4 h-4 text-gray-400" /> Quality not as expected
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="changed_mind" id="changed_mind" />
                                        <Label htmlFor="changed_mind" className="flex items-center gap-1">
                                          <HelpCircle className="w-4 h-4 text-blue-400" /> Changed my mind
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="other" id="other" />
                                        <Label htmlFor="other" className="flex items-center gap-1">
                                          <MessageCircle className="w-4 h-4 text-gray-400" /> Other
                                        </Label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Additional comments */}
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-gray-400" /> Additional comments (optional):
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide details about your issue..."
                            className="resize-none bg-white/40 text-black placeholder:text-gray-500 border-none focus:ring-2 focus:ring-red-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image upload */}
                  <div className="space-y-2">
                    <Label htmlFor="images" className="text-black flex items-center gap-2">
                      <Upload className="w-4 h-4 text-blue-400" /> Upload images (optional):
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="bg-white/40 text-black border-none file:bg-red-500 file:text-white file:rounded file:px-3 file:py-1 file:mr-2"
                    />
                    {uploadedImages.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-2 text-black">Uploaded Images:</p>
                        <div className="flex gap-2 flex-wrap">
                          {uploadedImages.map((image, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 * index, duration: 0.3 }}
                              className="w-16 h-16 relative rounded-xl overflow-hidden shadow-lg border-2 border-white/40"
                            >
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pickup address */}
                  <div className="space-y-3 border border-white/40 p-4 rounded-2xl bg-white/40">
                    <h3 className="font-medium text-black flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-400" /> Pickup Address
                    </h3>
                    <FormField
                      control={form.control}
                      name="pickupAddress.useDefault"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-black">Use my default address for pickup</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    {!useDefaultAddress && (
                      <div className="space-y-3 mt-3">
                        <FormField
                          control={form.control}
                          name="pickupAddress.address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black">Street Address</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white/40 text-black border-none" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="pickupAddress.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black">City</FormLabel>
                                <FormControl>
                                  <Input {...field} className="bg-white/40 text-black border-none" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="pickupAddress.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-black">State</FormLabel>
                                <FormControl>
                                  <Input {...field} className="bg-white/40 text-black border-none" />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="pickupAddress.zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-black">ZIP Code</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white/40 text-black border-none" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg text-lg py-3 transition-all duration-200 rounded-2xl"
                    >
                      <Truck className="mr-2 h-5 w-5" />
                      Submit {returnType === "return" ? "Return" : "Replacement"} Request
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

export default ReturnReplacePage
