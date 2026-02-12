import { useEffect, useCallback } from 'react';

interface UseUnsavedChangesOptions {
  isDirty: boolean;
  message?: string;
}

/**
 * Hook to warn users about unsaved changes when they try to leave the page.
 * Uses the browser's beforeunload event for tab close/refresh.
 * Note: For in-app navigation blocking, migrate to createBrowserRouter (data router).
 */
export function useUnsavedChanges({ 
  isDirty, 
  message = 'Hai modifiche non salvate. Sei sicuro di voler uscire?' 
}: UseUnsavedChangesOptions) {
  // Handle browser close/refresh
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
      return undefined;
    },
    [isDirty, message]
  );

  useEffect(() => {
    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, handleBeforeUnload]);

  // These are no-ops for now since BrowserRouter doesn't support useBlocker
  // To enable in-app navigation blocking, migrate to createBrowserRouter
  const confirmLeave = useCallback(() => {}, []);
  const cancelLeave = useCallback(() => {}, []);

  return {
    isBlocked: false,
    confirmLeave,
    cancelLeave,
  };
}

