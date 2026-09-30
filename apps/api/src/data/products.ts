export type ServerProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
};

export const products: ServerProduct[] = [
  {
    id: '1',
    title: 'Wireless Headphones',
    description: 'Comfortable wireless headphones with active noise cancellation.',
    price: 149,
    image: '/products/headphones.jpg',
    category: 'Audio',
    rating: 4.8,
    stock: 12,
  },
  {
    id: '2',
    title: 'Mechanical Keyboard',
    description: 'Compact mechanical keyboard for work and gaming.',
    price: 99,
    image: '/products/keyboard.jpg',
    category: 'Accessories',
    rating: 4.6,
    stock: 8,
  },
  {
    id: '3',
    title: 'Smart Desk Lamp',
    description: 'Minimal smart lamp with adjustable brightness and temperature.',
    price: 79,
    image: '/products/lamp.jpg',
    category: 'Home',
    rating: 4.5,
    stock: 15,
  },
  {
    id: '4',
    title: 'Ergonomic Chair',
    description: 'Adjustable ergonomic chair designed for long working sessions.',
    price: 399,
    image: '/products/chair.jpg',
    category: 'Furniture',
    rating: 4.9,
    stock: 5,
  },
  {
    id: '5',
    title: '4K Monitor',
    description: '27-inch 4K monitor with a sharp image and slim design.',
    price: 449,
    image: '/products/monitor.jpg',
    category: 'Electronics',
    rating: 4.7,
    stock: 7,
  },
  {
    id: '6',
    title: 'Wireless Mouse',
    description: 'Lightweight wireless mouse with precise tracking.',
    price: 59,
    image: '/products/mouse.jpg',
    category: 'Accessories',
    rating: 4.4,
    stock: 20,
  },
  {
    id: '7',
    title: 'Portable Speaker',
    description: 'Compact Bluetooth speaker with clear sound and long battery life.',
    price: 89,
    image: '/products/speaker.jpg',
    category: 'Audio',
    rating: 4.6,
    stock: 11,
  },
  {
    id: '8',
    title: 'Smart Coffee Maker',
    description: 'Programmable coffee maker with a simple smart control system.',
    price: 129,
    image: '/products/coffee-maker.jpg',
    category: 'Home',
    rating: 4.3,
    stock: 9,
  },
  {
    id: '9',
    title: 'Standing Desk',
    description: 'Height-adjustable desk for comfortable work throughout the day.',
    price: 499,
    image: '/products/standing-desk.jpg',
    category: 'Furniture',
    rating: 4.8,
    stock: 4,
  },
  {
    id: '10',
    title: 'USB-C Dock',
    description: 'Multi-port USB-C dock for displays, charging and peripherals.',
    price: 119,
    image: '/products/usb-c-dock.jpg',
    category: 'Electronics',
    rating: 4.5,
    stock: 14,
  },
];
