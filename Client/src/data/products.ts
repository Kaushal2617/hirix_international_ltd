export interface Product {
    id: number;
    name: string;
    image: string;
    images?: string[];
    video?: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviewCount: number;
    category: string;
    subcategory: string;
    color: string;
    material: string;
    brand?: string; // Added
    model?: string; // Added
    description?: string;
    details?: string[];
    newArrival?: boolean;
    inventory: number;
    weight?: number; // in kg
    dimensions?: {
        length: number; // in cm
        width: number; // in cm
        height: number; // in cm
    };
    aPlusImage?: string;
    variants?: Variant[];
}

export interface Variant {
    id: string;
    color: string;
    size: string;
    material: string;
    finish: string;
    price: number;
    oldPrice?: number;
    inventory: number;
    images: string[];
    description: string;
    brand?: string; // Added
    model?: string; // Added
}

export const allProducts: Product[] = [
  {
    id: 1,
    name: "Modern Fabric Sofa Couch with Reversible Chaise Lounge",
    image: "https://hirixdirect.co.uk/uploads/products/67d2f63383984_235782643.jpg",
    images: ["https://hirixdirect.co.uk/uploads/products/67d2f63383984_235782643.jpg","https://hirixdirect.co.uk/uploads/products/679cd99babae3_2051974507.jpg","https://hirixdirect.co.uk/uploads/products/67b5dac8d805f_338049949.jpg","https://hirixdirect.co.uk/uploads/products/67b5db3279e22_1133795840.jpg","https://hirixdirect.co.uk/uploads/products/665dda6bd0de1_1072220307.jpg"],
    aPlusImage: "https://hirixdirect.co.uk/uploads/products/sample-aplus-banner.jpg",
    price: 509.99,
    oldPrice: 649.99,
    rating: 4.5,
    reviewCount: 42,
    category: "Living Room",
    subcategory: "Sofas",
    color: "Gray",
    material: "Fabric",
    brand: "Hirix",
    model: "HIR-100",
    description: "This modern L-shaped sectional sofa features a reversible chaise lounge that can be positioned on either side to suit your living space.",
    newArrival: false,
    inventory: 10,
    weight: 45,
    dimensions: { length: 220, width: 90, height: 85 },
    variants: [
      {
        id: '1a',
        color: 'Gray',
        size: 'Large',
        material: 'Fabric',
        finish: 'Matte',
        price: 509.99,
        oldPrice: 649.99,
        inventory: 10,
        images: ["https://hirixdirect.co.uk/uploads/products/67d2f63383984_235782643.jpg"],
        description: 'Gray, Large, Fabric, Matte finish',
        brand: "Hirix",
        model: "HIR-11a"
      },
      {
        id: '1b',
        color: 'Blue',
        size: 'Medium',
        material: 'Velvet',
        finish: 'Glossy',
        price: 529.99,
        oldPrice: 669.99,
        inventory: 5,
        images: ["https://hirixdirect.co.uk/uploads/products/679cd99babae3_2051974507.jpg"],
        description: 'Blue, Medium, Velvet, Glossy finish',
        brand: "Hirix",
        model: "HIR-11b"
      }
    ]
  },
  {
    id: 2,
    name: "Executive Office Chair with High Back, Adjustable Height",
    image: "https://hirixdirect.co.uk/uploads/products/679cd99babae3_2051974507.jpg",
    price: 159.99,
    oldPrice: 219.99,
    rating: 4.2,
    reviewCount: 28,
    category: "Home Office",
    subcategory: "Chairs",
    color: "Black",
    material: "Leather",
    brand: "Hirix",
    model: "HIR-200",
    description: "Experience premium comfort with this ergonomic office chair, featuring adjustable height, tilt mechanism, and padded armrests.",
    newArrival: false,
    inventory: 5
  },
  {
    id: 3,
    name: "Patio Garden 3-Seat Canopy Swing Chair",
    image: "https://hirixdirect.co.uk/uploads/products/665f2f1db56bb_779944139.jpg",
    price: 229.99,
    oldPrice: 299.99,
    rating: 4.8,
    reviewCount: 35,
    category: "Outdoor",
    subcategory: "Swing Chairs",
    color: "Beige",
    material: "Metal",
    brand: "Hirix",
    model: "HIR-300",
    description: "Enjoy your outdoor space with this comfortable 3-seat swing chair featuring a weather-resistant canopy and sturdy metal frame.",
    newArrival: false,
    inventory: 7
  },
  {
    id: 4,
    name: "5-Drawer Wooden Dresser Chest of Drawers",
    image: "https://hirixdirect.co.uk/uploads/products/6644c5b92903e_2073829686.jpeg",
    price: 189.99,
    oldPrice: 249.99,
    rating: 4.3,
    reviewCount: 21,
    category: "Bedroom",
    subcategory: "Chests",
    color: "Brown",
    material: "Wood",
    brand: "Hirix",
    model: "HIR-400",
    description: "This elegant 5-drawer chest offers ample storage space for your clothes and accessories, with smooth gliding drawers and solid wood construction.",
    newArrival: false,
    inventory: 3
  },
  {
    id: 5,
    name: "Garden Metal Raised Bed Planter Box",
    image: "https://hirixdirect.co.uk/uploads/products/665608bac0098_338816904.jpg",
    price: 79.99,
    oldPrice: 119.99,
    rating: 4.1,
    reviewCount: 18,
    category: "Garden",
    subcategory: "Planter Boxes",
    color: "Black",
    material: "Metal",
    brand: "Hirix",
    model: "HIR-500",
    description: "Perfect for urban gardeners, this raised planter box provides optimal drainage and growing conditions for your plants and vegetables.",
    newArrival: false,
    inventory: 12
  },
  {
    id: 6,
    name: "Outdoor Patio Fire Pit Table with BBQ Grill",
    image: "https://hirixdirect.co.uk/uploads/products/665dd8fdcde88_355312991.jpg",
    price: 159.99,
    oldPrice: 199.99,
    rating: 4.6,
    reviewCount: 32,
    category: "Garden",
    subcategory: "Fire Pits",
    color: "Black",
    material: "Metal",
    brand: "Hirix",
    model: "HIR-600",
    description: "Transform your patio with this multifunctional fire pit table that doubles as a BBQ grill, perfect for outdoor entertaining all year round.",
    newArrival: false,
    inventory: 0
  }
];
  