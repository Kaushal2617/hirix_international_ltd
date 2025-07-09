// Example of how to structure your product data with color variants
export const sampleProductWithColors = {
    id: 1,
    name: "Modern Coffee Table",
    description: "A sleek and modern coffee table perfect for any living room.",
    price: 299.99,
    oldPrice: 399.99,
    category: "Living Room",
    rating: 4.5,
    reviewCount: 128,
    inventory: 15,
    material: "Oak Wood",
    color: "Natural Oak", // default color
    image: "/images/coffee-table-oak.jpg", // default main image
    images: [
      "/images/coffee-table-oak-2.jpg",
      "/images/coffee-table-oak-3.jpg"
    ],
    video: "/videos/coffee-table-oak.mp4",
    colorVariants: [
      {
        color: "Natural Oak",
        colorCode: "#D2B48C",
        mainImage: "/images/coffee-table-oak.jpg",
        images: [
          "/images/coffee-table-oak-2.jpg",
          "/images/coffee-table-oak-3.jpg",
          "/images/coffee-table-oak-4.jpg"
        ],
        video: "/videos/coffee-table-oak.mp4",
        price: 299.99,
        inventory: 15
      },
      {
        color: "Dark Walnut",
        colorCode: "#654321",
        mainImage: "/images/coffee-table-walnut.jpg",
        images: [
          "/images/coffee-table-walnut-2.jpg",
          "/images/coffee-table-walnut-3.jpg",
          "/images/coffee-table-walnut-4.jpg"
        ],
        video: "/videos/coffee-table-walnut.mp4",
        price: 329.99, // different price for this color
        inventory: 8
      },
      {
        color: "White",
        colorCode: "#FFFFFF",
        mainImage: "/images/coffee-table-white.jpg",
        images: [
          "/images/coffee-table-white-2.jpg",
          "/images/coffee-table-white-3.jpg"
        ],
        price: 289.99,
        inventory: 0 // out of stock
      },
      {
        color: "Black",
        colorCode: "#000000",
        mainImage: "/images/coffee-table-black.jpg",
        images: [
          "/images/coffee-table-black-2.jpg",
          "/images/coffee-table-black-3.jpg",
          "/images/coffee-table-black-4.jpg",
          "/images/coffee-table-black-5.jpg"
        ],
        price: 319.99,
        inventory: 12
      }
    ],
    dimensions: {
      length: 120,
      width: 60,
      height: 45
    },
    weight: 25,
    details: [
      "Solid wood construction",
      "Easy assembly required",
      "Scratch-resistant surface",
      "Modern minimalist design"
    ]
  };
  