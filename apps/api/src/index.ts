import http from 'node:http';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';

import { products } from './data/products';
import { cart } from './data/cart';

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

function getFormattedCart() {
  return cart.flatMap((cartItem) => {
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
}

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  io.emit('online:count', io.engine.clientsCount);

  socket.on('disconnect', () => {
    io.emit('online:count', io.engine.clientsCount);
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/cart', (_req, res) => {
  res.json(getFormattedCart());
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

  res.status(201).json(getFormattedCart());
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

  res.json(getFormattedCart());
});

app.delete('/cart/:id', (req, res) => {
  const productId = req.params.id;
  const itemIndex = cart.findIndex((item) => item.productId === productId);

  if (itemIndex === -1) {
    res.status(404).json({
      message: 'Cart item not found',
    });
    return;
  }

  cart.splice(itemIndex, 1);

  res.json(getFormattedCart());
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

server.listen(PORT, () => {
  console.log(`API & Socket server running on http://localhost:${PORT}`);
});
