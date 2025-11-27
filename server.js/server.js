// server.js

const express = require('express');
const cors = require('cors');
const path = require('path'); // Used for serving static files
const app = express();
const port = 3000;

// --- Middleware ---
// Allows frontend (running from file or another port) to access the API
app.use(cors()); 
// To parse JSON bodies from POST/PATCH requests
app.use(express.json()); 
// Serve the index.html and associated files directly from the root path
app.use(express.static(path.join(__dirname))); 

// --- In-Memory Data Store (Simulating a Database) ---
let nextOrderId = 1001;
const restaurantsData = [
    {
        id: 1,
        name: "KFC - Crispy & Hot",
        menu: [
            { id: 1, name: "Zinger Burger", price: 150 },
            { id: 2, name: "Hot Wings (6 Pcs)", price: 200 },
            { id: 3, name: "Chicken Bucket (Small)", price: 450 }
        ]
    },
    {
        id: 2,
        name: "Dominos - Pizza Hub",
        menu: [
            { id: 1, name: "Cheese Burst Pizza (Medium)", price: 350 },
            { id: 2, name: "Garlic Bread Sticks", price: 120 },
            { id: 3, name: "Pasta Italiano (Red Sauce)", price: 220 }
        ]
    }
];

let ordersData = []; // Stores placed orders

// --- API Endpoints ---

// 1. GET /api/restaurants (Get all restaurants)
app.get('/api/restaurants', (req, res) => {
    const simpleRestaurants = restaurantsData.map(r => ({ id: r.id, name: r.name }));
    res.json(simpleRestaurants);
});

// 2. GET /api/restaurants/:id/menu (Get menu for a specific restaurant)
app.get('/api/restaurants/:id/menu', (req, res) => {
    const id = parseInt(req.params.id);
    const restaurant = restaurantsData.find(r => r.id === id);
    if (restaurant) {
        res.json(restaurant.menu);
    } else {
        res.status(404).send({ message: 'Restaurant not found' });
    }
});

// 3. POST /api/orders (Place a new order)
app.post('/api/orders', (req, res) => {
    const { items, total, restaurantId } = req.body;
    if (!items || items.length === 0 || !total || !restaurantId) {
        return res.status(400).send({ message: 'Missing order details.' });
    }
    
    const newOrder = {
        id: nextOrderId++,
        restaurantId,
        items,
        total,
        status: "Order Placed",
        timestamp: new Date().toISOString()
    };
    
    ordersData.push(newOrder);
    res.status(201).json({ 
        message: 'Order successfully placed', 
        orderId: newOrder.id,
        status: newOrder.status
    });
});

// 4. GET /api/orders/:id (Track order status)
app.get('/api/orders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const order = ordersData.find(o => o.id === id);
    
    if (order) {
        res.json({ id: order.id, status: order.status, total: order.total });
    } else {
        res.status(404).send({ message: 'Order not found' });
    }
});

// 5. PATCH /api/orders/:id/update-status (Simulates status change)
app.patch('/api/orders/:id/update-status', (req, res) => {
    const id = parseInt(req.params.id);
    const order = ordersData.find(o => o.id === id);
    const statuses = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];
    
    if (!order) {
        return res.status(404).send({ message: 'Order not found' });
    }
    
    let index = statuses.indexOf(order.status);
    if (index < statuses.length - 1) {
        order.status = statuses[index + 1];
    }
    
    res.json({ id: order.id, newStatus: order.status });
});

// Start the Server
app.listen(port, () => {
    console.log(`Backend server running and serving files at http://localhost:${port}`);
    console.log(`Open the frontend here: http://localhost:${port}/index.html`);
});