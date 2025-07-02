/**
 * Authentication debugging utilities
 */

export const debugAuth = {
  /**
   * Check if token exists and is valid format
   */
  checkToken: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('🔴 No token found in localStorage');
      return { valid: false, reason: 'NO_TOKEN' };
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('🔴 Token format invalid - not a JWT');
        return { valid: false, reason: 'INVALID_FORMAT' };
      }

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      
      console.log('🔍 Token payload:', {
        id: payload.id,
        userId: payload.userId,
        role: payload.role,
        userType: payload.userType,
        issuedAt: new Date(payload.iat * 1000).toISOString(),
        expiresAt: new Date(payload.exp * 1000).toISOString(),
        isExpired: payload.exp < currentTime,
        allFields: payload
      });

      if (payload.exp < currentTime) {
        console.log('🔴 Token is expired');
        return { valid: false, reason: 'EXPIRED', payload };
      }

      console.log('✅ Token is valid');
      return { valid: true, payload };
    } catch (error) {
      console.log('🔴 Error decoding token:', error);
      return { valid: false, reason: 'DECODE_ERROR', error };
    }
  },

  /**
   * Check user data in localStorage
   */
  checkUser: () => {
    const user = localStorage.getItem('user');
    if (!user) {
      console.log('🔴 No user data in localStorage');
      return { exists: false };
    }

    try {
      const userData = JSON.parse(user);
      console.log('👤 User data:', {
        id: userData.id,
        email: userData.email,
        userType: userData.userType,
        firstName: userData.first_name,
        lastName: userData.last_name
      });
      return { exists: true, data: userData };
    } catch (error) {
      console.log('🔴 Error parsing user data:', error);
      return { exists: false, error };
    }
  },

  /**
   * Test authentication with backend
   */
  testBackendAuth: async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:3005/api/auth/debug', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('🔍 Backend auth debug:', data);
      return data;
    } catch (error) {
      console.log('🔴 Error testing backend auth:', error);
      return { error: error.message };
    }
  },

  /**
   * Test database connectivity and data
   */
  testDatabaseData: async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:3005/api/debug/data', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('🔍 Database debug:', data);
      return data;
    } catch (error) {
      console.log('🔴 Error testing database:', error);
      return { error: error.message };
    }
  },

  /**
   * Run comprehensive authentication check
   */
  runFullCheck: async () => {
    console.log('🔍 Starting comprehensive authentication check...');
    
    const tokenCheck = debugAuth.checkToken();
    const userCheck = debugAuth.checkUser();
    const backendCheck = await debugAuth.testBackendAuth();
    const databaseCheck = await debugAuth.testDatabaseData();

    const summary = {
      token: tokenCheck,
      user: userCheck,
      backend: backendCheck,
      database: databaseCheck,
      timestamp: new Date().toISOString()
    };

    console.log('📊 Authentication check summary:', summary);
    return summary;
  }
};

// Add to window for browser console access
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
}

export default debugAuth;
