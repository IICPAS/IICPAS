// Wishlist Event Manager
interface WishlistEvent {
  studentId: string;
  courseId: string;
  action: 'added' | 'removed';
}

type WishlistEventListener = (event: WishlistEvent) => void;

class WishlistEventManager {
  private listeners: Set<WishlistEventListener>;

  constructor() {
    this.listeners = new Set();
  }

  // Subscribe to wishlist changes
  subscribe(callback: WishlistEventListener): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of wishlist changes
  notifyChange(studentId: string, courseId: string, action: 'added' | 'removed'): void {
    this.listeners.forEach(callback => {
      try {
        callback({ studentId, courseId, action });
      } catch (error) {
        console.error('Error in wishlist event listener:', error);
      }
    });
  }

  // Clear all listeners
  clear(): void {
    this.listeners.clear();
  }
}

// Create global instance
const wishlistEventManager = new WishlistEventManager();

export default wishlistEventManager;
