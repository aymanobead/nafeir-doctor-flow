

# نفير - Nafeir: Doctor Availability Platform

## Overview
A bilingual (Arabic/English) web app for managing doctor availability and hospital task assignments, powered by Supabase for authentication and data storage.

## Pages & Features

### 1. Language & Theme Setup
- Arabic/English toggle button in the header
- RTL support for Arabic, LTR for English
- All text content available in both languages

### 2. Home Page (/)
- Project name: نفير / Nafeir with logo styling
- Description text in selected language
- Two prominent buttons: "Login as Doctor" / "Login as Hospital Admin"
- Google sign-in link below
- Clean, modern centered layout

### 3. Google Authentication
- Supabase Auth with Google provider
- After first login, user selects their role (Doctor or Admin)
- Role stored in a `user_roles` table (secure, separate from profiles)
- Profiles table for storing doctor name and availability info

### 4. Doctor Dashboard (/doctor)
- Welcome message with doctor's name
- Large toggle: Available / Not Available
- When available: dropdown to select duration (6h, 8h, 12h, 24h)
- Counter showing completed tasks
- Availability auto-expires after selected duration

### 5. Admin Dashboard (/admin)
- List of currently available doctors with their chosen duration
- "Assign Task" button next to each doctor
- Clicking assigns a task and notifies the doctor (shown as a status update/toast)
- Simple task tracking per doctor

### 6. Database Tables
- `profiles` — name, avatar (linked to auth.users)
- `user_roles` — role assignment (doctor/admin) with secure RLS
- `doctor_availability` — availability status, duration, expiry time
- `tasks` — assigned tasks with status tracking

### 7. Footer
- Fixed footer on all pages with the required attribution text

### 8. Security
- RLS policies on all tables
- Role-based access: doctors see only their dashboard, admins see available doctors
- Secure role checking via `has_role` function

