// Import the backend canister
// Note: This will be generated during the build process
const tech_team_backend = {
  register: async (email, password) => {
    console.log('Mock register called with:', email);
    // For testing purposes, simulate a successful registration
    return { ok: { email, createdAt: Date.now() } };
  },
  
  login: async (email, password) => {
    console.log('Mock login called with:', email);
    // For testing purposes, simulate a successful login
    const token = `mock-token-${Date.now()}`;
    return { 
      ok: { 
        userId: email, 
        token, 
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 
      } 
    };
  },
  
  validateSession: async (token) => {
    console.log('Mock validateSession called with:', token);
    return true;
  },
  
  getUserProfile: async (token) => {
    console.log('Mock getUserProfile called with:', token);
    const userId = localStorage.getItem('thapar_user') ? 
      JSON.parse(localStorage.getItem('thapar_user')).email : 
      'user@thapar.edu';
    
    return { ok: { email: userId, createdAt: Date.now() - 1000000 } };
  },
  
  logout: async (token) => {
    console.log('Mock logout called with:', token);
    return true;
  }
};

// Local storage keys
const TOKEN_KEY = 'thapar_auth_token';
const USER_KEY = 'thapar_user';

/**
 * Service for handling authentication with the Motoko backend
 */
export const authService = {
  /**
   * Register a new user
   * @param {string} email - User email (must be a Thapar email)
   * @param {string} password - User password
   * @returns {Promise<Object>} - User profile or error
   */
  async register(email, password) {
    try {
      const result = await tech_team_backend.register(email, password);
      
      if ('ok' in result) {
        return { success: true, data: result.ok };
      } else if ('err' in result) {
        return { success: false, error: result.err };
      }
      
      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to register. Please try again.' 
      };
    }
  },
  
  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Session data or error
   */
  async login(email, password) {
    try {
      const result = await tech_team_backend.login(email, password);
      
      if ('ok' in result) {
        const session = result.ok;
        
        // Store session token and user info in local storage
        localStorage.setItem(TOKEN_KEY, session.token);
        localStorage.setItem(USER_KEY, JSON.stringify({ 
          email: session.userId,
          sessionExpiry: session.expiresAt
        }));
        
        return { success: true, data: session };
      } else if ('err' in result) {
        return { success: false, error: result.err };
      }
      
      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to login. Please try again.' 
      };
    }
  },
  
  /**
   * Logout the current user
   * @returns {Promise<boolean>} - Success status
   */
  async logout() {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (token) {
        await tech_team_backend.logout(token);
      }
      
      // Clear local storage regardless of backend response
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Still clear local storage even if backend logout fails
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      return false;
    }
  },
  
  /**
   * Check if the current session is valid
   * @returns {Promise<boolean>} - Whether the session is valid
   */
  async isAuthenticated() {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (!token) {
        return false;
      }
      
      const isValid = await tech_team_backend.validateSession(token);
      
      if (!isValid) {
        // Clear invalid session data
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
      
      return isValid;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  },
  
  /**
   * Get the current user's profile
   * @returns {Promise<Object|null>} - User profile or null if not authenticated
   */
  async getCurrentUser() {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (!token) {
        return null;
      }
      
      const result = await tech_team_backend.getUserProfile(token);
      
      if ('ok' in result) {
        return result.ok;
      }
      
      // Clear invalid session data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  },
  
  /**
   * Get the current user from local storage (no backend call)
   * @returns {Object|null} - User data or null if not found
   */
  getLocalUser() {
    try {
      const userJson = localStorage.getItem(USER_KEY);
      
      if (!userJson) {
        return null;
      }
      
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Get local user error:', error);
      return null;
    }
  },
  
  /**
   * Get the authentication token
   * @returns {string|null} - Auth token or null if not found
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
};

export default authService;
