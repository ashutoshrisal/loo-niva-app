-- ============================================================
-- LOO NIVA NGO Management System - PostgreSQL Schema
-- Organization: Loo Niva Child Concern Group (Lalitpur, Nepal)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- ROLES
-- ------------------------------------------------------------
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('super_admin','project_manager','field_staff','viewer')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO roles (name, description) VALUES
('super_admin', 'Full system access, user management, analytics, approvals'),
('project_manager', 'Creates and manages projects, staff and beneficiaries'),
('field_staff', 'Records field visits, beneficiaries, attendance, daily reports'),
('viewer', 'Read-only access for donors and external stakeholders');

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30),
    password_hash TEXT NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    avatar_url TEXT,
    designation VARCHAR(150),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- ------------------------------------------------------------
-- STUDENT ACCOUNTS
-- ------------------------------------------------------------
CREATE TABLE student_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    beneficiary_id UUID UNIQUE NOT NULL
        REFERENCES beneficiaries(id) ON DELETE CASCADE,

    username VARCHAR(100) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    last_login TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now()
);
-- ------------------------------------------------------------
-- PARENT ACCOUNTS
-- ------------------------------------------------------------
CREATE TABLE parent_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    beneficiary_id UUID NOT NULL
        REFERENCES beneficiaries(id) ON DELETE CASCADE,

    full_name VARCHAR(150),

    email VARCHAR(150) UNIQUE,

    phone VARCHAR(30),

    password_hash TEXT NOT NULL,

    relationship VARCHAR(50),

    is_active BOOLEAN DEFAULT TRUE,

    last_login TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- PROJECTS  (categories mirror Loo Niva's real thematic areas)
-- ------------------------------------------------------------
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('education','participation','advocacy','protection','other')),
    description TEXT,
    objectives TEXT,
    target_location VARCHAR(200),
    funding_source VARCHAR(200),
    budget NUMERIC(14,2) DEFAULT 0,
    budget_utilized NUMERIC(14,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status VARCHAR(30) DEFAULT 'planned' CHECK (status IN ('planned','active','on_hold','completed','cancelled')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE project_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_role VARCHAR(100),
    assigned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(project_id, user_id)
);

-- ------------------------------------------------------------
-- BENEFICIARIES
-- ------------------------------------------------------------
CREATE TABLE beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('male','female','other')),
    date_of_birth DATE,
    age INTEGER,
    address VARCHAR(250),
    phone VARCHAR(30),
    occupation VARCHAR(100),
    category VARCHAR(100), -- e.g. child, parent, teacher, community member
    photo_url TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    registered_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE beneficiaries
ADD COLUMN school_name VARCHAR(200);

ALTER TABLE beneficiaries
ADD COLUMN grade VARCHAR(50);

ALTER TABLE beneficiaries
ADD COLUMN sponsor_name VARCHAR(200);

ALTER TABLE beneficiaries
ADD COLUMN admission_date DATE;

ALTER TABLE beneficiaries
ADD COLUMN emergency_contact VARCHAR(50);

ALTER TABLE beneficiaries
ADD COLUMN blood_group VARCHAR(10);

ALTER TABLE beneficiaries
ADD COLUMN status VARCHAR(30)
DEFAULT 'active';

-- ------------------------------------------------------------
-- ACTIVITIES (field visits, trainings, meetings, etc.)
-- ------------------------------------------------------------
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    activity_date DATE NOT NULL,
    activity_time TIME,
    venue VARCHAR(200),
    participants_count INTEGER DEFAULT 0,
    gps_lat DOUBLE PRECISION,
    gps_lng DOUBLE PRECISION,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE activity_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    media_type VARCHAR(20) CHECK (media_type IN ('photo','document')),
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE activity_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    present BOOLEAN DEFAULT true
);

-- ------------------------------------------------------------
-- REPORTS
-- ------------------------------------------------------------
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    report_type VARCHAR(20) CHECK (report_type IN ('daily','weekly','monthly','annual')),
    title VARCHAR(200) NOT NULL,
    content TEXT,
    file_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    submitted_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- DOCUMENTS (policies, minutes, agreements, financial reports)
-- ------------------------------------------------------------
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('report','meeting_minutes','policy','financial','agreement','other')),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- GALLERY
-- ------------------------------------------------------------
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    media_type VARCHAR(10) CHECK (media_type IN ('image','video')),
    file_url TEXT NOT NULL,
    caption VARCHAR(250),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- EVENTS / CALENDAR
-- ------------------------------------------------------------
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    event_type VARCHAR(30) CHECK (event_type IN ('activity','deadline','meeting','training')),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ,
    location VARCHAR(200),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------------------
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    link VARCHAR(250),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- AUDIT LOGS
-- ------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------
-- ORGANIZATION SETTINGS
-- ------------------------------------------------------------
CREATE TABLE organization_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    org_name VARCHAR(200) DEFAULT 'Loo Niva Child Concern Group',
    logo_url TEXT,
    address VARCHAR(250) DEFAULT 'Lalitpur Metropolitan City-25, Lalitpur, Nepal',
    email VARCHAR(150) DEFAULT 'info@loonivachild.org.np',
    phone VARCHAR(50) DEFAULT '+977-1-5592054',
    theme_primary VARCHAR(20) DEFAULT '#1E3A8A',
    theme_secondary VARCHAR(20) DEFAULT '#16A34A',
    CONSTRAINT single_row CHECK (id = 1)
);
INSERT INTO organization_settings (id) VALUES (1);

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_beneficiaries_project ON beneficiaries(project_id);
CREATE INDEX idx_activities_project ON activities(project_id);
CREATE INDEX idx_activities_date ON activities(activity_date);
CREATE INDEX idx_reports_project ON reports(project_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);

-- ------------------------------------------------------------
-- updated_at trigger helper
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_beneficiaries_updated BEFORE UPDATE ON beneficiaries FOR EACH ROW EXECUTE FUNCTION set_updated_at();
