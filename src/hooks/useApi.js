import { useCallback, useState } from 'react';

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const execute = useCallback(async (requestFunction, ...requestArguments) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      return await requestFunction(...requestArguments);
    } catch (error) {
      setErrorMessage(error.message || 'The request failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { execute, isLoading, errorMessage, setErrorMessage };
}
