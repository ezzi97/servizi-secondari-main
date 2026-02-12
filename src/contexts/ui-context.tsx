import type { ReactNode } from 'react';

import { useMemo, useState, useContext, useCallback, createContext } from 'react';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
}

interface UIContextValue extends UIState {
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebarCollapse: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UIState>({
    sidebarOpen: true,
    sidebarCollapsed: false,
    mobileMenuOpen: false,
  });

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  const openSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: true }));
  }, []);

  const closeSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarOpen: false }));
  }, []);

  const toggleSidebarCollapse = useCallback(() => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setState(prev => ({ ...prev, mobileMenuOpen: !prev.mobileMenuOpen }));
  }, []);

  const closeMobileMenu = useCallback(() => {
    setState(prev => ({ ...prev, mobileMenuOpen: false }));
  }, []);

  const value = useMemo<UIContextValue>(() => ({
    ...state,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    toggleSidebarCollapse,
    toggleMobileMenu,
    closeMobileMenu,
  }), [state, toggleSidebar, openSidebar, closeSidebar, toggleSidebarCollapse, toggleMobileMenu, closeMobileMenu]);

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

