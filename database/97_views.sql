CREATE VIEW active_students AS
SELECT *
FROM students
WHERE status='active';

CREATE VIEW active_projects AS
SELECT *
FROM projects
WHERE status='active';

CREATE VIEW active_staff AS
SELECT *
FROM users
WHERE is_active=true;

CREATE VIEW active_sponsors AS
SELECT *
FROM sponsors
WHERE status='active';

CREATE VIEW current_attendance AS
SELECT
s.full_name,
a.attendance_date,
a.status
FROM attendance a
JOIN students s
ON s.id=a.student_id;