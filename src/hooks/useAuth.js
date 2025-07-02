import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Ensure userId is consistently available
  if (context.user && !context.user.userId && context.user.id) {
    context.user.userId = context.user.id;
  }
  
  // Check if token is still valid
  const token = localStorage.getItem('token');
  if (token && context.user) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token expired, logging out user');
        context.logout();
      }
    } catch (error) {
      console.error('Error checking token validity:', error);
      context.logout();
    }
  }
  
  return context;
};