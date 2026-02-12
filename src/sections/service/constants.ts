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

export const SERVICE_TYPES = [
  {
    group: 'Dialisi',
    options: [
      { value: 'andata_dialisi', label: 'Andata dialisi' },
      { value: 'ritorno_dialisi', label: 'Ritorno dialisi' },
    ],
  },
  {
    group: 'Visita',
    options: [
      { value: 'visita_medica', label: 'Visita medica' },
      { value: 'prericovero', label: 'Prericovero' },
      { value: 'trasfusione', label: 'Trasfusione' },
      { value: 'visita_controllo', label: 'Visita di controllo' },
      { value: 'medicazione', label: 'Medicazione' },
    ],
  },
  {
    group: 'Esami diagnostici',
    options: [
      { value: 'ecografia', label: 'Ecografia' },
      { value: 'tac', label: 'TAC' },
      { value: 'rx', label: 'RX' },
      { value: 'risonanza', label: 'Risonanza magnetica' },
      { value: 'mammografia', label: 'Mammografia' },
      { value: 'ecodoppler', label: 'Ecodoppler' },
    ],
  },
  {
    group: 'Trasporto',
    options: [
      { value: 'dimissione', label: 'Dimissione' },
      { value: 'trasferimento', label: 'Trasferimento' },
      { value: 'ricovero', label: 'Ricovero' },
      { value: 'trasporto_programmato', label: 'Trasporto programmato' },
    ],
  },
  {
    group: 'Altro',
    options: [
      { value: 'tampone', label: 'Tampone' },
      { value: 'vaccino', label: 'Vaccino' },
      { value: 'day_hospital', label: 'Day Hospital' },
      { value: 'fisioterapia', label: 'Fisioterapia' },
      { value: 'radioterapia', label: 'Radioterapia' },
      { value: 'chemioterapia', label: 'Chemioterapia' },
    ],
  },
  {
    group: 'Sconosciuto',
    options: [
      { value: 'sconosciuto', label: 'Sconosciuto' },
    ],
  },
] as const;

/** Flat lookup map: raw DB value → display label */
export const SERVICE_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  SERVICE_TYPES.flatMap(g => g.options.map(o => [o.value, o.label]))
);

/** Map a raw service type value to its display label */
export function mapServiceType(raw: string): string {
  return SERVICE_TYPE_LABELS[raw] || raw;
}

export const SPORT_EQUIPMENT = [
  { value: 'Zaino sportivo', icon: ICONS.equipment.items.backpack },
  { value: 'Ossigeno', icon: ICONS.equipment.items.oxygen },
  { value: 'Cellulare', icon: ICONS.equipment.items.phone },
  { value: 'DAE', icon: ICONS.equipment.items.dae },
  { value: 'ELI 10', icon: ICONS.equipment.items.eli },
  { value: 'Altro', icon: ICONS.equipment.items.other },
] as const; 