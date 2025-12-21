-- ========== LOCATIONS (Rwandan Administrative Structure) ==========

-- Kigali Province Locations
INSERT INTO locations (id, province_code, province_name, district_code, district_name, sector_code, sector_name, cell_code, cell_name, village_name) 
VALUES 
(1, '01', 'Kigali', '0101', 'Gasabo', '010101', 'Remera', '01010101', 'Rukiri I', 'Amahoro'),
(2, '01', 'Kigali', '0102', 'Kicukiro', '010201', 'Niboye', '01020101', 'Karama', 'Nyarugunga'),
(3, '01', 'Kigali', '0103', 'Nyarugenge', '010301', 'Nyarugenge', '01030101', 'Ubumwe', 'Muhima');

-- Eastern Province Locations
INSERT INTO locations (id, province_code, province_name, district_code, district_name, sector_code, sector_name, cell_code, cell_name, village_name) 
VALUES 
(4, '02', 'Eastern Province', '0201', 'Rwamagana', '020101', 'Karenge', '02010101', 'Kajevuba', 'Gasasa'),
(5, '02', 'Eastern Province', '0202', 'Kayonza', '020201', 'Kabare', '02020101', 'Kabeza', 'Rugenge');

-- Southern Province Locations
INSERT INTO locations (id, province_code, province_name, district_code, district_name, sector_code, sector_name, cell_code, cell_name, village_name) 
VALUES 
(6, '03', 'Southern Province', '0301', 'Huye', '030101', 'Tumba', '03010101', 'Karama', 'Rukira'),
(7, '03', 'Southern Province', '0302', 'Muhanga', '030201', 'Cyeza', '03020101', 'Gahinga', 'Nyamabuye');

-- Western Province Locations
INSERT INTO locations (id, province_code, province_name, district_code, district_name, sector_code, sector_name, cell_code, cell_name, village_name) 
VALUES 
(8, '04', 'Western Province', '0401', 'Rubavu', '040101', 'Gisenyi', '04010101', 'Umuganda', 'Rubavu'),
(9, '04', 'Western Province', '0402', 'Rusizi', '040201', 'Kamembe', '04020101', 'Nkanka', 'Bugarama');

-- Northern Province Locations
INSERT INTO locations (id, province_code, province_name, district_code, district_name, sector_code, sector_name, cell_code, cell_name, village_name) 
VALUES 
(10, '05', 'Northern Province', '0501', 'Musanze', '050101', 'Muhoza', '05010101', 'Cyuve', 'Kinigi'),
(11, '05', 'Northern Province', '0502', 'Gicumbi', '050201', 'Byumba', '05020101', 'Gasizi', 'Rutare');

-- ========== HOSPITALS ==========

INSERT INTO hospitals (id, name, type, capacity, registration_date, location_id) 
VALUES 
(1, 'King Faisal Hospital', 'REFERRAL_HOSPITAL', 500, '1992-01-15', 1),
(2, 'Kigali University Teaching Hospital (CHUK)', 'REFERRAL_HOSPITAL', 600, '1960-05-20', 3),
(3, 'Kibagabaga District Hospital', 'DISTRICT_HOSPITAL', 200, '2006-07-10', 2),
(4, 'Huye District Hospital', 'DISTRICT_HOSPITAL', 150, '2000-03-12', 6),
(5, 'Musanze District Hospital', 'DISTRICT_HOSPITAL', 180, '2008-09-25', 10),
(6, 'Rwamagana Provincial Hospital', 'PUBLIC', 120, '2005-11-30', 4);

-- ========== PERSONS ==========

INSERT INTO persons (id, first_name, last_name, email, phone, date_of_birth, gender, national_id, role, location_id) 
VALUES 
-- Doctors
(1, 'Jean', 'Mukamana', 'jean.mukamana@hospital.rw', '+250788123456', '1980-05-15', 'Female', '1198000012345678', 'DOCTOR', 1),
(2, 'Patrick', 'Niyonzima', 'patrick.niyonzima@hospital.rw', '+250788234567', '1985-08-20', 'Male', '1198500087654321', 'DOCTOR', 3),
(3, 'Grace', 'Uwase', 'grace.uwase@hospital.rw', '+250788345678', '1982-03-10', 'Female', '1198200098765432', 'DOCTOR', 6),

-- Patients
(4, 'Emmanuel', 'Habimana', 'emmanuel.h@email.rw', '+250788456789', '1995-12-25', 'Male', '1199500045678901', 'PATIENT', 1),
(5, 'Marie', 'Uwamahoro', 'marie.uwamahoro@email.rw', '+250788567890', '1990-07-30', 'Female', '1199000056789012', 'PATIENT', 2),
(6, 'David', 'Mugisha', 'david.mugisha@email.rw', '+250788678901', '1988-02-14', 'Male', '1198800067890123', 'PATIENT', 4),
(7, 'Alice', 'Ingabire', 'alice.ingabire@email.rw', '+250788789012', '1992-11-05', 'Female', '1199200078901234', 'PATIENT', 6),
(8, 'Robert', 'Kamanzi', 'robert.kamanzi@email.rw', '+250788890123', '1987-09-18', 'Male', '1198700089012345', 'PATIENT', 10);

-- ========== DOCTORS ==========

INSERT INTO doctors (id, person_id, specialization, license_number, years_of_experience, availability_status, hospital_id) 
VALUES 
(1, 1, 'Cardiology', 'RW-DOC-2005-001', 18, true, 1),
(2, 2, 'Pediatrics', 'RW-DOC-2010-045', 13, true, 2),
(3, 3, 'General Surgery', 'RW-DOC-2008-023', 15, true, 4);

-- ========== PATIENTS ==========

INSERT INTO patients (id, person_id, blood_type, allergies, emergency_contact, registration_date) 
VALUES 
(1, 4, 'O+', 'Penicillin', '+250788111222', '2023-01-15'),
(2, 5, 'A+', 'None', '+250788222333', '2023-03-20'),
(3, 6, 'B+', 'Sulfa drugs', '+250788333444', '2023-05-10'),
(4, 7, 'AB+', 'None', '+250788444555', '2023-07-25'),
(5, 8, 'O-', 'Aspirin', '+250788555666', '2023-09-30');

-- ========== APPOINTMENTS ==========

INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, status, reason, notes) 
VALUES 
(1, 1, 1, '2024-11-20', '09:00:00', 'COMPLETED', 'Routine cardiac checkup', 'Patient stable, continue medication'),
(2, 2, 2, '2024-11-21', '10:30:00', 'COMPLETED', 'Child vaccination', 'All vaccines administered'),
(3, 3, 3, '2024-11-22', '14:00:00', 'SCHEDULED', 'Pre-surgery consultation', NULL),
(4, 4, 1, '2024-11-23', '11:00:00', 'SCHEDULED', 'Follow-up visit', NULL),
(5, 5, 2, '2024-11-24', '15:30:00', 'SCHEDULED', 'General checkup', NULL);

-- ========== MEDICAL RECORDS ==========

INSERT INTO medical_records (id, patient_id, doctor_id, diagnosis, treatment_date, notes) 
VALUES 
(1, 1, 1, 'Hypertension - Stage 1', '2024-11-20', 'Blood pressure 145/95. Prescribed medication and lifestyle changes.'),
(2, 2, 2, 'Routine immunization', '2024-11-21', 'Child received DPT and Polio vaccines. No adverse reactions.'),
(3, 3, 3, 'Appendicitis', '2024-10-15', 'Emergency appendectomy performed successfully. Patient recovered well.');

-- ========== PRESCRIPTIONS ==========

INSERT INTO prescriptions (id, medical_record_id, medication_name, dosage, frequency, duration, instructions) 
VALUES 
(1, 1, 'Amlodipine', '5mg', 'Once daily', '30 days', 'Take in the morning with water'),
(2, 1, 'Hydrochlorothiazide', '12.5mg', 'Once daily', '30 days', 'Take with breakfast'),
(3, 3, 'Amoxicillin', '500mg', 'Three times daily', '7 days', 'Take after meals'),
(4, 3, 'Ibuprofen', '400mg', 'As needed', '5 days', 'For pain relief, max 3 times per day');