-- ============================================================
-- LOO NIVA ERP v2
-- Core Authentication & Organization
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ROLES
-- ============================================================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,

    name VARCHAR(50) UNIQUE NOT NULL,

    description TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles(name,description) VALUES
('super_admin','Full system access'),
('project_manager','Manages projects'),
('field_staff','Field operations'),
('viewer','Read only');

-- ============================================================
-- STAFF USERS
-- ============================================================

CREATE TABLE users (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    phone VARCHAR(30),

    password_hash TEXT NOT NULL,

    role_id INTEGER NOT NULL REFERENCES roles(id),

    designation VARCHAR(150),

    avatar_url TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    last_login TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- STUDENT LOGIN
-- ============================================================

CREATE TABLE student_accounts (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    username VARCHAR(100) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    last_login TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- PARENT LOGIN
-- ============================================================

CREATE TABLE parent_accounts (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    email VARCHAR(150) UNIQUE,

    phone VARCHAR(30),

    password_hash TEXT NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    last_login TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- SPONSOR LOGIN
-- ============================================================

CREATE TABLE sponsor_accounts (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    email VARCHAR(150) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    last_login TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- ============================================================
-- SCHOOLS
-- ============================================================

CREATE TABLE schools (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(200) NOT NULL,

    address TEXT,

    municipality VARCHAR(150),

    district VARCHAR(100),

    province VARCHAR(100),

    principal_name VARCHAR(150),

    phone VARCHAR(20),

    email VARCHAR(150),

    established_year INTEGER,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDENTS
-- ============================================================

CREATE TABLE students (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_code VARCHAR(30) UNIQUE NOT NULL,

    admission_number VARCHAR(30) UNIQUE NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    gender VARCHAR(20)
        CHECK (gender IN ('male','female','other')),

    date_of_birth DATE,

    blood_group VARCHAR(10),

    nationality VARCHAR(100) DEFAULT 'Nepali',

    phone VARCHAR(20),

    email VARCHAR(150),

    address TEXT,

    municipality VARCHAR(150),

    district VARCHAR(100),

    province VARCHAR(100),

    guardian_name VARCHAR(150),

    guardian_phone VARCHAR(20),

    emergency_contact VARCHAR(20),

    medical_notes TEXT,

    photo_url TEXT,

    school_id UUID
        REFERENCES schools(id),

    grade VARCHAR(20),

    section VARCHAR(20),

    admission_date DATE,

    status VARCHAR(30)
        DEFAULT 'active'
        CHECK (status IN ('active','inactive','graduated','dropped')),

    remarks TEXT,

    created_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PARENTS
-- ============================================================

CREATE TABLE parents (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    full_name VARCHAR(150) NOT NULL,

    gender VARCHAR(20)
        CHECK (gender IN ('male','female','other')),

    relationship VARCHAR(50),

    phone VARCHAR(20),

    email VARCHAR(150),

    occupation VARCHAR(150),

    address TEXT,

    municipality VARCHAR(150),

    district VARCHAR(100),

    province VARCHAR(100),

    citizenship_number VARCHAR(100),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SPONSORS
-- ============================================================

CREATE TABLE sponsors (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    organization_name VARCHAR(200),

    full_name VARCHAR(150),

    country VARCHAR(100),

    phone VARCHAR(20),

    email VARCHAR(150) UNIQUE,

    address TEXT,

    sponsor_type VARCHAR(30)
        CHECK (sponsor_type IN ('individual','organization')),

    status VARCHAR(20)
        DEFAULT 'active'
        CHECK (status IN ('active','inactive','completed')),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDENT ↔ PARENT
-- ============================================================

CREATE TABLE student_parents (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    parent_id UUID NOT NULL
        REFERENCES parents(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(student_id, parent_id)
);

-- ============================================================
-- STUDENT ↔ SPONSOR
-- ============================================================

CREATE TABLE student_sponsors (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    sponsor_id UUID NOT NULL
        REFERENCES sponsors(id)
        ON DELETE CASCADE,

    sponsorship_start DATE,

    sponsorship_end DATE,

    monthly_amount NUMERIC(10,2),

    status VARCHAR(20)
        DEFAULT 'active'
        CHECK (status IN ('active','paused','completed','cancelled')),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(student_id, sponsor_id)
);

-- ============================================================
-- LINK LOGIN TABLES
-- ============================================================

ALTER TABLE student_accounts
ADD COLUMN student_id UUID UNIQUE
REFERENCES students(id)
ON DELETE CASCADE;

ALTER TABLE parent_accounts
ADD COLUMN parent_id UUID UNIQUE
REFERENCES parents(id)
ON DELETE CASCADE;

ALTER TABLE sponsor_accounts
ADD COLUMN sponsor_id UUID UNIQUE
REFERENCES sponsors(id)
ON DELETE CASCADE; 
-- ============================================================
-- ATTENDANCE
-- ============================================================

CREATE TABLE attendance (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    attendance_date DATE NOT NULL,

    status VARCHAR(20)
        CHECK(status IN
        ('present','absent','late','leave')),

    remarks TEXT,

    recorded_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(student_id,attendance_date)
);

-- ============================================================
-- ACADEMIC RECORDS
-- ============================================================

CREATE TABLE academic_records (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    academic_year VARCHAR(20),

    term VARCHAR(30),

    exam_name VARCHAR(100),

    english NUMERIC(5,2),

    nepali NUMERIC(5,2),

    mathematics NUMERIC(5,2),

    science NUMERIC(5,2),

    social NUMERIC(5,2),

    computer NUMERIC(5,2),

    gpa NUMERIC(3,2),

    rank VARCHAR(20),

    remarks TEXT,

    entered_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDENT DOCUMENTS
-- ============================================================

CREATE TABLE student_documents (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    document_type VARCHAR(50)
        CHECK(document_type IN
        (
        'photo',
        'birth_certificate',
        'citizenship',
        'marksheet',
        'report_card',
        'recommendation_letter',
        'medical_report',
        'other'
        )),

    file_url TEXT NOT NULL,

    uploaded_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HEALTH RECORDS
-- ============================================================

CREATE TABLE health_records (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    visit_date DATE,

    height_cm NUMERIC(5,2),

    weight_kg NUMERIC(5,2),

    bmi NUMERIC(5,2),

    blood_group VARCHAR(10),

    medical_condition TEXT,

    medication TEXT,

    doctor_name VARCHAR(150),

    remarks TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- HOME VISITS
-- ============================================================

CREATE TABLE home_visits (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    visit_date DATE,

    visited_by UUID
        REFERENCES users(id),

    purpose TEXT,

    observations TEXT,

    recommendations TEXT,

    next_visit DATE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDENT ACHIEVEMENTS
-- ============================================================

CREATE TABLE achievements (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    title VARCHAR(200),

    description TEXT,

    achievement_date DATE,

    certificate_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE projects (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_code VARCHAR(30) UNIQUE NOT NULL,

    title VARCHAR(200) NOT NULL,

    category VARCHAR(50)
        CHECK(category IN
        (
        'education',
        'child_protection',
        'health',
        'livelihood',
        'advocacy',
        'emergency',
        'other'
        )),

    description TEXT,

    donor_name VARCHAR(200),

    budget NUMERIC(14,2),

    start_date DATE,

    end_date DATE,

    status VARCHAR(20)
        DEFAULT 'planning'
        CHECK(status IN
        (
        'planning',
        'active',
        'completed',
        'cancelled',
        'on_hold'
        )),

    created_by UUID REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECT STAFF
-- ============================================================

CREATE TABLE project_staff (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID
        REFERENCES projects(id)
        ON DELETE CASCADE,

    user_id UUID
        REFERENCES users(id)
        ON DELETE CASCADE,

    designation VARCHAR(100),

    assigned_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(project_id,user_id)
);

-- ============================================================
-- PROJECT STUDENTS
-- ============================================================

CREATE TABLE project_students (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID
        REFERENCES projects(id)
        ON DELETE CASCADE,

    student_id UUID
        REFERENCES students(id)
        ON DELETE CASCADE,

    enrolled_date DATE,

    exited_date DATE,

    status VARCHAR(20)
        DEFAULT 'active'
        CHECK(status IN
        (
        'active',
        'completed',
        'dropped'
        )),

    UNIQUE(project_id,student_id)
);

-- ============================================================
-- PROJECT REPORTS
-- ============================================================

CREATE TABLE project_reports (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID
        REFERENCES projects(id)
        ON DELETE CASCADE,

    title VARCHAR(200),

    report_type VARCHAR(30)
        CHECK(report_type IN
        (
        'daily',
        'weekly',
        'monthly',
        'quarterly',
        'annual'
        )),

    description TEXT,

    file_url TEXT,

    created_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- ACTIVITIES
-- ============================================================

CREATE TABLE activities (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID
        REFERENCES projects(id)
        ON DELETE CASCADE,

    title VARCHAR(200) NOT NULL,

    activity_type VARCHAR(50)
        CHECK(activity_type IN
        (
        'training',
        'meeting',
        'awareness',
        'field_visit',
        'distribution',
        'monitoring',
        'other'
        )),

    description TEXT,

    venue VARCHAR(200),

    activity_date DATE,

    start_time TIME,

    end_time TIME,

    budget NUMERIC(12,2),

    conducted_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY PARTICIPANTS
-- ============================================================

CREATE TABLE activity_participants (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    activity_id UUID
        REFERENCES activities(id)
        ON DELETE CASCADE,

    student_id UUID
        REFERENCES students(id)
        ON DELETE CASCADE,

    attendance_status VARCHAR(20)
        DEFAULT 'present'
        CHECK(attendance_status IN
        (
        'present',
        'absent',
        'late'
        )),

    remarks TEXT,

    UNIQUE(activity_id,student_id)
);

-- ============================================================
-- ACTIVITY PHOTOS
-- ============================================================

CREATE TABLE activity_media (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    activity_id UUID
        REFERENCES activities(id)
        ON DELETE CASCADE,

    media_type VARCHAR(20)
        CHECK(media_type IN ('photo','video','document')),

    file_url TEXT,

    caption TEXT,

    uploaded_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EVENTS
-- ============================================================

CREATE TABLE events (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title VARCHAR(200),

    description TEXT,

    event_date DATE,

    start_time TIME,

    end_time TIME,

    location TEXT,

    organizer UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EVENT PARTICIPANTS
-- ============================================================

CREATE TABLE event_participants (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    event_id UUID
        REFERENCES events(id)
        ON DELETE CASCADE,

    student_id UUID
        REFERENCES students(id)
        ON DELETE CASCADE,

    attendance BOOLEAN DEFAULT TRUE,

    UNIQUE(event_id,student_id)
);
-- ============================================================
-- STAFF LEAVE
-- ============================================================

CREATE TABLE staff_leave (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    leave_type VARCHAR(30)
        CHECK(leave_type IN
        (
        'annual',
        'sick',
        'casual',
        'unpaid',
        'other'
        )),

    start_date DATE NOT NULL,

    end_date DATE NOT NULL,

    reason TEXT,

    status VARCHAR(20)
        DEFAULT 'pending'
        CHECK(status IN
        (
        'pending',
        'approved',
        'rejected'
        )),

    approved_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- OFFICE ASSETS
-- ============================================================

CREATE TABLE assets (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    asset_code VARCHAR(30) UNIQUE,

    asset_name VARCHAR(200),

    category VARCHAR(50),

    purchase_date DATE,

    purchase_price NUMERIC(12,2),

    current_value NUMERIC(12,2),

    assigned_to UUID
        REFERENCES users(id),

    status VARCHAR(30)
        DEFAULT 'available'
        CHECK(status IN
        (
        'available',
        'assigned',
        'repair',
        'disposed'
        )),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INVENTORY
-- ============================================================

CREATE TABLE inventory (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    item_name VARCHAR(200),

    category VARCHAR(100),

    quantity INTEGER,

    unit VARCHAR(20),

    minimum_stock INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXPENSES
-- ============================================================

CREATE TABLE expenses (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID
        REFERENCES projects(id),

    category VARCHAR(100),

    amount NUMERIC(12,2),

    expense_date DATE,

    description TEXT,

    receipt_url TEXT,

    recorded_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DONATIONS
-- ============================================================

CREATE TABLE donations (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    donor_name VARCHAR(200),

    email VARCHAR(150),

    phone VARCHAR(30),

    amount NUMERIC(12,2),

    donation_date DATE,

    payment_method VARCHAR(50),

    remarks TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VEHICLES
-- ============================================================

CREATE TABLE vehicles (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    vehicle_number VARCHAR(30) UNIQUE,

    model VARCHAR(100),

    purchase_date DATE,

    assigned_driver UUID
        REFERENCES users(id),

    status VARCHAR(30)
        DEFAULT 'active',

    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- NEWS
-- ============================================================

CREATE TABLE news (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title VARCHAR(250) NOT NULL,

    slug VARCHAR(250) UNIQUE,

    content TEXT,

    featured_image TEXT,

    published BOOLEAN DEFAULT FALSE,

    published_at TIMESTAMPTZ,

    author UUID REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUCCESS STORIES
-- ============================================================

CREATE TABLE success_stories (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID REFERENCES students(id),

    title VARCHAR(250),

    story TEXT,

    image_url TEXT,

    published BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VOLUNTEERS
-- ============================================================

CREATE TABLE volunteers (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    full_name VARCHAR(150),

    email VARCHAR(150),

    phone VARCHAR(30),

    skills TEXT,

    availability VARCHAR(100),

    status VARCHAR(20)
        DEFAULT 'pending'
        CHECK(status IN ('pending','approved','rejected')),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================

CREATE TABLE contact_messages (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    full_name VARCHAR(150),

    email VARCHAR(150),

    subject VARCHAR(250),

    message TEXT,

    replied BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FAQ
-- ============================================================

CREATE TABLE faqs (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    question TEXT,

    answer TEXT,

    display_order INTEGER DEFAULT 1,

    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================

CREATE TABLE announcements (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title VARCHAR(200),

    message TEXT,

    visible_until DATE,

    created_by UUID REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- LOGIN HISTORY
-- ============================================================

CREATE TABLE login_history (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID REFERENCES users(id),

    ip_address VARCHAR(100),

    device TEXT,

    browser TEXT,

    success BOOLEAN,

    login_time TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USER SESSIONS
-- ============================================================

CREATE TABLE user_sessions (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID REFERENCES users(id),

    refresh_token TEXT,

    expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PASSWORD RESET
-- ============================================================

CREATE TABLE password_resets (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    email VARCHAR(150),

    otp VARCHAR(10),

    expires_at TIMESTAMPTZ,

    verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID REFERENCES users(id),

    title VARCHAR(200),

    message TEXT,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE TABLE audit_logs (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID REFERENCES users(id),

    action VARCHAR(100),

    entity VARCHAR(100),

    entity_id UUID,

    old_data JSONB,

    new_data JSONB,

    ip_address VARCHAR(100),

    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================================
-- ORGANIZATION SETTINGS
-- ============================================================

CREATE TABLE organization_settings (

    id INTEGER PRIMARY KEY DEFAULT 1,

    organization_name VARCHAR(200),

    logo_url TEXT,

    address TEXT,

    phone VARCHAR(30),

    email VARCHAR(150),

    website VARCHAR(200),

    facebook VARCHAR(200),

    instagram VARCHAR(200),

    youtube VARCHAR(200),

    mission TEXT,

    vision TEXT,

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT one_row CHECK(id=1)
);

INSERT INTO organization_settings(id)
VALUES(1);