-- ============================================
-- Pronto Servizi - Demo Seed Data
-- ~100 services (70 secondary + 30 sport)
-- Run this in the Supabase SQL Editor
-- ============================================
--
-- The script auto-detects the first user in profiles.
-- To target a specific user, replace the SELECT below
-- with a hardcoded UUID:
--   v_user := 'your-uuid-here'::uuid;
-- ============================================

DO $$
DECLARE
  v_user UUID;
  v_id   UUID;
BEGIN
  v_user := 'a2fb9533-02ae-47ec-aff1-420effdba747'::uuid;

  -- ==========================================================
  -- SECONDARY SERVICES (70)
  -- ==========================================================

  -- 1
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-07-03', 42.50, 65.00, '2025-07-03 08:00:00+02', '2025-07-03 12:30:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-07-03', 'Maria Soldi', '333 1234567', 'Trasporto', '08:00', '12:30', 'Via Roma 12, Milano', 'domicilio', '08:15', 'Ospedale Niguarda, Milano', 'ospedale', '09:00', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 2
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-07-05', 18.00, 35.00, '2025-07-05 09:00:00+02', '2025-07-05 11:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-07-05', 'Rocco Ancilla', '340 9876543', 'Dialisi', '09:00', '11:00', 'Via Garibaldi 8, Bergamo', 'domicilio', '09:15', 'Clinica San Marco, Bergamo', 'clinica', '09:45', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], 'Paziente dializzato, trattamento trisettimanale');

  -- 3
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-07-10', 65.00, 95.00, '2025-07-10 07:30:00+02', '2025-07-10 13:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-07-10', 'Angela Maria Franzelli', '349 5551234', 'Trasporto', '07:30', '13:00', 'RSA Villa Serena, Brescia', 'RSA', '07:45', 'Ospedale Civile, Brescia', 'ospedale', '08:30', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY['scale']::text[], 'Necessita ossigeno durante il trasporto');

  -- 4
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-07-14', 22.00, 40.00, '2025-07-14 14:00:00+02', '2025-07-14 16:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-07-14', 'Giuseppe Moretti', '331 4445566', 'Visita', '14:00', '16:00', 'Via Manzoni 34, Monza', 'domicilio', '14:15', 'Poliambulatorio Monza', 'clinica', '14:45', 'auto', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 5
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-07-18', 88.00, 130.00, '2025-07-18 06:30:00+02', '2025-07-18 14:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-07-18', 'Immacolata Ferrara', '328 7778899', 'Dimissione', '06:30', '14:00', 'Ospedale San Raffaele, Milano', 'ospedale', '07:00', 'Via Dante 56, Lodi', 'domicilio', '08:15', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY['ascensore stretto']::text[], 'Dimissione post-operatoria, maneggiare con cura');

  -- 6
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-07-22', 15.00, 30.00, '2025-07-22 10:00:00+02', '2025-07-22 11:30:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-07-22', 'Franco Bianchi', '335 1112233', 'Dialisi', '10:00', '11:30', 'Corso Vittorio Emanuele 45, Pavia', 'domicilio', '10:10', 'Centro Dialisi Pavia', 'clinica', '10:35', 'pulmino', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 7
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'cancelled', '2025-07-25', 0, 0, '2025-07-24 16:00:00+02', '2025-07-25 07:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-07-25', 'Lucia Colombo', '347 6667788', 'Trasporto', '08:00', '', 'Via Torino 10, Como', 'domicilio', '08:15', 'Ospedale Sant Anna, Como', 'ospedale', '08:45', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], 'Cancellato dal paziente');

  -- 8
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-07-28', 35.00, 55.00, '2025-07-28 07:00:00+02', '2025-07-28 10:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-07-28', 'Salvatore Rizzo', '339 2223344', 'Trasporto', '07:00', '10:00', 'Via Verdi 7, Varese', 'domicilio', '07:20', 'Ospedale di Circolo, Varese', 'ospedale', '07:55', 'doblò', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 9
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-08-02', 50.00, 75.00, '2025-08-02 08:30:00+02', '2025-08-02 12:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-08-02', 'Anna Lombardi', '342 8889900', 'Visita', '08:30', '12:00', 'Via Leopardi 22, Lecco', 'domicilio', '08:45', 'Clinica Mater Domini, Lecco', 'clinica', '09:30', 'auto', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 10
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-08-06', 72.00, 110.00, '2025-08-06 06:00:00+02', '2025-08-06 13:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-08-06', 'Roberto Galli', '345 3334455', 'Dimissione', '06:00', '13:00', 'Ospedale Maggiore, Milano', 'ospedale', '06:30', 'Via Mazzini 90, Cremona', 'domicilio', '08:00', 'ambulanza', ARRAY['barella', 'ossigeno', 'defibrillatore'], 'sdraiato', ARRAY['scale', 'porta stretta']::text[], 'Paziente critico, necessita monitoraggio');

  -- 11
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-08-10', 28.00, 45.00, '2025-08-10 09:00:00+02', '2025-08-10 11:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-08-10', 'Paola Conti', '338 5556677', 'Dialisi', '09:00', '11:00', 'Via Garibaldi 15, Sondrio', 'domicilio', '09:10', 'Ospedale Civile, Sondrio', 'ospedale', '09:40', 'pulmino', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 12
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-08-14', 55.00, 80.00, '2025-08-14 07:00:00+02', '2025-08-14 11:30:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-08-14', 'Maria Soldi', '333 1234567', 'Trasporto', '07:00', '11:30', 'Via Roma 12, Milano', 'domicilio', '07:15', 'Ospedale San Paolo, Milano', 'ospedale', '07:50', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], 'Secondo trasporto per Maria Soldi');

  -- 13
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'confirmed', '2025-08-18', 32.00, 50.00, '2025-08-18 10:00:00+02', '2025-08-18 10:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-08-18', 'Teresa Barbieri', '330 9991122', 'Visita', '10:00', '12:00', 'Piazza Duomo 3, Mantova', 'domicilio', '10:15', 'Poliambulatorio Mantova', 'clinica', '10:50', 'auto', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 14
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-08-22', 95.00, 145.00, '2025-08-22 05:30:00+02', '2025-08-22 14:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-08-22', 'Vittorio Marchetti', '348 7778800', 'Trasporto', '05:30', '14:00', 'Via Cavour 60, Piacenza', 'domicilio', '06:00', 'Ospedale San Raffaele, Milano', 'ospedale', '07:30', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY[]::text[], 'Trasferimento interospedaliero lungo');

  -- 15
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-08-26', 12.00, 25.00, '2025-08-26 15:00:00+02', '2025-08-26 16:30:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-08-26', 'Elena Fontana', '332 4445500', 'Dialisi', '15:00', '16:30', 'Via Dante 18, Bergamo', 'domicilio', '15:10', 'Centro Dialisi Bergamo', 'clinica', '15:30', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 16
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-09-01', 48.00, 70.00, '2025-09-01 08:00:00+02', '2025-09-01 12:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-09-01', 'Carlo Pellegrini', '341 6667700', 'Trasporto', '08:00', '12:00', 'RSA Sacra Famiglia, Cesano Boscone', 'RSA', '08:15', 'Ospedale San Carlo, Milano', 'ospedale', '09:00', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 17
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-09-04', 20.00, 38.00, '2025-09-04 13:00:00+02', '2025-09-04 15:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-09-04', 'Giovanna De Luca', '346 2223300', 'Visita', '13:00', '15:00', 'Via Manzoni 5, Monza', 'domicilio', '13:15', 'Ospedale San Gerardo, Monza', 'ospedale', '13:40', 'doblò', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 18
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'cancelled', '2025-09-08', 0, 0, '2025-09-07 18:00:00+02', '2025-09-08 06:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-09-08', 'Antonio Ricci', '337 8889911', 'Trasporto', '07:00', '', 'Via Volta 22, Como', 'domicilio', '07:15', 'Ospedale Valduce, Como', 'ospedale', '07:45', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], 'Paziente ricoverato urgenza, servizio non necessario');

  -- 19
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-09-11', 38.00, 60.00, '2025-09-11 09:00:00+02', '2025-09-11 12:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-09-11', 'Francesca Greco', '344 1112200', 'Dimissione', '09:00', '12:00', 'Ospedale Fatebenefratelli, Milano', 'ospedale', '09:30', 'Via Boccaccio 14, Rho', 'domicilio', '10:15', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY['ascensore stretto']::text[], NULL);

  -- 20
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-09-15', 16.00, 30.00, '2025-09-15 14:30:00+02', '2025-09-15 16:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-09-15', 'Rocco Ancilla', '340 9876543', 'Dialisi', '14:30', '16:00', 'Via Garibaldi 8, Bergamo', 'domicilio', '14:40', 'Clinica San Marco, Bergamo', 'clinica', '15:05', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 21
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-09-19', 60.00, 90.00, '2025-09-19 07:00:00+02', '2025-09-19 12:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-09-19', 'Patrizia Martinelli', '329 5556600', 'Trasporto', '07:00', '12:00', 'Via Broletto 30, Lodi', 'domicilio', '07:20', 'Istituto Tumori, Milano', 'ospedale', '08:15', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY[]::text[], 'Trasporto per chemioterapia');

  -- 22
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-09-23', 25.00, 42.00, '2025-09-23 10:00:00+02', '2025-09-23 12:30:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-09-23', 'Marco Ferrari', '336 3334400', 'Visita', '10:00', '12:30', 'Piazza Cavour 7, Varese', 'domicilio', '10:15', 'Ospedale di Circolo, Varese', 'ospedale', '10:45', 'pulmino', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 23
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-09-27', 80.00, 120.00, '2025-09-27 06:00:00+02', '2025-09-27 13:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-09-27', 'Simone Russo', '343 7778811', 'Dimissione', '06:00', '13:00', 'Policlinico di Milano', 'ospedale', '06:30', 'Via Leopardi 40, Crema', 'domicilio', '08:00', 'ambulanza', ARRAY['barella', 'defibrillatore'], 'sdraiato', ARRAY['scale']::text[], 'Dimissione cardiologica');

  -- 24
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'pending', '2025-10-01', 30.00, 48.00, '2025-09-30 17:00:00+02', '2025-09-30 17:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-10-01', 'Daniela Mazza', '334 2223311', 'Trasporto', '08:00', '', 'Via Solferino 9, Brescia', 'domicilio', '08:15', 'Spedali Civili, Brescia', 'ospedale', '08:50', 'doblò', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 25
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-10-04', 44.00, 68.00, '2025-10-04 08:00:00+02', '2025-10-04 11:30:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-10-04', 'Stefano Colombo', '347 6667711', 'Trasporto', '08:00', '11:30', 'Via Tadino 15, Milano', 'domicilio', '08:20', 'Ospedale Niguarda, Milano', 'ospedale', '08:50', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 26
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-10-08', 18.00, 32.00, '2025-10-08 09:00:00+02', '2025-10-08 10:30:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-10-08', 'Elena Fontana', '332 4445500', 'Dialisi', '09:00', '10:30', 'Via Dante 18, Bergamo', 'domicilio', '09:10', 'Centro Dialisi Bergamo', 'clinica', '09:30', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 27
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-10-12', 105.00, 160.00, '2025-10-12 05:00:00+02', '2025-10-12 15:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-10-12', 'Giovanni Esposito', '340 1112244', 'Trasporto', '05:00', '15:00', 'Via Nazionale 100, Parma', 'domicilio', '05:30', 'Ospedale San Raffaele, Milano', 'ospedale', '07:30', 'ambulanza', ARRAY['barella', 'ossigeno', 'defibrillatore'], 'sdraiato', ARRAY[]::text[], 'Trasferimento urgente da Parma a Milano');

  -- 28
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-10-16', 22.00, 38.00, '2025-10-16 11:00:00+02', '2025-10-16 13:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-10-16', 'Laura Rizzo', '339 8889922', 'Visita', '11:00', '13:00', 'Via Marconi 25, Lecco', 'domicilio', '11:15', 'Clinica Mangioni, Lecco', 'clinica', '11:40', 'auto', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 29
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'confirmed', '2025-10-20', 40.00, 62.00, '2025-10-19 14:00:00+02', '2025-10-19 14:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-10-20', 'Sergio Martinelli', '348 3334422', 'Trasporto', '07:30', '', 'RSA Don Orione, Bergamo', 'RSA', '07:45', 'Ospedale Papa Giovanni XXIII, Bergamo', 'ospedale', '08:15', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 30
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-10-24', 56.00, 85.00, '2025-10-24 07:00:00+02', '2025-10-24 12:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-10-24', 'Immacolata Ferrara', '328 7778899', 'Trasporto', '07:00', '12:00', 'Via Dante 56, Lodi', 'domicilio', '07:15', 'Policlinico di Milano', 'ospedale', '08:10', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY[]::text[], 'Controllo post-operatorio');

  -- 31
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-10-28', 10.00, 22.00, '2025-10-28 16:00:00+02', '2025-10-28 17:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-10-28', 'Franco Bianchi', '335 1112233', 'Dialisi', '16:00', '17:00', 'Corso Vittorio Emanuele 45, Pavia', 'domicilio', '16:10', 'Centro Dialisi Pavia', 'clinica', '16:25', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 32
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-11-02', 68.00, 100.00, '2025-11-02 06:30:00+01', '2025-11-02 13:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-11-02', 'Angela Maria Franzelli', '349 5551234', 'Dimissione', '06:30', '13:00', 'Ospedale di Desio', 'ospedale', '07:00', 'Via Verdi 18, Seregno', 'domicilio', '07:30', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY['scale']::text[], NULL);

  -- 33
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-11-06', 34.00, 52.00, '2025-11-06 09:30:00+01', '2025-11-06 12:30:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-11-06', 'Alessandra Vitale', '333 6667722', 'Trasporto', '09:30', '12:30', 'Via Carducci 11, Cremona', 'domicilio', '09:45', 'Ospedale Maggiore, Cremona', 'ospedale', '10:15', 'pulmino', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 34
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'draft', '2025-11-10', 0, 0, '2025-11-09 20:00:00+01', '2025-11-09 20:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-11-10', 'Michele Santoro', '345 1112255', 'Trasporto', '', '', 'Via Torino 44, Pavia', 'domicilio', '', 'Ospedale San Matteo, Pavia', 'ospedale', '', '', ARRAY[]::text[], '', ARRAY[]::text[], 'Bozza - da completare');

  -- 35
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-11-13', 42.00, 65.00, '2025-11-13 08:00:00+01', '2025-11-13 11:30:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-11-13', 'Maria Soldi', '333 1234567', 'Dialisi', '08:00', '11:30', 'Via Roma 12, Milano', 'domicilio', '08:15', 'Centro Dialisi Città Studi, Milano', 'clinica', '08:45', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 36
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-11-17', 75.00, 115.00, '2025-11-17 06:00:00+01', '2025-11-17 14:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-11-17', 'Paolo Cattaneo', '341 9998877', 'Trasporto', '06:00', '14:00', 'Via Gramsci 8, Mantova', 'domicilio', '06:20', 'Ospedale Niguarda, Milano', 'ospedale', '08:00', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 37
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-11-21', 14.00, 28.00, '2025-11-21 10:00:00+01', '2025-11-21 11:30:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-11-21', 'Paola Conti', '338 5556677', 'Visita', '10:00', '11:30', 'Via Garibaldi 15, Sondrio', 'domicilio', '10:10', 'Poliambulatorio Sondrio', 'clinica', '10:30', 'auto', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 38
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-11-25', 52.00, 78.00, '2025-11-25 07:30:00+01', '2025-11-25 12:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-11-25', 'Roberto Galli', '345 3334455', 'Trasporto', '07:30', '12:00', 'Via Mazzini 90, Cremona', 'domicilio', '07:45', 'Ospedale Maggiore, Milano', 'ospedale', '09:00', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 39
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'cancelled', '2025-11-28', 0, 0, '2025-11-27 19:00:00+01', '2025-11-28 06:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-11-28', 'Teresa Barbieri', '330 9991122', 'Visita', '09:00', '', 'Piazza Duomo 3, Mantova', 'domicilio', '', 'Poliambulatorio Mantova', 'clinica', '', 'auto', ARRAY[]::text[], 'seduto', ARRAY[]::text[], 'Visita rimandata');

  -- 40
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-12-02', 36.00, 55.00, '2025-12-02 08:00:00+01', '2025-12-02 11:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-12-02', 'Salvatore Rizzo', '339 2223344', 'Trasporto', '08:00', '11:00', 'Via Verdi 7, Varese', 'domicilio', '08:15', 'Ospedale di Circolo, Varese', 'ospedale', '08:45', 'doblò', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 41
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-12-05', 20.00, 35.00, '2025-12-05 14:00:00+01', '2025-12-05 16:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-12-05', 'Giovanna De Luca', '346 2223300', 'Dialisi', '14:00', '16:00', 'Via Manzoni 5, Monza', 'domicilio', '14:15', 'Centro Dialisi Monza', 'clinica', '14:40', 'pulmino', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 42
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-12-09', 90.00, 135.00, '2025-12-09 06:00:00+01', '2025-12-09 14:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-12-09', 'Carlo Pellegrini', '341 6667700', 'Dimissione', '06:00', '14:00', 'Ospedale San Raffaele, Milano', 'ospedale', '06:30', 'Via Nazionale 55, Piacenza', 'domicilio', '08:30', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY['porta stretta']::text[], NULL);

  -- 43
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-12-12', 28.00, 45.00, '2025-12-12 09:00:00+01', '2025-12-12 11:30:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-12-12', 'Francesca Greco', '344 1112200', 'Trasporto', '09:00', '11:30', 'Via Boccaccio 14, Rho', 'domicilio', '09:15', 'Ospedale Fatebenefratelli, Milano', 'ospedale', '09:50', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 44
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'confirmed', '2025-12-16', 45.00, 70.00, '2025-12-15 17:00:00+01', '2025-12-15 17:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-12-16', 'Vittorio Marchetti', '348 7778800', 'Trasporto', '07:00', '', 'Via Cavour 60, Piacenza', 'domicilio', '07:15', 'Ospedale Maggiore, Milano', 'ospedale', '08:30', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 45
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-12-19', 15.00, 28.00, '2025-12-19 10:00:00+01', '2025-12-19 11:30:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-12-19', 'Rocco Ancilla', '340 9876543', 'Dialisi', '10:00', '11:30', 'Via Garibaldi 8, Bergamo', 'domicilio', '10:10', 'Clinica San Marco, Bergamo', 'clinica', '10:30', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 46
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-12-22', 58.00, 88.00, '2025-12-22 07:00:00+01', '2025-12-22 12:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-12-22', 'Patrizia Martinelli', '329 5556600', 'Trasporto', '07:00', '12:00', 'Via Broletto 30, Lodi', 'domicilio', '07:20', 'Istituto Tumori, Milano', 'ospedale', '08:15', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY[]::text[], 'Chemioterapia programmata');

  -- 47
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'draft', '2025-12-28', 0, 0, '2025-12-27 21:00:00+01', '2025-12-27 21:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-12-28', 'Anna Lombardi', '342 8889900', 'Visita', '', '', 'Via Leopardi 22, Lecco', 'domicilio', '', 'Clinica Mater Domini, Lecco', 'clinica', '', '', ARRAY[]::text[], '', ARRAY[]::text[], 'Da confermare');

  -- 48
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-01-03', 40.00, 62.00, '2026-01-03 08:00:00+01', '2026-01-03 11:30:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-01-03', 'Giuseppe Moretti', '331 4445566', 'Trasporto', '08:00', '11:30', 'Via Manzoni 34, Monza', 'domicilio', '08:15', 'Ospedale San Gerardo, Monza', 'ospedale', '08:40', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 49
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-01-07', 24.00, 40.00, '2026-01-07 09:00:00+01', '2026-01-07 11:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-01-07', 'Elena Fontana', '332 4445500', 'Dialisi', '09:00', '11:00', 'Via Dante 18, Bergamo', 'domicilio', '09:10', 'Centro Dialisi Bergamo', 'clinica', '09:30', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 50
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-01-10', 66.00, 98.00, '2026-01-10 06:30:00+01', '2026-01-10 13:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-01-10', 'Simone Russo', '343 7778811', 'Dimissione', '06:30', '13:00', 'Policlinico di Milano', 'ospedale', '07:00', 'Via Leopardi 40, Crema', 'domicilio', '08:15', 'ambulanza', ARRAY['barella', 'defibrillatore'], 'sdraiato', ARRAY['scale']::text[], NULL);

  -- 51
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-01-14', 30.00, 48.00, '2026-01-14 10:00:00+01', '2026-01-14 12:30:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-01-14', 'Marco Ferrari', '336 3334400', 'Visita', '10:00', '12:30', 'Piazza Cavour 7, Varese', 'domicilio', '10:15', 'Ospedale di Circolo, Varese', 'ospedale', '10:45', 'pulmino', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 52
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-01-18', 48.00, 72.00, '2026-01-18 07:00:00+01', '2026-01-18 11:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-01-18', 'Stefano Colombo', '347 6667711', 'Trasporto', '07:00', '11:00', 'Via Tadino 15, Milano', 'domicilio', '07:20', 'Ospedale Niguarda, Milano', 'ospedale', '07:50', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 53
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'pending', '2026-01-22', 22.00, 38.00, '2026-01-21 18:00:00+01', '2026-01-21 18:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-01-22', 'Daniela Mazza', '334 2223311', 'Trasporto', '08:30', '', 'Via Solferino 9, Brescia', 'domicilio', '08:45', 'Spedali Civili, Brescia', 'ospedale', '09:15', 'doblò', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 54
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-01-25', 85.00, 128.00, '2026-01-25 05:30:00+01', '2026-01-25 14:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-01-25', 'Giovanni Esposito', '340 1112244', 'Trasporto', '05:30', '14:00', 'Via Nazionale 100, Parma', 'domicilio', '06:00', 'Ospedale San Raffaele, Milano', 'ospedale', '08:00', 'ambulanza', ARRAY['barella', 'ossigeno', 'defibrillatore'], 'sdraiato', ARRAY[]::text[], 'Visita specialistica cardiologica');

  -- 55
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-01-28', 18.00, 32.00, '2026-01-28 14:00:00+01', '2026-01-28 15:30:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-01-28', 'Laura Rizzo', '339 8889922', 'Dialisi', '14:00', '15:30', 'Via Marconi 25, Lecco', 'domicilio', '14:10', 'Centro Dialisi Lecco', 'clinica', '14:30', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 56
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-02-01', 55.00, 82.00, '2026-02-01 07:00:00+01', '2026-02-01 12:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-02-01', 'Paolo Cattaneo', '341 9998877', 'Trasporto', '07:00', '12:00', 'Via Gramsci 8, Mantova', 'domicilio', '07:20', 'Ospedale Niguarda, Milano', 'ospedale', '09:00', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 57
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'confirmed', '2026-02-05', 35.00, 55.00, '2026-02-04 16:00:00+01', '2026-02-04 16:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-02-05', 'Alessandra Vitale', '333 6667722', 'Trasporto', '08:00', '', 'Via Carducci 11, Cremona', 'domicilio', '08:15', 'Ospedale Maggiore, Cremona', 'ospedale', '08:45', 'pulmino', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 58
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-02-08', 42.00, 65.00, '2026-02-08 08:00:00+01', '2026-02-08 12:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-02-08', 'Maria Soldi', '333 1234567', 'Trasporto', '08:00', '12:00', 'Via Roma 12, Milano', 'domicilio', '08:15', 'Ospedale Niguarda, Milano', 'ospedale', '08:50', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 59
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'pending', '2026-02-12', 28.00, 45.00, '2026-02-11 19:00:00+01', '2026-02-11 19:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-02-12', 'Franco Bianchi', '335 1112233', 'Dialisi', '09:00', '', 'Corso Vittorio Emanuele 45, Pavia', 'domicilio', '09:10', 'Centro Dialisi Pavia', 'clinica', '09:30', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], NULL);

  -- 60
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-02-14', 70.00, 105.00, '2026-02-14 06:00:00+01', '2026-02-14 13:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-02-14', 'Angela Maria Franzelli', '349 5551234', 'Dimissione', '06:00', '13:00', 'Ospedale di Desio', 'ospedale', '06:30', 'Via Verdi 18, Seregno', 'domicilio', '07:00', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY['scale']::text[], NULL);

  -- Archived secondary services (61-65)
  -- 61
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, archived_at, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-08-01 00:00:00+02', '2025-07-08', 33.00, 50.00, '2025-07-08 08:00:00+02', '2025-08-01 00:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-07-08', 'Lucia Colombo', '347 6667788', 'Trasporto', '08:00', '10:30', 'Via Torino 10, Como', 'domicilio', '08:15', 'Ospedale Sant Anna, Como', 'ospedale', '08:50', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], 'Archiviato');

  -- 62
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, archived_at, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-09-01 00:00:00+02', '2025-08-12', 45.00, 68.00, '2025-08-12 07:00:00+02', '2025-09-01 00:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-08-12', 'Antonio Ricci', '337 8889911', 'Visita', '07:00', '10:00', 'Via Volta 22, Como', 'domicilio', '07:15', 'Ospedale Valduce, Como', 'ospedale', '07:50', 'doblò', ARRAY[]::text[], 'seduto', ARRAY[]::text[], 'Archiviato');

  -- 63
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, archived_at, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-10-01 00:00:00+02', '2025-09-05', 52.00, 78.00, '2025-09-05 08:30:00+02', '2025-10-01 00:00:00+02');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-09-05', 'Michele Santoro', '345 1112255', 'Trasporto', '08:30', '12:30', 'Via Torino 44, Pavia', 'domicilio', '08:45', 'Ospedale San Matteo, Pavia', 'ospedale', '09:20', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], 'Archiviato');

  -- 64
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, archived_at, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'cancelled', '2025-11-01 00:00:00+01', '2025-10-10', 0, 0, '2025-10-09 16:00:00+02', '2025-11-01 00:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-10-10', 'Sergio Martinelli', '348 3334422', 'Dialisi', '09:00', '', 'RSA Don Orione, Bergamo', 'RSA', '', 'Centro Dialisi Bergamo', 'clinica', '', 'auto', ARRAY['sedia a rotelle'], 'seduto', ARRAY[]::text[], 'Archiviato - cancellato');

  -- 65
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, archived_at, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2025-12-01 00:00:00+01', '2025-11-08', 38.00, 58.00, '2025-11-08 09:00:00+01', '2025-12-01 00:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2025-11-08', 'Paola Conti', '338 5556677', 'Trasporto', '09:00', '12:00', 'Via Garibaldi 15, Sondrio', 'domicilio', '09:15', 'Ospedale Civile, Sondrio', 'ospedale', '09:45', 'pulmino', ARRAY[]::text[], 'seduto', ARRAY[]::text[], 'Archiviato');

  -- Remaining active secondary (66-70)
  -- 66
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-01-05', 26.00, 42.00, '2026-01-05 11:00:00+01', '2026-01-05 13:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-01-05', 'Teresa Barbieri', '330 9991122', 'Visita', '11:00', '13:00', 'Piazza Duomo 3, Mantova', 'domicilio', '11:15', 'Poliambulatorio Mantova', 'clinica', '11:45', 'auto', ARRAY[]::text[], 'seduto', ARRAY[]::text[], NULL);

  -- 67
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'completed', '2026-01-12', 62.00, 95.00, '2026-01-12 06:00:00+01', '2026-01-12 13:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-01-12', 'Roberto Galli', '345 3334455', 'Dimissione', '06:00', '13:00', 'Ospedale Maggiore, Milano', 'ospedale', '06:30', 'Via Mazzini 90, Cremona', 'domicilio', '08:00', 'ambulanza', ARRAY['barella', 'ossigeno'], 'sdraiato', ARRAY['porta stretta']::text[], NULL);

  -- 68
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'confirmed', '2026-02-15', 38.00, 58.00, '2026-02-14 15:00:00+01', '2026-02-14 15:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-02-15', 'Francesca Greco', '344 1112200', 'Trasporto', '08:00', '', 'Via Boccaccio 14, Rho', 'domicilio', '08:15', 'Ospedale Fatebenefratelli, Milano', 'ospedale', '08:50', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- 69
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'draft', '2026-02-18', 0, 0, '2026-02-14 20:00:00+01', '2026-02-14 20:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-02-18', 'Vittorio Marchetti', '348 7778800', 'Trasporto', '', '', 'Via Cavour 60, Piacenza', 'domicilio', '', 'Ospedale Maggiore, Milano', 'ospedale', '', '', ARRAY[]::text[], '', ARRAY[]::text[], 'In lavorazione');

  -- 70
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'secondary', v_user, 'pending', '2026-02-20', 50.00, 75.00, '2026-02-14 21:00:00+01', '2026-02-14 21:00:00+01');
  INSERT INTO public.secondary_services (service_id, service_date, patient_name, phone_number, service_type, arrival_time, departure_time, pickup_address, pickup_type, pickup_time, dropoff_address, dropoff_type, dropoff_time, vehicle, equipment, position, difficulties, additional_notes)
  VALUES (v_id, '2026-02-20', 'Carlo Pellegrini', '341 6667700', 'Trasporto', '07:00', '', 'RSA Sacra Famiglia, Cesano Boscone', 'RSA', '07:15', 'Ospedale San Carlo, Milano', 'ospedale', '08:00', 'ambulanza', ARRAY['barella'], 'sdraiato', ARRAY[]::text[], NULL);

  -- ==========================================================
  -- SPORT / EVENT SERVICES (30)
  -- ==========================================================

  -- 71
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-07-12', 35.00, 120.00, '2025-07-12 13:00:00+02', '2025-07-12 18:00:00+02');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Torneo Estivo Under 16', '2025-07-12', '14:00', '17:00', '13:00', '18:00', 'ASD Atletica Milano', '02 1234567', 'pulmino', ARRAY['defibrillatore'], 'Assistenza sanitaria campo sportivo');

  -- 72
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-07-20', 50.00, 150.00, '2025-07-20 08:00:00+02', '2025-07-20 19:00:00+02');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'torneo', 'Coppa Lombardia Calcio a 5', '2025-07-20', '09:00', '18:00', '08:00', '19:00', 'FIGC Lombardia', '02 9876543', 'ambulanza', ARRAY['defibrillatore', 'barella', 'ossigeno'], 'Copertura intera giornata torneo');

  -- 73
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-08-03', 20.00, 80.00, '2025-08-03 15:00:00+02', '2025-08-03 19:00:00+02');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'allenamento', 'Raduno Pre-Campionato Basket', '2025-08-03', '16:00', '18:30', '15:00', '19:00', 'Basket Club Bergamo', '035 5551234', 'auto', ARRAY['defibrillatore'], NULL);

  -- 74
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-08-17', 75.00, 200.00, '2025-08-17 07:00:00+02', '2025-08-17 20:00:00+02');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'gara', 'Maratona del Lago di Como', '2025-08-17', '08:00', '14:00', '07:00', '20:00', 'Running Club Como', '031 4445566', 'ambulanza', ARRAY['defibrillatore', 'barella', 'ossigeno'], 'Postazione fissa al km 21 e squadra mobile');

  -- 75
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-09-06', 30.00, 100.00, '2025-09-06 13:00:00+02', '2025-09-06 17:30:00+02');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Serie D - Prima Giornata', '2025-09-06', '14:30', '16:30', '13:00', '17:30', 'US Cremonese Juniores', '0372 111222', 'pulmino', ARRAY['defibrillatore', 'barella'], 'Assistenza bordo campo');

  -- 76
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-09-14', 15.00, 60.00, '2025-09-14 08:00:00+02', '2025-09-14 12:00:00+02');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'allenamento', 'Open Day Rugby Monza', '2025-09-14', '09:00', '11:30', '08:00', '12:00', 'Rugby Monza', '039 3334455', 'auto', ARRAY['defibrillatore'], 'Giornata porte aperte, molti bambini');

  -- 77
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'cancelled', '2025-09-21', 0, 0, '2025-09-20 10:00:00+02', '2025-09-21 06:00:00+02');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'torneo', 'Torneo di Pallavolo Autunnale', '2025-09-21', '09:00', '18:00', '08:00', '19:00', 'FIPAV Brescia', '030 6667788', 'ambulanza', ARRAY['defibrillatore', 'barella'], 'Cancellato per maltempo');

  -- 78
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-10-05', 40.00, 130.00, '2025-10-05 12:00:00+02', '2025-10-05 18:00:00+02');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Derby Provinciale Calcio', '2025-10-05', '14:00', '16:00', '12:00', '18:00', 'FIGC Bergamo', '035 8889900', 'pulmino', ARRAY['defibrillatore', 'barella'], NULL);

  -- 79
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-10-19', 90.00, 250.00, '2025-10-19 06:00:00+02', '2025-10-19 20:00:00+02');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'gara', 'Giro Ciclistico della Brianza', '2025-10-19', '08:00', '15:00', '06:00', '20:00', 'FCI Lombardia', '02 5551234', 'ambulanza', ARRAY['defibrillatore', 'barella', 'ossigeno'], 'Ambulanza al seguito del gruppo');

  -- 80
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-11-01', 25.00, 90.00, '2025-11-01 14:00:00+01', '2025-11-01 18:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Campionato Regionale Handball', '2025-11-01', '15:00', '17:00', '14:00', '18:00', 'FIGH Lombardia', '02 7778899', 'pulmino', ARRAY['defibrillatore'], NULL);

  -- 81
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-11-09', 55.00, 180.00, '2025-11-09 07:00:00+01', '2025-11-09 19:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'torneo', 'Torneo Internazionale Nuoto', '2025-11-09', '08:00', '18:00', '07:00', '19:00', 'FIN Lombardia', '02 3334455', 'ambulanza', ARRAY['defibrillatore', 'ossigeno'], 'Piscina comunale, assistenza vasca');

  -- 82
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-11-16', 18.00, 70.00, '2025-11-16 09:00:00+01', '2025-11-16 13:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'allenamento', 'Allenamento Congiunto Karate', '2025-11-16', '10:00', '12:30', '09:00', '13:00', 'FIJLKAM Lombardia', '02 6665544', 'auto', ARRAY['defibrillatore'], NULL);

  -- 83
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-11-23', 42.00, 140.00, '2025-11-23 12:00:00+01', '2025-11-23 18:30:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Coppa Italia Dilettanti', '2025-11-23', '14:00', '16:30', '12:00', '18:30', 'Lega Nazionale Dilettanti', '02 1119988', 'pulmino', ARRAY['defibrillatore', 'barella'], 'Partita eliminatoria');

  -- 84
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-12-07', 60.00, 190.00, '2025-12-07 07:00:00+01', '2025-12-07 18:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'gara', 'Cross Country Provinciale', '2025-12-07', '09:00', '14:00', '07:00', '18:00', 'FIDAL Lombardia', '02 4443322', 'ambulanza', ARRAY['defibrillatore', 'barella', 'ossigeno'], 'Percorso collinare, terreno fangoso');

  -- 85
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-12-14', 22.00, 85.00, '2025-12-14 13:00:00+01', '2025-12-14 17:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Serie C Basket - Giornata 12', '2025-12-14', '14:30', '16:30', '13:00', '17:00', 'Basket Club Bergamo', '035 5551234', 'pulmino', ARRAY['defibrillatore'], NULL);

  -- 86
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'confirmed', '2025-12-21', 30.00, 110.00, '2025-12-20 14:00:00+01', '2025-12-20 14:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'torneo', 'Torneo Natalizio Calcio a 7', '2025-12-21', '09:00', '17:00', '08:00', '18:00', 'Oratorio San Luigi, Monza', '039 2221100', 'ambulanza', ARRAY['defibrillatore', 'barella'], 'Torneo beneficenza');

  -- 87
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2026-01-11', 45.00, 150.00, '2026-01-11 08:00:00+01', '2026-01-11 18:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'torneo', 'Trofeo della Befana - Calcio Giovanile', '2026-01-11', '09:00', '17:00', '08:00', '18:00', 'ASD Atletica Milano', '02 1234567', 'ambulanza', ARRAY['defibrillatore', 'barella'], 'Categorie esordienti e giovanissimi');

  -- 88
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2026-01-18', 28.00, 95.00, '2026-01-18 13:00:00+01', '2026-01-18 17:30:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Campionato Regionale Volley', '2026-01-18', '14:30', '16:30', '13:00', '17:30', 'FIPAV Milano', '02 8887766', 'pulmino', ARRAY['defibrillatore'], NULL);

  -- 89
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2026-01-25', 65.00, 210.00, '2026-01-25 06:00:00+01', '2026-01-25 19:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'gara', 'Campionato Regionale Sci Nordico', '2026-01-25', '08:00', '15:00', '06:00', '19:00', 'FISI Lombardia', '02 5553322', 'ambulanza', ARRAY['defibrillatore', 'barella', 'ossigeno'], 'Pista sci fondo Bormio, basse temperature');

  -- 90
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2026-02-01', 18.00, 75.00, '2026-02-01 09:00:00+01', '2026-02-01 13:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'allenamento', 'Stage Tecnico Judo', '2026-02-01', '10:00', '12:30', '09:00', '13:00', 'FIJLKAM Lombardia', '02 6665544', 'auto', ARRAY['defibrillatore'], NULL);

  -- 91
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2026-02-08', 38.00, 125.00, '2026-02-08 12:00:00+01', '2026-02-08 18:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Serie D Calcio - Giornata 20', '2026-02-08', '14:30', '16:30', '12:00', '18:00', 'US Cremonese Juniores', '0372 111222', 'pulmino', ARRAY['defibrillatore', 'barella'], NULL);

  -- 92
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'confirmed', '2026-02-15', 50.00, 160.00, '2026-02-13 16:00:00+01', '2026-02-13 16:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'torneo', 'Torneo Indoor Atletica', '2026-02-15', '09:00', '17:00', '08:00', '18:00', 'FIDAL Lombardia', '02 4443322', 'ambulanza', ARRAY['defibrillatore', 'barella'], 'Palazzetto dello sport Monza');

  -- 93
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'pending', '2026-02-22', 35.00, 115.00, '2026-02-14 10:00:00+01', '2026-02-14 10:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Coppa Lombardia Rugby', '2026-02-22', '14:00', '16:00', '12:30', '17:30', 'Rugby Monza', '039 3334455', 'pulmino', ARRAY['defibrillatore', 'barella'], NULL);

  -- 94
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-10-26', 70.00, 220.00, '2025-10-26 06:30:00+02', '2025-10-26 19:00:00+02');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'gara', 'Mezza Maratona di Bergamo', '2025-10-26', '08:00', '13:00', '06:30', '19:00', 'Running Club Bergamo', '035 9998877', 'ambulanza', ARRAY['defibrillatore', 'barella', 'ossigeno'], 'Postazione arrivo e ambulanza mobile');

  -- 95
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-11-30', 32.00, 105.00, '2025-11-30 13:00:00+01', '2025-11-30 18:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Campionato Eccellenza Calcio', '2025-11-30', '14:30', '16:30', '13:00', '18:00', 'ASD Pro Sesto', '02 2221133', 'pulmino', ARRAY['defibrillatore', 'barella'], NULL);

  -- 96
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2025-12-20', 15.00, 55.00, '2025-12-20 09:00:00+01', '2025-12-20 12:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'allenamento', 'Ritiro Invernale Tennis', '2025-12-20', '10:00', '12:00', '09:00', '12:00', 'Circolo Tennis Monza', '039 7776655', 'auto', ARRAY['defibrillatore'], NULL);

  -- 97
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2026-01-31', 48.00, 155.00, '2026-01-31 07:00:00+01', '2026-01-31 18:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'torneo', 'Torneo Carnevale Basket', '2026-01-31', '09:00', '17:00', '07:00', '18:00', 'Basket Club Bergamo', '035 5551234', 'ambulanza', ARRAY['defibrillatore', 'barella'], 'Palazzetto di Treviglio');

  -- 98
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'completed', '2026-02-09', 110.00, 240.00, '2026-02-09 05:00:00+01', '2026-02-09 20:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'gara', 'Granfondo Ciclistica Padana', '2026-02-09', '07:00', '15:00', '05:00', '20:00', 'FCI Lombardia', '02 5551234', 'ambulanza', ARRAY['defibrillatore', 'barella', 'ossigeno'], '150 km, ambulanza al seguito');

  -- 99
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'pending', '2026-03-01', 25.00, 90.00, '2026-02-14 11:00:00+01', '2026-02-14 11:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'partita', 'Serie C Basket - Playoff', '2026-03-01', '18:00', '20:00', '16:30', '21:00', 'Basket Club Bergamo', '035 5551234', 'pulmino', ARRAY['defibrillatore'], NULL);

  -- 100
  v_id := gen_random_uuid();
  INSERT INTO public.services (id, type, user_id, status, service_date, kilometers, price, created_at, updated_at)
  VALUES (v_id, 'sport', v_user, 'draft', '2026-03-08', 0, 0, '2026-02-14 22:00:00+01', '2026-02-14 22:00:00+01');
  INSERT INTO public.event_services (service_id, event_type, event_name, event_date, start_time, end_time, arrival_time, departure_time, organizer_name, organizer_contact, vehicle, equipment, notes)
  VALUES (v_id, 'torneo', 'Memorial Primavera Calcio', '2026-03-08', '', '', '', '', 'ASD Atletica Milano', '02 1234567', '', ARRAY[]::text[], 'Bozza - in attesa conferma organizzatore');

  RAISE NOTICE 'Seed data inserted successfully for user %', v_user;
END $$;
