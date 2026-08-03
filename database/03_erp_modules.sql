CREATE TABLE attendance (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    attendance_date DATE NOT NULL,

    status VARCHAR(20)
        CHECK(status IN ('present','absent','leave')),

    remarks TEXT,

    recorded_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(student_id, attendance_date)
);
CREATE TABLE health_records (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID NOT NULL
        REFERENCES students(id)
        ON DELETE CASCADE,

    height_cm NUMERIC(5,2),

    weight_kg NUMERIC(5,2),

    blood_group VARCHAR(10),

    allergies TEXT,

    medical_notes TEXT,

    checked_by UUID
        REFERENCES users(id),

    checkup_date DATE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE home_visits (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID
        REFERENCES students(id)
        ON DELETE CASCADE,

    staff_id UUID
        REFERENCES users(id),

    visit_date DATE,

    purpose TEXT,

    findings TEXT,

    recommendations TEXT,

    next_visit DATE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE donations (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    sponsor_id UUID
        REFERENCES sponsors(id),

    amount NUMERIC(12,2),

    donation_date DATE,

    payment_method VARCHAR(50),

    remarks TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE scholarships (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    student_id UUID
        REFERENCES students(id),

    sponsor_id UUID
        REFERENCES sponsors(id),

    amount NUMERIC(12,2),

    start_date DATE,

    end_date DATE,

    status VARCHAR(20)
        DEFAULT 'active'
        CHECK(status IN ('active','completed','cancelled'))
);
CREATE TABLE expenses (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title VARCHAR(200),

    amount NUMERIC(12,2),

    expense_date DATE,

    category VARCHAR(100),

    project_id UUID
        REFERENCES projects(id),

    created_by UUID
        REFERENCES users(id),

    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE inventory (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    item_name VARCHAR(200),

    quantity INTEGER,

    unit VARCHAR(30),

    category VARCHAR(100),

    location TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);