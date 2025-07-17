const mockCategories = [
  {
    id: '1',
    name: 'Furniture',
    slug: 'furniture',
    image: 'https://hirixdirect.co.uk/uploads/products/66cf2d590d27a_715079015.jpg',
    link: '/category/furniture',
    subcategories: [
      { id: '1-1', name: 'Living Room', slug: 'living-room', link: '/category/furniture/living-room' },
      { id: '1-2', name: 'Bedroom', slug: 'bedroom', link: '/category/furniture/bedroom' },
      { id: '1-3', name: 'Dining Room', slug: 'dining-room', link: '/category/furniture/dining-room' },
      { id: '1-4', name: 'Office', slug: 'office', link: '/category/furniture/office' },
    ]
  },
  {
    id: '2',
    name: 'Outdoor',
    slug: 'outdoor',
    image: 'https://hirixdirect.co.uk/uploads/products/6811e709d73f3_1683636687.jpg',
    link: '/category/outdoor',
    subcategories: [
      { id: '2-1', name: 'Patio Furniture', slug: 'patio-furniture', link: '/category/outdoor/patio-furniture' },
      { id: '2-2', name: 'Garden', slug: 'garden', link: '/category/outdoor/garden' },
      { id: '2-3', name: 'Grills', slug: 'grills', link: '/category/outdoor/grills' },
    ]
  },
  {
    id: '3',
    name: 'Home Decor',
    slug: 'home-decor',
    image: 'https://hirixdirect.co.uk/uploads/products/679cd9423ad0e_1908007584.jpg',
    link: '/category/home-decor',
    subcategories: [
      { id: '3-1', name: 'Rugs', slug: 'rugs', link: '/category/home-decor/rugs' },
      { id: '3-2', name: 'Lighting', slug: 'lighting', link: '/category/home-decor/lighting' },
      { id: '3-3', name: 'Wall Decor', slug: 'wall-decor', link: '/category/home-decor/wall-decor' },
    ]
  },
  {
    id: '4',
    name: 'Appliances',
    slug: 'appliances',
    image: 'https://hirixdirect.co.uk/uploads/products/683883bca61b0_1368959142.jpg',
    link: '/category/appliances',
    subcategories: [
      { id: '4-1', name: 'Kitchen', slug: 'kitchen', link: '/category/appliances/kitchen' },
      { id: '4-2', name: 'Laundry', slug: 'laundry', link: '/category/appliances/laundry' },
      { id: '4-3', name: 'Cleaning', slug: 'cleaning', link: '/category/appliances/cleaning' },
    ]
  },
  {
    id: '5',
    name: 'Electronics',
    slug: 'electric',
    image: 'https://hirixdirect.co.uk/uploads/products/6811e709d73f3_1683636687.jpg',
    link: '/category/electric',
    subcategories: [
      { id: '5-1', name: 'Air Fryer', slug: 'air-fryer', link: '/category/electric/air-fryer' },
      { id: '5-2', name: 'Mini Fridge', slug: 'mini-fridge', link: '/category/electric/mini-fridge' },
    ]
  },
  {
    id: '6',
    name: 'Sports',
    slug: 'sports',
    image: 'https://hirixdirect.co.uk/uploads/products/66cf2d590d27a_715079015.jpg',
    link: '/category/sports',
    subcategories: []
  },
  { id: '7', name: 'Sale', slug: 'sale', image: '', link: '/sale', subcategories: [] },
  { id: '8', name: 'Best Sellers', slug: 'best-sellers', image: '', link: '/best-sellers', subcategories: [] },
  { id: '9', name: 'New Arrivals', slug: 'new-arrivals', image: '', link: '/new-arrivals', subcategories: [] },
];

export default mockCategories; 