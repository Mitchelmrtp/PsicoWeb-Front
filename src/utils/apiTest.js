/**
 * Test API endpoints for debugging
 */

const API_BASE = 'http://localhost:3005/api';

export const testAPI = {
  /**
   * Test sessions endpoint
   */
  testSessions: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      console.log('🧪 Testing sessions endpoint...');
      
      // Test basic sessions call
      const response = await fetch(`${API_BASE}/sesiones`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📅 Sessions response:', data);

      // Test with filters
      const today = new Date().toISOString().split('T')[0];
      const filteredResponse = await fetch(`${API_BASE}/sesiones?startDate=${today}&estado=programada`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const filteredData = await filteredResponse.json();
      console.log('📅 Filtered sessions response:', filteredData);

      return { all: data, filtered: filteredData };
    } catch (error) {
      console.error('❌ Error testing sessions:', error);
      return { error: error.message };
    }
  },

  /**
   * Test psychologist patients endpoint
   */
  testPsychologistPatients: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      console.log('🧪 Testing psychologist patients endpoint...');
      
      const response = await fetch(`${API_BASE}/psicologos/pacientes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('👥 Psychologist patients response:', data);

      return data;
    } catch (error) {
      console.error('❌ Error testing psychologist patients:', error);
      return { error: error.message };
    }
  },

  /**
   * Test all psychologists endpoint
   */
  testAllPsychologists: async () => {
    const token = localStorage.getItem('token');
    
    try {
      console.log('🧪 Testing all psychologists endpoint...');
      
      const response = await fetch(`${API_BASE}/psicologos`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('👨‍⚕️ All psychologists response:', data);

      return data;
    } catch (error) {
      console.error('❌ Error testing psychologists:', error);
      return { error: error.message };
    }
  },

  /**
   * Run all tests
   */
  runAllTests: async () => {
    console.log('🔬 Starting comprehensive API tests...');
    
    const results = {
      sessions: await testAPI.testSessions(),
      psychologistPatients: await testAPI.testPsychologistPatients(),
      allPsychologists: await testAPI.testAllPsychologists(),
      timestamp: new Date().toISOString()
    };

    console.log('📊 API Test Results:', results);
    return results;
  }
};

// Add to window for browser console access
if (typeof window !== 'undefined') {
  window.testAPI = testAPI;
}

export default testAPI;
