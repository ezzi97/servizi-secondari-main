import { useState, useCallback } from 'react';

interface UseAsyncActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface UseAsyncActionReturn<T, A extends any[]> {
  execute: (...args: A) => Promise<T | undefined>;
  isLoading: boolean;
  error: Error | null;
  data: T | null;
  reset: () => void;
}

export function useAsyncAction<T, A extends any[]>(
  action: (...args: A) => Promise<T>,
  options: UseAsyncActionOptions<T> = {}
): UseAsyncActionReturn<T, A> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (...args: A): Promise<T | undefined> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await action(...args);
        setData(result);

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);

        if (options.onError) {
          options.onError(error);
        }

        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [action, options]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    data,
    reset,
  };
}

