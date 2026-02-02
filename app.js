import express from 'express';
import dotenv from 'dotenv';
import { dbConnect } from './config/dbConnect.js';
import productRouter from './routes/productRoutes.js';
import reportRouter from './routes/reportRoutes.js';

dotenv.config();
const app = express();
const PORT = 3000;

await dbConnect();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes
app.use('/api/products', productRouter);
app.use('/api/reports', reportRouter);


   //GLOBAL ERROR HANDLER
  
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
