-- USERS
CREATE INDEX idx_users_role_id ON users(role_id);

-- STUDENTS
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_created_by ON students(created_by);

-- STUDENT PARENTS
CREATE INDEX idx_student_parents_student ON student_parents(student_id);
CREATE INDEX idx_student_parents_parent ON student_parents(parent_id);

-- STUDENT SPONSORS
CREATE INDEX idx_student_sponsors_student ON student_sponsors(student_id);
CREATE INDEX idx_student_sponsors_sponsor ON student_sponsors(sponsor_id);

-- ATTENDANCE
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);

-- HEALTH
CREATE INDEX idx_health_student ON health_records(student_id);

-- HOME VISITS
CREATE INDEX idx_home_student ON home_visits(student_id);

-- PROJECTS
CREATE INDEX idx_project_status ON projects(status);

-- PROJECT STAFF
CREATE INDEX idx_project_staff_project ON project_staff(project_id);
CREATE INDEX idx_project_staff_user ON project_staff(user_id);

-- PROJECT STUDENTS
CREATE INDEX idx_project_students_project ON project_students(project_id);
CREATE INDEX idx_project_students_student ON project_students(student_id);

-- ACTIVITIES
CREATE INDEX idx_activity_project ON activities(project_id);
CREATE INDEX idx_activity_date ON activities(activity_date);

-- ACTIVITY PARTICIPANTS
CREATE INDEX idx_activity_participants_activity
ON activity_participants(activity_id);

CREATE INDEX idx_activity_participants_student
ON activity_participants(student_id);

-- EXPENSES
CREATE INDEX idx_expense_project
ON expenses(project_id);

-- LOGIN HISTORY
CREATE INDEX idx_login_history_user
ON login_history(user_id);

-- NOTIFICATIONS
CREATE INDEX idx_notifications_user
ON notifications(user_id);

-- AUDIT
CREATE INDEX idx_audit_user
ON audit_logs(user_id);