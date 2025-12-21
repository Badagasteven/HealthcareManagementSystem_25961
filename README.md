# Healthcare Management System

## 👨‍💻 Project Information

- **Name:** IRANKUNDA BADAGA Steven
- **Student ID:** 25961
- **Email:** badagaclass@gmail.com
- **GitHub:** [HealthcareManagementSystem_25961](https://github.com/Badagasteven/HealthcareManagementSystem_25961)
- **Submission Date:** November 30, 2025

---

## 📋 Project Overview

**Project Name:** Healthcare Management System  
**Technology Stack:** Spring Boot 3.2.0, Java 17, PostgreSQL/MySQL, Spring Data JPA

A comprehensive Healthcare Management System built with Spring Boot that manages patients, doctors, appointments, medical records, and hospitals across Rwanda's administrative structure. The system implements complete CRUD operations, JPA relationships, and location-based queries following Rwandan geographical hierarchy.

---

## 🏗️ System Architecture

### Entities (8 Classes)

1. **Location** - Rwandan administrative structure (Province → District → Sector → Cell → Village)
2. **Person** - Base user entity with location relationship
3. **Hospital** - Healthcare facilities with location
4. **Doctor** - Medical practitioners (One-to-One with Person)
5. **Patient** - Registered patients (One-to-One with Person)
6. **Appointment** - Scheduled medical appointments
7. **MedicalRecord** - Patient treatment history
8. **Prescription** - Medication prescriptions

---

## 🔗 Entity Relationships

### One-to-One Relationships
- `Person` ↔ `Doctor`
- `Person` ↔ `Patient`

### One-to-Many / Many-to-One Relationships
- `Location` → `Person` (Many persons in one location)
- `Location` → `Hospital` (Many hospitals in one location)
- `Hospital` → `Doctor` (Many doctors in one hospital)
- `Patient` → `Appointment` (One patient, many appointments)
- `Doctor` → `Appointment` (One doctor, many appointments)
- `Patient` → `MedicalRecord` (One patient, many records)
- `Doctor` → `MedicalRecord` (One doctor creates many records)
- `MedicalRecord` → `Prescription` (One record, many prescriptions)

### Many-to-Many Relationship
- `MedicalRecord` ↔ `Medication` (through Prescription join table)

---

<img width="1014" height="1021" alt="codes drawio" src="https://github.com/user-attachments/assets/ad3988d8-9f77-4dce-8567-124ebadc8b2f" />


## 🚀 Setup Instructions

### Prerequisites

- Java 22
- Maven 3.6+
- PostgreSQL 15
- Git
- IDE: VS Code

### 1. Clone the Repository

```bash
git clone https://github.com/Badagasteven/HealthcareManagementSystem_25961.git
cd HealthcareManagementSystem_25961
```

### 2. Database Setup

**For PostgreSQL:**
```sql
CREATE DATABASE healthcare_db;
```

**For MySQL:**
```sql
CREATE DATABASE healthcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure Database Connection

Edit `src/main/resources/application.properties`:

**PostgreSQL Configuration:**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/healthcare_db
spring.datasource.username=postgres
spring.datasource.password=1930
```

### 4. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on **http://localhost:8080**

---

## 📡 API Endpoints

### Person Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/persons` | Create a new person |
| GET | `/api/persons` | Get all persons |
| GET | `/api/persons/{id}` | Get person by ID |
| GET | `/api/persons/by-province-code/{code}` | Get users by province code ✅ |
| GET | `/api/persons/by-province-name/{name}` | Get users by province name ✅ |
| GET | `/api/persons/{userId}/location` | Get province from user ✅ |
| GET | `/api/persons/role/{role}` | Get persons by role |
| GET | `/api/persons/search?name={name}` | Search by name |
| PUT | `/api/persons/{id}` | Update person |
| DELETE | `/api/persons/{id}` | Delete person |
| GET | `/api/persons/role/{role}/paginated` | Get persons with pagination |

### Location Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/locations` | Create location |
| GET | `/api/locations` | Get all locations |
| GET | `/api/locations/{id}` | Get location by ID |
| GET | `/api/locations/province-code/{code}` | Get by province code |
| GET | `/api/locations/province-name/{name}` | Get by province name |
| PUT | `/api/locations/{id}` | Update location |
| DELETE | `/api/locations/{id}` | Delete location |

### Hospital Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/hospitals` | Create hospital |
| GET | `/api/hospitals` | Get all hospitals |
| GET | `/api/hospitals/{id}` | Get hospital by ID |
| GET | `/api/hospitals/province/{code}` | Get hospitals by province |
| GET | `/api/hospitals/type/{type}` | Get hospitals by type |
| PUT | `/api/hospitals/{id}` | Update hospital |
| DELETE | `/api/hospitals/{id}` | Delete hospital |

### Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/doctors` | Create doctor |
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/doctors/{id}` | Get doctor by ID |
| GET | `/api/doctors/specialization/{spec}` | Get by specialization |
| GET | `/api/doctors/hospital/{hospitalId}` | Get by hospital |
| GET | `/api/doctors/available` | Get available doctors |
| PUT | `/api/doctors/{id}` | Update doctor |
| DELETE | `/api/doctors/{id}` | Delete doctor |

### Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/patients` | Create patient |
| GET | `/api/patients` | Get all patients |
| GET | `/api/patients/{id}` | Get patient by ID |
| GET | `/api/patients/blood-type/{type}` | Get by blood type |
| PUT | `/api/patients/{id}` | Update patient |
| DELETE | `/api/patients/{id}` | Delete patient |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments` | Get all appointments |
| GET | `/api/appointments/{id}` | Get appointment by ID |
| GET | `/api/appointments/patient/{patientId}` | Get by patient |
| GET | `/api/appointments/doctor/{doctorId}` | Get by doctor |
| GET | `/api/appointments/status/{status}` | Get by status |
| GET | `/api/appointments/today` | Get today's appointments |
| PUT | `/api/appointments/{id}` | Update appointment |
| DELETE | `/api/appointments/{id}` | Delete appointment |

### Medical Record Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/medical-records` | Create medical record |
| GET | `/api/medical-records` | Get all records |
| GET | `/api/medical-records/{id}` | Get record by ID |
| GET | `/api/medical-records/patient/{patientId}` | Get by patient |
| GET | `/api/medical-records/doctor/{doctorId}` | Get by doctor |
| PUT | `/api/medical-records/{id}` | Update record |
| DELETE | `/api/medical-records/{id}` | Delete record |

### Prescription Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/prescriptions` | Create prescription |
| GET | `/api/prescriptions` | Get all prescriptions |
| GET | `/api/prescriptions/{id}` | Get prescription by ID |
| GET | `/api/prescriptions/medical-record/{id}` | Get by medical record |
| PUT | `/api/prescriptions/{id}` | Update prescription |
| DELETE | `/api/prescriptions/{id}` | Delete prescription |

---

## 🔍 JPA Repository Methods Demonstrated

### findBy Queries
- `findByLocationProvinceCode(String provinceCode)`
- `findByLocationProvinceName(String provinceName)`
- `findBySpecialization(String specialization)`
- `findByBloodType(String bloodType)`
- `findByHospitalId(Long hospitalId)`
- `findByAppointmentDateBetween(LocalDate start, LocalDate end)`

### existsBy Queries
- `existsByEmail(String email)`
- `existsByNationalId(String nationalId)`
- `existsByLicenseNumber(String licenseNumber)`
- `existsByDoctorIdAndAppointmentDateAndAppointmentTime(...)`

### Sorting
- `findAllByOrderByFirstNameAsc()`
- `findByRoleOrderByLastNameAsc(Role role)`
- `findBySpecializationOrderByYearsOfExperienceDesc(String specialization)`

### Pagination
- `Page<Person> findByRole(Role role, Pageable pageable)`
- `Page<Doctor> findBySpecialization(String spec, Pageable pageable)`
- `Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable)`

---

## 🗺️ Rwandan Location Hierarchy

The system accurately represents Rwanda's administrative structure:

```
Province (5 Provinces)
├── District (30 Districts)
    ├── Sector (416 Sectors)
        ├── Cell (2,148 Cells)
            └── Village (14,837 Villages)
```

### Sample Provinces

1. **Kigali** (Province Code: 01)
2. **Eastern Province** (Province Code: 02)
3. **Southern Province** (Province Code: 03)
4. **Western Province** (Province Code: 04)
5. **Northern Province** (Province Code: 05)

---

## 🧪 Testing with Postman

### 1. Create a Location

```http
POST http://localhost:8080/api/locations
Content-Type: application/json

{
  "provinceCode": "01",
  "provinceName": "Kigali",
  "districtCode": "0101",
  "districtName": "Gasabo",
  "sectorCode": "010101",
  "sectorName": "Remera",
  "cellCode": "01010101",
  "cellName": "Rukiri I",
  "villageName": "Amahoro"
}
```

### 2. Create a Person

```http
POST http://localhost:8080/api/persons
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Mukamana",
  "email": "jean.mukamana@hospital.rw",
  "phone": "+250788123456",
  "dateOfBirth": "1980-05-15",
  "gender": "Female",
  "nationalId": "1198000012345678",
  "role": "DOCTOR",
  "location": {
    "id": 1
  }
}
```

### 3. Get Users by Province Code (REQUIRED)

```http
GET http://localhost:8080/api/persons/by-province-code/01
```

### 4. Get Users by Province Name (REQUIRED)

```http
GET http://localhost:8080/api/persons/by-province-name/Kigali
```

### 5. Get Province from User (REQUIRED)

```http
GET http://localhost:8080/api/persons/1/location
```

### 6. Create a Hospital

```http
POST http://localhost:8080/api/hospitals
Content-Type: application/json

{
  "name": "King Faisal Hospital",
  "type": "REFERRAL_HOSPITAL",
  "capacity": 500,
  "registrationDate": "1992-01-15",
  "location": {
    "id": 1
  }
}
```

### 7. Create a Doctor

```http
POST http://localhost:8080/api/doctors
Content-Type: application/json

{
  "person": {
    "id": 1
  },
  "specialization": "Cardiology",
  "licenseNumber": "RW-DOC-2005-001",
  "yearsOfExperience": 18,
  "availabilityStatus": true,
  "hospital": {
    "id": 1
  }
}
```

### 8. Create a Patient

```http
POST http://localhost:8080/api/patients
Content-Type: application/json

{
  "person": {
    "id": 4
  },
  "bloodType": "O+",
  "allergies": "Penicillin",
  "emergencyContact": "+250788111222",
  "registrationDate": "2023-01-15"
}
```

### 9. Create an Appointment

```http
POST http://localhost:8080/api/appointments
Content-Type: application/json

{
  "patient": {
    "id": 1
  },
  "doctor": {
    "id": 1
  },
  "appointmentDate": "2024-11-25",
  "appointmentTime": "09:00:00",
  "status": "SCHEDULED",
  "reason": "Routine cardiac checkup",
  "notes": null
}
```

### 10. Pagination Example

```http
GET http://localhost:8080/api/persons/role/PATIENT/paginated?page=0&size=5
```

---

## 🎯 Project Requirements Checklist

### ✅ Technical Requirements Met

- [x] 5+ Well-defined Entities (8 entities implemented)
- [x] Complete CRUD for all entities
- [x] JPA findBy... queries (20+ different queries)
- [x] JPA existsBy... queries (5+ implemented)
- [x] Sorting implemented (Multiple entities)
- [x] Pagination implemented (All major entities)
- [x] Rwandan Location Table (Province → District → Sector → Cell → Village)
- [x] Person-Location Relationship (Many-to-One)
- [x] API: Get users by province code
- [x] API: Get users by province name
- [x] API: Get province from user
- [x] One-to-One Relationships (Person-Doctor, Person-Patient)
- [x] One-to-Many Relationships (6+ relationships)
- [x] Many-to-Many Relationship (MedicalRecord-Medication via Prescription)

---

## 📁 Project Structure

```
HealthcareManagementSystem/
│
├── src/
│   ├── main/
│   │   ├── java/com/healthcare/
│   │   │   ├── controller/
│   │   │   │   ├── PersonController.java
│   │   │   │   ├── LocationController.java
│   │   │   │   ├── HospitalController.java
│   │   │   │   ├── DoctorController.java
│   │   │   │   ├── PatientController.java
│   │   │   │   ├── AppointmentController.java
│   │   │   │   ├── MedicalRecordController.java
│   │   │   │   └── PrescriptionController.java
│   │   │   │
│   │   │   ├── model/
│   │   │   │   ├── Person.java
│   │   │   │   ├── Location.java
│   │   │   │   ├── Hospital.java
│   │   │   │   ├── Doctor.java
│   │   │   │   ├── Patient.java
│   │   │   │   ├── Appointment.java
│   │   │   │   ├── MedicalRecord.java
│   │   │   │   └── Prescription.java
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── PersonRepository.java
│   │   │   │   ├── LocationRepository.java
│   │   │   │   ├── HospitalRepository.java
│   │   │   │   ├── DoctorRepository.java
│   │   │   │   ├── PatientRepository.java
│   │   │   │   ├── AppointmentRepository.java
│   │   │   │   ├── MedicalRecordRepository.java
│   │   │   │   └── PrescriptionRepository.java
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── PersonService.java
│   │   │   │   ├── LocationService.java
│   │   │   │   ├── HospitalService.java
│   │   │   │   ├── DoctorService.java
│   │   │   │   ├── PatientService.java
│   │   │   │   ├── AppointmentService.java
│   │   │   │   ├── MedicalRecordService.java
│   │   │   │   └── PrescriptionService.java
│   │   │   │
│   │   │   └── HealthcareApplication.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql
│   │
│   └── test/
│       └── java/com/healthcare/
│
├── pom.xml
└── README.md
```

---

## 🎓 Key Features for Presentation

### 1. Location-Based Queries

Demonstrate how to retrieve users from specific provinces:

```java
// By province code
GET /api/persons/by-province-code/01

// By province name
GET /api/persons/by-province-name/Kigali

// Get user's location
GET /api/persons/1/location
```

### 2. Relationship Types

Show examples of all three relationship types in your code:

- **One-to-One:** Doctor-Person relationship
- **One-to-Many:** Hospital-Doctor relationship
- **Many-to-Many:** MedicalRecord-Medication through Prescription

### 3. JPA Query Methods

Explain how Spring Data JPA creates queries from method names:

```java
findByLocationProvinceCode() // SELECT * FROM persons WHERE location.province_code = ?
existsByEmail() // SELECT COUNT(*) > 0 FROM persons WHERE email = ?
```

### 4. Pagination & Sorting

Show how to retrieve paginated results:

```java
Page<Doctor> doctors = doctorService.getDoctorsBySpecialization(
    "Cardiology", 
    PageRequest.of(0, 10)
);
```

---

## 📚 References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Rwanda Administrative Divisions](https://en.wikipedia.org/wiki/Administrative_divisions_of_Rwanda)
- [Baeldung JPA Relationships](https://www.baeldung.com/jpa-hibernate-associations)

---



**© 2025 IRANKUNDA BADAGA Steven | Student ID: 25961**
