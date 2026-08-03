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
        `SELECT * FROM students WHERE id = $1`,
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
            status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
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
            student.status
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
id
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