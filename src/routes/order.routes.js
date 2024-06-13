// src/routes/order.routes.js

// src/routes/order.routes.js
import express from 'express';
import { createOrder} from '../controllers/order.controller.js';


const router = express.Router();

// Apply the authentication middleware to the order route
router.post('/', createOrder);

export default router;

