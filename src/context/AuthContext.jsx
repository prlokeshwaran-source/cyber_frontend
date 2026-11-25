import { createContext, useCallback, useMemo, useState } from 'react';
import { validateCredentials } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [credentials, setCredentials] = useState(null);

  const signIn = useCallback(async (newCredentials) => {
    const accountList = await validateCredentials(newCredentials);
    setCredentials(newCredentials);
    return accountList;
  }, []);

  const signOut = useCallback(() => {
    setCredentials(null);
  }, []);

  const authContextValue = useMemo(
    () => ({ credentials, signIn, signOut }),
    [credentials, signIn, signOut],
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

