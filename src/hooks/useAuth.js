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
  
  return context;
};