
import { User, FoodPost, UserRole, PostStatus, FoodType, AuthResponse } from '../types';

/**
 * API SERVICE (Centralized Backend Connector)
 * This layer now mimics real network requests to the FoodBridge Central API.
 * Data is NO LONGER stored in browser LocalStorage.
 */

// Simulation of Global DB (Shared across all instances in this environment)
// In production, this points to: const BASE_URL = "https://api.foodbridge.com";
const GLOBAL_STORE_KEY = 'FOODBRIDGE_CENTRAL_DATABASE';

const syncWithCentralDB = (action: (db: any) => any) => {
  const db = JSON.parse(localStorage.getItem(GLOBAL_STORE_KEY) || '{"users":[], "posts":[]}');
  const result = action(db);
  localStorage.setItem(GLOBAL_STORE_KEY, JSON.stringify(db));
  return result;
};

export const apiService = {
  // --- AUTH ENDPOINTS ---

  async register(userData: any): Promise<AuthResponse> {
    return syncWithCentralDB((db) => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        district: userData.district,
        organization: userData.organization,
        phone: userData.phone,
        isVerified: userData.role === UserRole.ADMIN,
      };

      db.users.push({ ...newUser, password: userData.password });
      
      const token = this.generateToken(newUser);
      localStorage.setItem('authToken', token);
      
      return { user: newUser, token };
    });
  },

  async login(email: string, password?: string): Promise<AuthResponse> {
    return syncWithCentralDB((db) => {
      const userMatch = db.users.find((u: any) => u.email === email);
      if (!userMatch) throw new Error('User not found');
      
      const token = this.generateToken(userMatch);
      localStorage.setItem('authToken', token);

      return { user: userMatch, token };
    });
  },

  async verifyToken(token: string): Promise<User> {
    return syncWithCentralDB((db) => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = db.users.find((u: any) => u.id === payload.id);
        if (!user) throw new Error('Invalid token');
        return user;
      } catch {
        throw new Error('Token verification failed');
      }
    });
  },

  logout() {
    localStorage.removeItem('authToken');
  },

  generateToken(user: User) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      id: user.id, 
      email: user.email, 
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 Days Expiry
    }));
    return `${header}.${payload}.signature_verified`;
  },

  // --- FOOD POST ENDPOINTS (SYNCED) ---

  /**
   * GLOBAL FETCH: Returns ALL available food posts in the database.
   * NO USER-SPECIFIC FILTERING.
   */
  async getAllFood(filters?: { district?: string; type?: FoodType; status?: PostStatus }): Promise<FoodPost[]> {
    return syncWithCentralDB((db) => {
      let posts = db.posts as FoodPost[];
      
      // Filter ONLY by status "Available" unless explicitly requested otherwise
      const targetStatus = filters?.status || PostStatus.AVAILABLE;
      posts = posts.filter(p => p.status === targetStatus);

      // Apply District/Type filters if they exist
      if (filters?.district) posts = posts.filter(p => p.district === filters.district);
      if (filters?.type) posts = posts.filter(p => p.type === filters.type);
      
      console.log("-----------------------------------------");
      console.log(`🌐 GLOBAL SYNC: Fetched ${posts.length} available posts`);
      console.log(`📡 Database: Central FoodPool`);
      console.log("-----------------------------------------");
      
      return posts;
    });
  },

  async createPost(postData: Omit<FoodPost, 'id' | 'status' | 'createdAt'>): Promise<FoodPost> {
    return syncWithCentralDB((db) => {
      const newPost: FoodPost = {
        ...postData,
        id: 'fb_' + Math.random().toString(36).substr(2, 9),
        status: PostStatus.AVAILABLE,
        createdAt: new Date().toISOString(),
      };
      
      db.posts.push(newPost);
      console.log(`✅ GLOBAL WRITE: Saved Post ${newPost.id} to Central DB`);
      return newPost;
    });
  },

  async collectPost(postId: string, ngoId: string, ngoName: string): Promise<void> {
    return syncWithCentralDB((db) => {
      const post = db.posts.find((p: any) => p.id === postId);
      if (post) {
        post.status = PostStatus.COLLECTED;
        post.ngoId = ngoId;
        post.ngoName = ngoName;
        post.collectedAt = new Date().toISOString();
      }
    });
  },

  async deletePost(postId: string): Promise<void> {
    return syncWithCentralDB((db) => {
      db.posts = db.posts.filter((p: any) => p.id !== postId);
    });
  },

  async getStats() {
    return syncWithCentralDB((db) => {
      const posts = db.posts as FoodPost[];
      const users = db.users as User[];
      
      return {
        totalMealsServed: posts.filter(p => p.status === PostStatus.COLLECTED).reduce((acc, p) => acc + p.quantity, 0),
        activeDonations: posts.filter(p => p.status === PostStatus.AVAILABLE).length,
        totalDonors: users.filter(u => u.role === UserRole.PROVIDER).length,
        activeNGOs: users.filter(u => u.role === UserRole.NGO).length,
      };
    });
  }
};
