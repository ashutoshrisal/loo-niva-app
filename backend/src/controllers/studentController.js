const studentModel = require('../models/studentModel');

exports.getStudents = async (req, res) => {

    const students = await studentModel.getAllStudents();

    res.json({
        success: true,
        data: students
    });

};

exports.getStudent = async (req, res) => {

    const student = await studentModel.getStudent(req.params.id);

    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    res.json({
        success: true,
        data: student
    });

};

exports.createStudent = async (req, res) => {

    const student = await studentModel.createStudent(req.body);

    res.status(201).json({
        success: true,
        data: student
    });

};

exports.updateStudent = async (req, res) => {

    const student = await studentModel.updateStudent(
        req.params.id,
        req.body
    );

    res.json({
        success: true,
        data: student
    });

};

exports.deleteStudent = async (req, res) => {

    await studentModel.deleteStudent(req.params.id);

    res.json({
        success: true,
        message: "Student deleted"
    });

};