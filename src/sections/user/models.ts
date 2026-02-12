export type UserProps = {
    id: string;
    name: string;
    visit: string;
    timestamp: string;
    status: string;
    avatarUrl: string;

    // Basic information
    vehicle?: string;
    priority?: string;
    timeOfDay?: string;
    date?: string;
    time?: string;

    // Date range
    dateFrom?: string;
    dateTo?: string;

    // Contact information
    phone?: string;
    address?: string;

    // Transport information
    pickupLocation?: string;
    pickupTime?: string;
    destinationType?: string;

    // Service details
    serviceType?: string;
    position?: string;
    equipment?: string[];
    difficulties?: string[];
    notes?: string;
    kilometers?: number;
    price?: number;

    // Sport service specific
    eventName?: string;
    startTime?: string;
    endTime?: string;
    arrivalTime?: string;
    departureTime?: string;
    summary?: string;
    organizerName?: string;
    organizerContact?: string;
    bag?: string;
    equipmentItems?: string[];
};