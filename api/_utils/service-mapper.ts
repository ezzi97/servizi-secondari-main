// -------------------------------------------------
// Maps DB rows (snake_case) to API response (camelCase)
// and API request (camelCase) back to DB columns (snake_case).
// Keeps the API contract identical so the frontend is unchanged.
// -------------------------------------------------

// ---- Response mapping (DB → API) ----

function mapSecondaryToResponse(row: any) {
  if (!row) return {};
  return {
    serviceDate: row.service_date ?? '',
    patientName: row.patient_name ?? '',
    phoneNumber: row.phone_number ?? '',
    serviceType: row.service_type ?? '',
    arrivalTime: row.arrival_time ?? '',
    departureTime: row.departure_time ?? '',
    pickupAddress: row.pickup_address ?? '',
    pickupType: row.pickup_type ?? '',
    pickupTime: row.pickup_time ?? '',
    dropoffAddress: row.dropoff_address ?? '',
    dropoffType: row.dropoff_type ?? '',
    dropoffTime: row.dropoff_time ?? '',
    vehicle: row.vehicle ?? '',
    equipment: row.equipment ?? [],
    position: row.position ?? '',
    difficulties: row.difficulties ?? [],
    additional_notes: row.additional_notes ?? '',
  };
}

function mapEventToResponse(row: any) {
  if (!row) return {};
  return {
    eventTypeSport: row.event_type ?? '',
    eventNameSport: row.event_name ?? '',
    eventDateSport: row.event_date ?? '',
    startTimeSport: row.start_time ?? '',
    endTimeSport: row.end_time ?? '',
    arrivalTimeSport: row.arrival_time ?? '',
    departureTimeSport: row.departure_time ?? '',
    organizerNameSport: row.organizer_name ?? '',
    organizerContactSport: row.organizer_contact ?? '',
    vehicleSport: row.vehicle ?? '',
    equipmentSport: row.equipment ?? [],
    notesSport: row.notes ?? '',
  };
}

function mapServiceRow(row: any) {
  const base = {
    id: row.id,
    type: row.type,
    userId: row.user_id,
    status: row.status,
    kilometers: row.kilometers ?? 0,
    price: row.price ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.type === 'secondary') {
    // Supabase nested select returns the child as an object (1:1)
    const child = Array.isArray(row.secondary_services)
      ? row.secondary_services[0]
      : row.secondary_services;
    return { ...base, ...mapSecondaryToResponse(child) };
  }

  // sport / event
  const child = Array.isArray(row.event_services)
    ? row.event_services[0]
    : row.event_services;
  return { ...base, ...mapEventToResponse(child) };
}

// ---- Request mapping (API → DB child columns) ----

function mapSecondaryToDb(data: Record<string, any>) {
  const out: Record<string, any> = {};
  if (data.serviceDate !== undefined)    out.service_date = data.serviceDate;
  if (data.patientName !== undefined)    out.patient_name = data.patientName;
  if (data.phoneNumber !== undefined)    out.phone_number = data.phoneNumber;
  if (data.serviceType !== undefined)    out.service_type = data.serviceType;
  if (data.arrivalTime !== undefined)    out.arrival_time = data.arrivalTime;
  if (data.departureTime !== undefined)  out.departure_time = data.departureTime;
  if (data.pickupAddress !== undefined)  out.pickup_address = data.pickupAddress;
  if (data.pickupType !== undefined)     out.pickup_type = data.pickupType;
  if (data.pickupTime !== undefined)     out.pickup_time = data.pickupTime;
  if (data.dropoffAddress !== undefined) out.dropoff_address = data.dropoffAddress;
  if (data.dropoffType !== undefined)    out.dropoff_type = data.dropoffType;
  if (data.dropoffTime !== undefined)    out.dropoff_time = data.dropoffTime;
  if (data.vehicle !== undefined)        out.vehicle = data.vehicle;
  if (data.equipment !== undefined)      out.equipment = data.equipment;
  if (data.position !== undefined)       out.position = data.position;
  if (data.difficulties !== undefined)   out.difficulties = data.difficulties;
  if (data.additional_notes !== undefined) out.additional_notes = data.additional_notes;
  return out;
}

function mapEventToDb(data: Record<string, any>) {
  const out: Record<string, any> = {};
  if (data.eventTypeSport !== undefined)       out.event_type = data.eventTypeSport;
  if (data.eventNameSport !== undefined)       out.event_name = data.eventNameSport;
  if (data.eventDateSport !== undefined)       out.event_date = data.eventDateSport;
  if (data.startTimeSport !== undefined)       out.start_time = data.startTimeSport;
  if (data.endTimeSport !== undefined)         out.end_time = data.endTimeSport;
  if (data.arrivalTimeSport !== undefined)     out.arrival_time = data.arrivalTimeSport;
  if (data.departureTimeSport !== undefined)   out.departure_time = data.departureTimeSport;
  if (data.organizerNameSport !== undefined)   out.organizer_name = data.organizerNameSport;
  if (data.organizerContactSport !== undefined) out.organizer_contact = data.organizerContactSport;
  if (data.vehicleSport !== undefined)         out.vehicle = data.vehicleSport;
  if (data.equipmentSport !== undefined)       out.equipment = data.equipmentSport;
  if (data.notesSport !== undefined)           out.notes = data.notesSport;
  return out;
}

function mapChildToDb(type: string, data: Record<string, any>) {
  return type === 'secondary' ? mapSecondaryToDb(data) : mapEventToDb(data);
}

function childTable(type: string): string {
  return type === 'secondary' ? 'secondary_services' : 'event_services';
}

module.exports = { mapServiceRow, mapChildToDb, childTable };
