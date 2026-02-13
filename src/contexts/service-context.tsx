import type { ReactNode } from 'react';
import type { Service, ServiceStats, ServiceFilters } from 'src/types';

import { useMemo, useState, useContext, useCallback, createContext } from 'react';

import { serviceService } from 'src/services';

interface ServiceState {
  services: Service[];
  total: number;
  currentService: Service | null;
  stats: ServiceStats | null;
  filters: ServiceFilters;
  isLoading: boolean;
  statsLoading: boolean;
  error: string | null;
}

interface ServiceContextValue extends ServiceState {
  fetchServices: (filters?: ServiceFilters) => Promise<void>;
  fetchService: (id: string) => Promise<void>;
  fetchStats: (filters?: ServiceFilters) => Promise<void>;
  createService: (data: Partial<Service>) => Promise<Service>;
  updateService: (id: string, data: Partial<Service>) => Promise<Service>;
  setFilters: (filters: ServiceFilters) => void;
  clearCurrentService: () => void;
}

const ServiceContext = createContext<ServiceContextValue | null>(null);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ServiceState>({
    services: [],
    total: 0,
    currentService: null,
    stats: null,
    filters: {},
    isLoading: false,
    statsLoading: false,
    error: null,
  });

  const fetchServices = useCallback(async (filters?: ServiceFilters) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await serviceService.getServices(filters);

      if (!response.success) {
        throw new Error(response.message || 'Errore nel caricamento dei servizi');
      }

      setState(prev => ({
        ...prev,
        services: response.data?.items || [],
        total: response.data?.total ?? 0,
        filters: filters || prev.filters,
        isLoading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Errore nel caricamento dei servizi',
        isLoading: false,
      }));
    }
  }, []);

  const fetchService = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await serviceService.getService(id);

      if (!response.success) {
        throw new Error(response.message || 'Servizio non trovato');
      }

      setState(prev => ({
        ...prev,
        currentService: response.data || null,
        isLoading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Errore nel caricamento del servizio',
        isLoading: false,
      }));
    }
  }, []);

  const fetchStats = useCallback(async (filters?: ServiceFilters) => {
    setState(prev => ({ ...prev, statsLoading: true }));
    try {
      const response = await serviceService.getStats(filters);

      if (response.success && response.data) {
        setState(prev => ({ ...prev, stats: response.data!, statsLoading: false }));
      } else {
        setState(prev => ({ ...prev, statsLoading: false }));
      }
    } catch {
      // Stats are non-critical, don't show error
      setState(prev => ({ ...prev, statsLoading: false }));
    }
  }, []);

  const createService = useCallback(async (data: Partial<Service>): Promise<Service> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await serviceService.createService(data);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Errore nella creazione del servizio');
      }

      const newService = response.data;

      setState(prev => ({
        ...prev,
        services: [...prev.services, newService],
        isLoading: false,
      }));

      return newService;
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Errore nella creazione del servizio',
        isLoading: false,
      }));
      throw err;
    }
  }, []);

  const updateService = useCallback(async (id: string, data: Partial<Service>): Promise<Service> => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const response = await serviceService.updateService(id, data);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Errore nell\'aggiornamento del servizio');
      }

      const updatedService = response.data;

      setState(prev => ({
        ...prev,
        services: prev.services.map(s => s.id === id ? updatedService : s),
        currentService: prev.currentService?.id === id ? updatedService : prev.currentService,
      }));

      return updatedService;
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Errore nell\'aggiornamento del servizio',
      }));
      throw err;
    }
  }, []);

  const setFilters = useCallback((filters: ServiceFilters) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  const clearCurrentService = useCallback(() => {
    setState(prev => ({ ...prev, currentService: null }));
  }, []);

  const value = useMemo<ServiceContextValue>(() => ({
    ...state,
    fetchServices,
    fetchService,
    fetchStats,
    createService,
    updateService,
    setFilters,
    clearCurrentService,
  }), [state, fetchServices, fetchService, fetchStats, createService, updateService, setFilters, clearCurrentService]);

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
