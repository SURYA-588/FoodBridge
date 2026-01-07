
import { User, FoodPost, UserRole, PostStatus, FoodType } from '../types';

// Storage keys for local persistence
const USERS_KEY = 'fsc_users';
const POSTS_KEY = 'fsc_posts';
const AUTH_KEY = 'fsc_auth';

export const mockApi = {
  // Auth
  register: (userData: Partial<User>) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const newUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      isVerified: userData.role === UserRole.ADMIN,
    } as User;
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  login: (email: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User) => u.email === email);
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error('User not found');
  },

  getCurrentUser: (): User | null => {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Food Posts
  getPosts: (filters?: { district?: string; type?: FoodType; status?: PostStatus }): FoodPost[] => {
    let posts: FoodPost[] = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    
    // Auto-expiry check
    const now = new Date();
    posts = posts.map(post => {
      if (post.status === PostStatus.AVAILABLE && new Date(post.expiryTime) < now) {
        return { ...post, status: PostStatus.EXPIRED };
      }
      return post;
    });
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));

    if (filters) {
      if (filters.district) posts = posts.filter(p => p.district === filters.district);
      if (filters.type) posts = posts.filter(p => p.type === filters.type);
      if (filters.status) posts = posts.filter(p => p.status === filters.status);
    }
    return posts;
  },

  addPost: (post: Omit<FoodPost, 'id' | 'status' | 'createdAt'>) => {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    const newPost: FoodPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      status: PostStatus.AVAILABLE,
      createdAt: new Date().toISOString(),
    };
    posts.push(newPost);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return newPost;
  },

  collectPost: (postId: string, ngoId: string, ngoName: string) => {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    const index = posts.findIndex((p: FoodPost) => p.id === postId);
    if (index !== -1) {
      posts[index].status = PostStatus.COLLECTED;
      posts[index].ngoId = ngoId;
      posts[index].ngoName = ngoName;
      posts[index].collectedAt = new Date().toISOString();
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  deletePost: (postId: string) => {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    const filtered = posts.filter((p: FoodPost) => p.id !== postId);
    localStorage.setItem(POSTS_KEY, JSON.stringify(filtered));
  },

  getStats: () => {
    const posts: FoodPost[] = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    return {
      totalMealsServed: posts.filter(p => p.status === PostStatus.COLLECTED).reduce((acc, p) => acc + p.quantity, 0),
      activeDonations: posts.filter(p => p.status === PostStatus.AVAILABLE).length,
      totalDonors: users.filter(u => u.role === UserRole.PROVIDER).length,
      activeNGOs: users.filter(u => u.role === UserRole.NGO).length,
    };
  }
};
