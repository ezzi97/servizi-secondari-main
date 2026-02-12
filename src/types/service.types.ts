// Base service interface
export interface BaseService {
  id: string;
  type: 'sport' | 'secondary';
  userId: string;
  status: 'draft' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Sport service specific fields
export interface SportServiceData {
  eventTypeSport: string;
  eventNameSport: string;
  eventDateSport: string;
  startTimeSport: string;
  endTimeSport: string;
  arrivalTimeSport: string;
  departureTimeSport: string;
  organizerNameSport: string;
  organizerContactSport?: string;
  vehicleSport: string;
  equipmentSport: string[];
  kilometersSport: number;
  priceSport: number;
  notesSport?: string;
}

export interface SportService extends BaseService, SportServiceData {
  type: 'sport';
}

// Secondary service specific fields
export interface SecondaryServiceData {
  serviceDate: string;
  patientName: string;
  phoneNumber?: string;
  serviceType: string;
  arrivalTime: string;
  departureTime: string;
  pickupAddress: string;
  pickupType: string;
  pickupTime: string;
  dropoffAddress: string;
  dropoffType: string;
  dropoffTime: string;
  vehicle: string;
  equipment: string[];
  position: string;
  difficulties: string[];
  additional_notes?: string;
  kilometers: number;
  price: number;
}

export interface SecondaryService extends BaseService, SecondaryServiceData {
  type: 'secondary';
}

// Union type for all services
export type Service = SportService | SecondaryService;

// Service list filters
export interface ServiceFilters {
  type?: 'sport' | 'secondary';
  status?: string;
  archived?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Service statistics
export interface ServiceStats {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  totalRevenue: number;
  averagePrice: number;
  totalKilometers: number;
}

// Event types for sport services
export interface EventType {
  value: string;
  label: string;
  icon: string;
}

// Service type groups for secondary services
export interface ServiceTypeGroup {
  group: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

// Form step definition
export interface FormStep<T extends string = string> {
  label: string;
  fields: T[];
}

