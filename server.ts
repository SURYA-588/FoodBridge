
/**
 * FOODBRIDGE BACKEND SERVER
 * Node.js + Express + MongoDB Atlas
 */

import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. DATABASE CONNECTION
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://foodbridge_admin:secure_password@cluster0.mongodb.net/foodbridge_db";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("-----------------------------------------");
    console.log("✅ MongoDB Connection Success");
    console.log("📡 Connected DB:", mongoose.connection.name);
    console.log("📁 Collection: FoodPosts");
    console.log("-----------------------------------------");
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. FOOD POST SCHEMA
const foodPostSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerName: String,
  foodItems: { type: String, required: true },
  type: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
  quantity: Number,
  district: { type: String, required: true },
  location: String,
  expiryTime: Date,
  contactNumber: String,
  status: { type: String, enum: ['Available', 'Collected', 'Expired'], default: 'Available' },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ngoName: String,
  collectedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const FoodPost = mongoose.model('FoodPost', foodPostSchema);

// 3. AUTH MIDDLEWARE (IDENTITY ONLY)
const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user; // ONLY attach user identity, DO NOT filter data yet
    next();
  });
};

// 4. GET FOOD API (CORRECTED FOR GLOBAL SYNC)
app.get('/api/food/all', async (req: Request, res: Response) => {
  try {
    const { district, type } = req.query;
    
    // BUILD GLOBAL QUERY: 
    // Status must be Available. 
    // DO NOT filter by req.user.id or req.user.email.
    const query: any = { status: "Available" };
    
    if (district) query.district = district;
    if (type) query.type = type;

    const posts = await FoodPost.find(query).sort({ createdAt: -1 });
    
    console.log(`[API] GET /api/food/all | Found: ${posts.length} available posts`);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching food" });
  }
});

// 5. CREATE FOOD API (WRITE TO GLOBAL DB)
app.post('/api/food/create', authenticateToken, async (req: any, res: Response) => {
  try {
    const postData = {
      ...req.body,
      providerId: req.user.id, // Identify owner for management, not visibility
      status: "Available"
    };

    const newPost = new FoodPost(postData);
    const savedPost = await newPost.save();
    
    console.log("-----------------------------------------");
    console.log("🎁 NEW FOOD POST CREATED");
    console.log("🆔 ID:", savedPost._id);
    console.log("📍 District:", savedPost.district);
    console.log("-----------------------------------------");
    
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: "Error saving food post" });
  }
});

// 6. COLLECTION API (NGO CLAIM)
app.patch('/api/food/collect/:id', authenticateToken, async (req: any, res: Response) => {
  try {
    const post = await FoodPost.findByIdAndUpdate(
      req.params.id,
      { 
        status: "Collected", 
        ngoId: req.user.id, 
        ngoName: req.body.ngoName,
        collectedAt: new Date()
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: "Collection failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 FoodBridge Backend running on port ${PORT}`));
