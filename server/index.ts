import cors from 'cors';
import express from 'express';

import { products } from './data/products';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
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
