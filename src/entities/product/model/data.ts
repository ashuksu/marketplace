import type { Product } from './types';

export const products: Product[] = [
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
];
