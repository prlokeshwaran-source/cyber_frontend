import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const authState = useContext(AuthContext);
  if (!authState) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return authState;
}
