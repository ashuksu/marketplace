import cors from 'cors';
import express from 'express';

import { products } from './data/products';
import { cart } from './data/cart';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/cart', (_req, res) => {
  const cartItems = cart.flatMap((cartItem) => {
    const product = products.find((product) => product.id === cartItem.productId);

    if (!product) {
      return [];
    }

    return [
      {
        productId: cartItem.productId,
        title: product.title,
        price: product.price,
        quantity: cartItem.quantity,
      },
    ];
  });

  res.json(cartItems);
});

app.post('/cart', (req, res) => {
  const { productId, quantity } = req.body;

  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  const cartItems = cart.flatMap((cartItem) => {
    const product = products.find((product) => product.id === cartItem.productId);

    if (!product) {
      return [];
    }

    return [
      {
        productId: cartItem.productId,
        title: product.title,
        price: product.price,
        quantity: cartItem.quantity,
      },
    ];
  });

  res.status(201).json(cartItems);
});

app.patch('/cart/:id', (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;

  const cartItem = cart.find((item) => item.productId === productId);

  if (!cartItem) {
    res.status(404).json({
      message: 'Cart item not found',
    });
    return;
  }

  if (quantity <= 0) {
    const itemIndex = cart.findIndex((item) => item.productId === productId);

    cart.splice(itemIndex, 1);
  } else {
    cartItem.quantity = quantity;
  }

  const cartItems = cart.flatMap((cartItem) => {
    const product = products.find((product) => product.id === cartItem.productId);

    if (!product) {
      return [];
    }

    return [
      {
        productId: cartItem.productId,
        title: product.title,
        price: product.price,
        quantity: cartItem.quantity,
      },
    ];
  });

  res.json(cartItems);
});

app.get('/products', (_req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    res.status(404).json({
      message: 'Product not found',
    });
    return;
  }

  res.json(product);
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
