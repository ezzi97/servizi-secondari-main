export const ICONS = {
  patient: {
    name: 'solar:user-id-bold-duotone',
    phone: 'solar:phone-bold-duotone',
    address: 'solar:home-angle-bold-duotone',
  },
  service: {
    type: 'solar:hand-heart-bold-duotone',
    time: 'solar:clock-circle-bold-duotone',
    date: 'solar:calendar-bold-duotone',
  },
  transport: {
    location: 'solar:map-point-bold-duotone',
    type: 'solar:building-bold-duotone',
    time: 'solar:clock-circle-bold-duotone',
  },
  details: {
    vehicle: 'lineicons:ambulance',
    position: 'solar:user-hand-up-bold-duotone',
    equipment: 'solar:medical-kit-bold-duotone',
    difficulty: 'solar:danger-triangle-bold-duotone',
    notes: 'solar:notebook-bold-duotone',
  },
  event: {
    name: 'solar:flag-2-bold-duotone',
    date: 'solar:calendar-bold-duotone',
    time: 'solar:clock-circle-bold-duotone',
    arrival: 'solar:login-2-bold-duotone',
    departure: 'solar:logout-2-bold-duotone',
    summary: 'solar:clipboard-list-bold-duotone',
  },
  organizer: {
    name: 'solar:user-id-bold-duotone',
    contact: 'solar:phone-bold-duotone',
  },
  equipment: {
    vehicle: 'solar:ambulance-bold-duotone',
    bag: 'solar:backpack-bold-duotone',
    notes: 'solar:notebook-bold-duotone',
    items: {
      backpack: 'solar:backpack-bold-duotone',
      oxygen: 'solar:mask-bold-duotone',
      phone: 'solar:phone-bold-duotone',
      dae: 'solar:heart-bold-duotone',
      eli: 'solar:accumulator-bold-duotone',
      other: 'solar:add-square-bold-duotone',
    }
  },
} as const;

export const TRANSPORT_TYPES = ['Casa', 'RSA', 'Centro medico', 'Clinica', 'Ospedale', 'Altro'];
export const VEHICLES = ['Auto', 'Ambulanza', 'Doblò', 'Pulmino', 'Altro'];
export const POSITIONS = ['Seduto', 'Barella', 'Carrozzina'];
export const EQUIPMENT = ['Ossigeno', 'Carrozzina', 'Sedia cardiopatica', 'Altro'];
export const DIFFICULTIES = ['Scale', 'Peso', 'Spazi stretti', 'Ascensore non funzionante', 'Altro'];

export const SPORT_EQUIPMENT = [
  { value: 'Zaino sportivo', icon: ICONS.equipment.items.backpack },
  { value: 'Ossigeno', icon: ICONS.equipment.items.oxygen },
  { value: 'Cellulare', icon: ICONS.equipment.items.phone },
  { value: 'DAE', icon: ICONS.equipment.items.dae },
  { value: 'ELI 10', icon: ICONS.equipment.items.eli },
  { value: 'Altro', icon: ICONS.equipment.items.other },
] as const; 