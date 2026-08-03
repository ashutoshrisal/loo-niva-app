INSERT INTO organization_settings (
    organization_name,
    logo_url,
    address,
    phone,
    email,
    website,
    facebook,
    instagram,
    youtube,
    mission,
    vision
)
VALUES (
    'Loo Niva Child Concern Group',
    '',
    'Lalitpur, Nepal',
    '+977-1-5592054',
    'info@loonivachild.org.np',
    'https://loonivachild.org.np',
    '',
    '',
    '',
    'Empowering children through education and protection.',
    'A safe and inclusive future for every child.'
)
ON CONFLICT (id)
DO UPDATE SET
organization_name = EXCLUDED.organization_name,
address = EXCLUDED.address,
phone = EXCLUDED.phone,
email = EXCLUDED.email,
website = EXCLUDED.website,
mission = EXCLUDED.mission,
vision = EXCLUDED.vision;
VALUES
(
    1,
    'Loo Niva Child Concern Group',
    'Lalitpur, Nepal',
    'info@loonivachild.org.np',
    '+977-1-5592054'
)
ON CONFLICT (id) DO NOTHING;
INSERT INTO users (
    full_name,
    email,
    password_hash,
    role_id,
    designation
)
VALUES
(
    'System Administrator',
    'admin@loonivachild.org.np',
    '$2b$10$rkfdEH07hPfOcm/LC5T99u/9QfF8Bids5fG/2oXgXva8.QuBd1yby',
    1,
    'Super Admin'
);
INSERT INTO students (
    admission_number,
    student_code,
    full_name,
    gender,
    date_of_birth,
    school_id,
    grade
)
SELECT
    'ADM-' || LPAD(g::text,4,'0'),
    'LNCG-' || LPAD(g::text,4,'0'),
    'Student ' || g,
    CASE
        WHEN g % 2 = 0 THEN 'male'
        ELSE 'female'
    END,
    DATE '2014-01-01' + (g * 30),
    (SELECT id FROM schools LIMIT 1),
    ((g % 10) + 1)::text
FROM generate_series(1,20) g;

INSERT INTO schools
(name,district,municipality)
VALUES
('Shree Jana Secondary School','Lalitpur','Godawari'),
('Bright Future School','Kathmandu','Budhanilkantha'),
('Little Flower School','Bhaktapur','Madhyapur'),
('Bal Bikash School','Lalitpur','Mahalaxmi'),
('Everest Boarding School','Kathmandu','Tokha');
INSERT INTO users
(full_name,email,password_hash,role_id,designation)
SELECT
'Staff '||i,
'staff'||i||'@loonivachild.org.np',
'$2b$10$rkfdEH07hPfOcm/LC5T99u/9QfF8Bids5fG/2oXgXva8.QuBd1yby',
CASE
WHEN i<=2 THEN 2
ELSE 3
END,
CASE
WHEN i<=2 THEN 'Project Manager'
ELSE 'Field Staff'
END
FROM generate_series(1,20) i;
INSERT INTO students
(
student_code,
full_name,
gender,
date_of_birth,
school_id,
grade,
status
)
SELECT

'LNCG-'||LPAD(i::text,4,'0'),

'Student '||i,

CASE
WHEN random()<0.5
THEN 'male'
ELSE 'female'
END,

DATE '2012-01-01'+(random()*2500)::int,

(SELECT id FROM schools ORDER BY random() LIMIT 1),

((random()*7)+5)::int,

'active'

FROM generate_series(1,100) i;
INSERT INTO parents
(
full_name,
phone,
occupation
)
SELECT

'Parent '||i,

'98'||LPAD((floor(random()*99999999))::text,8,'0'),

'Farmer'

FROM generate_series(1,100) i;
INSERT INTO student_parents
(student_id,parent_id)

SELECT

s.id,
p.id

FROM

(
SELECT id,row_number() over() rn
FROM students
) s

JOIN

(
SELECT id,row_number() over() rn
FROM parents
) p

ON s.rn=p.rn;
INSERT INTO sponsors
(
organization_name,
country,
sponsor_type
)

SELECT

'Sponsor Organization '||i,

'Germany',

'organization'

FROM generate_series(1,20) i;
INSERT INTO student_sponsors
(
student_id,
sponsor_id,
monthly_amount,
status
)

SELECT

s.id,
sp.id,
5000,
'active'

FROM

(
SELECT id,row_number() over() rn
FROM students
LIMIT 20
) s

JOIN

(
SELECT id,row_number() over() rn
FROM sponsors
) sp

ON s.rn=sp.rn;