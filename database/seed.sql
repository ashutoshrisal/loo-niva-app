-- ============================================================
-- SEED DATA - Loo Niva Child Concern Group
-- Password for all sample users is: Password123!
-- (the bcrypt hash below is a genuine hash of that exact password,
--  verified to round-trip correctly - still replace it in production)
-- ============================================================

INSERT INTO users (full_name, email, phone, password_hash, role_id, designation, is_active) VALUES
('Ashutosh Risal', 'admin@loonivachild.org.np', '+977-9849414481', '$2b$12$gUjiuywTfQcfqIVKBohY1OchzN6JUuQJUlav.S/iXzEfscEPuBGMO', 1, 'Executive Director', true),
('Ramesh Tamang', 'pm.education@loonivachild.org.np', '+977-9841000002', '$2b$12$gUjiuywTfQcfqIVKBohY1OchzN6JUuQJUlav.S/iXzEfscEPuBGMO', 2, 'Project Manager - Education', true),
('Anita Gurung', 'field.reap@loonivachild.org.np', '+977-9841000003', '$2b$12$gUjiuywTfQcfqIVKBohY1OchzN6JUuQJUlav.S/iXzEfscEPuBGMO', 3, 'Field Officer - REAP', true),
('Donor Partner', 'donor@example.org', '+977-9841000004', '$2b$12$gUjiuywTfQcfqIVKBohY1OchzN6JUuQJUlav.S/iXzEfscEPuBGMO', 4, 'Partner Representative', true);

-- Projects based on Loo Niva's real, publicly listed programs
INSERT INTO projects (title, category, description, objectives, target_location, funding_source, budget, budget_utilized, start_date, end_date, status, progress_percentage, created_by)
SELECT 'REAP - Rural Education Advancement Project', 'education',
       'Strengthens access to quality education for marginalized children in partnership with Patan CBR and Interpedia Finland.',
       'Improve school enrollment, retention and learning outcomes for marginalized children.',
       'Bagmati Province, Nepal', 'Interpedia Finland / Patan CBR', 4500000, 2100000,
       '2025-01-01', '2026-12-31', 'active', 55, id
FROM users WHERE email = 'admin@loonivachild.org.np';

INSERT INTO projects (title, category, description, objectives, target_location, funding_source, budget, budget_utilized, start_date, end_date, status, progress_percentage, created_by)
SELECT 'Right to Education Campaign (Education Watch)', 'advocacy',
       'A people-centric national movement monitoring compliance with the right to education and holding stakeholders accountable.',
       'Monitor national and local compliance on right to education and seek remedies where needed.',
       'Nationwide, Nepal', 'National Campaign for Education (NCE) Nepal', 1200000, 640000,
       '2024-06-01', '2026-06-01', 'active', 60, id
FROM users WHERE email = 'admin@loonivachild.org.np';

INSERT INTO projects (title, category, description, objectives, target_location, funding_source, budget, budget_utilized, start_date, end_date, status, progress_percentage, created_by)
SELECT 'Child Marriage & Digital Violence Prevention', 'protection',
       'Provincial-level dialogue and youth-led action addressing child marriage and its impact on education, alongside digital violence prevention.',
       'Reduce incidence of child marriage; raise awareness on digital violence among youth.',
       'Konjyosom Rural Municipality, Bagmati Province', 'Loo Niva / Local Government Partnership', 800000, 500000,
       '2025-09-01', '2026-03-01', 'completed', 100, id
FROM users WHERE email = 'admin@loonivachild.org.np';

INSERT INTO projects (title, category, description, objectives, target_location, funding_source, budget, budget_utilized, start_date, end_date, status, progress_percentage, created_by)
SELECT 'Child Club Network Formation', 'participation',
       'Forms and strengthens child clubs to build the capacity of children and communities for democratic participation.',
       'Establish active, functioning child clubs with elected representation across program schools.',
       'Lalitpur District, Nepal', 'Loo Niva Core Funds', 350000, 90000,
       '2026-02-01', '2026-11-30', 'active', 25, id
FROM users WHERE email = 'admin@loonivachild.org.np';

-- Sample beneficiaries
INSERT INTO beneficiaries (full_name, gender, age, address, phone, occupation, category, project_id)
SELECT 'Sabina Lama', 'female', 12, 'Konjyosom-4, Bagmati Province', '+977-9800000011', 'Student', 'child',
       (SELECT id FROM projects WHERE title LIKE 'REAP%');

INSERT INTO beneficiaries (full_name, gender, age, address, phone, occupation, category, project_id)
SELECT 'Bishal Rai', 'male', 14, 'Lalitpur-18, Nepal', '+977-9800000012', 'Student', 'child',
       (SELECT id FROM projects WHERE title LIKE 'Child Club%');

-- Sample activity
INSERT INTO activities (project_id, title, description, activity_date, venue, participants_count, recorded_by)
SELECT (SELECT id FROM projects WHERE title LIKE 'REAP%'),
       'Social Appraisal 2025', 'Social appraisal conducted to strengthen accountability and inclusion in the REAP project.',
       '2025-12-11', 'Patan CBR Center', 45,
       (SELECT id FROM users WHERE email = 'field.reap@loonivachild.org.np');

-- Sample report
INSERT INTO reports (project_id, report_type, title, content, status, submitted_by, period_start, period_end)
SELECT (SELECT id FROM projects WHERE title LIKE 'REAP%'),
       'annual', 'REAP Annual Review 2025-2026',
       'Annual review highlighting achievements and path forward for the REAP project, completed with Patan CBR and Interpedia Finland.',
       'approved',
       (SELECT id FROM users WHERE email = 'pm.education@loonivachild.org.np'),
       '2025-01-01', '2025-12-31';
