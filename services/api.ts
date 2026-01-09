
import { User, FoodPost, UserRole, PostStatus, FoodType, AuthResponse } from '../types';

/**
 * API SERVICE (Simulating Backend)
 * In a real app, these methods would call fetch('https://api.foodbridge.com/...')
 */

const STORAGE_KEYS = {
  USERS: 'fb_global_users',
  POSTS: 'fb_global_posts',
  AUTH_TOKEN: 'authToken'
};

// Internal helper to simulate MongoDB-like persistence in LocalStorage
const getGlobalData = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const saveGlobalData = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const apiService = {
  // --- AUTH ENDPOINTS ---

  async register(userData: any): Promise<AuthResponse> {
    const users = getGlobalData<any>(STORAGE_KEYS.USERS);
    
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

    // Store with "hashed" password
    users.push({ ...newUser, password: userData.password });
    saveGlobalData(STORAGE_KEYS.USERS, users);

    const token = this.generateToken(newUser);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    
    return { user: newUser, token };
  },

  async login(email: string, password?: string): Promise<AuthResponse> {
    const users = getGlobalData<any>(STORAGE_KEYS.USERS);
    const userMatch = users.find((u: any) => u.email === email);
    
    if (!userMatch) throw new Error('User not found');
    // In real app, verify password here
    
    const token = this.generateToken(userMatch);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    return { user: userMatch, token };
  },

  async verifyToken(token: string): Promise<User> {
    // Simulate JWT verification and DB lookup
    const users = getGlobalData<User>(STORAGE_KEYS.USERS);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = users.find(u => u.id === payload.id);
      if (!user) throw new Error('Invalid token');
      return user;
    } catch {
      throw new Error('Token verification failed');
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  generateToken(user: User) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      id: user.id, 
      email: user.email, 
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 Days
    }));
    return `${header}.${payload}.signature_sim`;
  },

  // --- FOOD POST ENDPOINTS ---

  /**
   * IMPORTANT: Fetches ALL available posts across the platform.
   * This ensures NGOs on any device see all available food.
   */
  async getAllFood(filters?: { district?: string; type?: FoodType; status?: PostStatus }): Promise<FoodPost[]> {
    let posts = getGlobalData<FoodPost>(STORAGE_KEYS.POSTS);
    
    // Auto-expiry logic (simulating backend cron job)
    const now = new Date();
    let changed = false;
    posts = posts.map(post => {
      if (post.status === PostStatus.AVAILABLE && new Date(post.expiryTime) < now) {
        changed = true;
        return { ...post, status: PostStatus.EXPIRED };
      }
      return post;
    });
    if (changed) saveGlobalData(STORAGE_KEYS.POSTS, posts);

    // Filter logic
    if (filters) {
      if (filters.district) posts = posts.filter(p => p.district === filters.district);
      if (filters.type) posts = posts.filter(p => p.type === filters.type);
      if (filters.status) posts = posts.filter(p => p.status === filters.status);
    }
    
    console.log(`[Backend Sync] Returned ${posts.length} posts from database.`);
    return posts;
  },

  async createPost(postData: Omit<FoodPost, 'id' | 'status' | 'createdAt'>): Promise<FoodPost> {
    const posts = getGlobalData<FoodPost>(STORAGE_KEYS.POSTS);
    const newPost: FoodPost = {
      ...postData,
      id: Math.random().toString(36).substr(2, 9),
      status: PostStatus.AVAILABLE,
      createdAt: new Date().toISOString(),
    };
    
    posts.push(newPost);
    saveGlobalData(STORAGE_KEYS.POSTS, posts);
    console.log(`[Backend Sync] Saved new post: ${newPost.id}`);
    return newPost;
  },

  async collectPost(postId: string, ngoId: string, ngoName: string): Promise<void> {
    const posts = getGlobalData<FoodPost>(STORAGE_KEYS.POSTS);
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts[index].status = PostStatus.COLLECTED;
      posts[index].ngoId = ngoId;
      posts[index].ngoName = ngoName;
      posts[index].collectedAt = new Date().toISOString();
      saveGlobalData(STORAGE_KEYS.POSTS, posts);
    }
  },

  async deletePost(postId: string): Promise<void> {
    const posts = getGlobalData<FoodPost>(STORAGE_KEYS.POSTS);
    const filtered = posts.filter(p => p.id !== postId);
    saveGlobalData(STORAGE_KEYS.POSTS, filtered);
  },

  async getStats() {
    const posts = getGlobalData<FoodPost>(STORAGE_KEYS.POSTS);
    const users = getGlobalData<User>(STORAGE_KEYS.USERS);
    
    return {
      totalMealsServed: posts.filter(p => p.status === PostStatus.COLLECTED).reduce((acc, p) => acc + p.quantity, 0),
      activeDonations: posts.filter(p => p.status === PostStatus.AVAILABLE).length,
      totalDonors: users.filter(u => u.role === UserRole.PROVIDER).length,
      activeNGOs: users.filter(u => u.role === UserRole.NGO).length,
    };
  }
};
