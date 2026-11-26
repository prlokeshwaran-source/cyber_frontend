import { createContext, useCallback, useMemo, useState } from 'react';
import { validateCredentials } from '../services/authService';
import { ensureCustomerSigningKey } from '../services/customerSigningService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [credentials, setCredentials] = useState(null);

  const signIn = useCallback(async (newCredentials) => {
    const accountList = await validateCredentials(newCredentials);
    await ensureCustomerSigningKey(newCredentials);
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

