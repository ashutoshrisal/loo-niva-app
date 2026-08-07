const { query } = require('../config/db');

async function getAllStudents() {
    const result = await query(`
        SELECT
            s.id,
            s.student_code,
            s.admission_number,
            s.full_name,
            s.gender,
            s.grade,
            s.section,
            s.status,
            sc.name AS school
        FROM students s
        LEFT JOIN schools sc
            ON sc.id = s.school_id
        ORDER BY s.full_name
    `);

    return result.rows;
}

async function getStudent(id) {
    const result = await query(
        `
        SELECT
            s.*,
            sc.name AS school
        FROM students s
        LEFT JOIN schools sc
            ON sc.id = s.school_id
        WHERE s.id = $1
        `,
        [id]
    );

    return result.rows[0];
}

async function createStudent(student) {
    const result = await query(
        `
        INSERT INTO students
        (
            student_code,
            admission_number,
            full_name,
            gender,
            grade,
            section,
            school_id,
            status,
            photo_url
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *;
        `,
        [
            student.student_code,
            student.admission_number,
            student.full_name,
            student.gender,
            student.grade,
            student.section,
            student.school_id,
            student.status,
            student.photo_url || null
        ]
    );

    return result.rows[0];
}

async function updateStudent(id, student) {

    const result = await query(
`
UPDATE students
SET
student_code=$1,
admission_number=$2,
full_name=$3,
gender=$4,
grade=$5,
section=$6,
school_id=$7,
status=$8,
photo_url=$10,
updated_at=NOW()

WHERE id=$9

RETURNING *;
`,
[
student.student_code,
student.admission_number,
student.full_name,
student.gender,
student.grade,
student.section,
student.school_id,
student.status,
id,
student.photo_url || null
]
);

return result.rows[0];

}
async function deleteStudent(id) {
    await query(
        `DELETE FROM students WHERE id = $1`,
        [id]
    );
}

module.exports = {
    getAllStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
};