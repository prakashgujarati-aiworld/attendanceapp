const express = require("express");
const fs = require("fs");
const path = require("path");

const students = require("./students");

const app = express();
const PORT = 3000;

const attendanceFile = path.join(__dirname, "attendance.txt");

app.use(express.static("public"));


// ============================================
// Student Attendance
// GET /api/attendance/:rollNo
// ============================================

app.get("/api/attendance/:rollNo", (req, res) => {

    const rollNo = Number(req.params.rollNo);

    // Find student
    const student = students.find(
        student => student.rollNo === rollNo
    );

    // Invalid roll number
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Invalid roll number"
        });
    }


    // Read attendance file
    let attendance = "";

    if (fs.existsSync(attendanceFile)) {
        attendance = fs.readFileSync(
            attendanceFile,
            "utf8"
        ).trim();
    }


    // Convert comma separated values into array
    let rollNumbers = attendance
        ? attendance.split(",")
        : [];


    // Check duplicate attendance
    if (rollNumbers.includes(String(rollNo))) {

        return res.json({
            success: true,
            message: "Attendance already marked",
            student: {
                rollNo: student.rollNo,
                name: student.name,
                enrollmentNo: student.enrollmentNo
            }
        });
    }


    // Add roll number
    rollNumbers.push(String(rollNo));


    // Save comma separated roll numbers
    fs.writeFileSync(
        attendanceFile,
        rollNumbers.join(",")
    );


    // Response
    res.json({
        success: true,
        message: "Attendance marked successfully",
        student: {
            rollNo: student.rollNo,
            name: student.name,
            enrollmentNo: student.enrollmentNo
        }
    });

});


// ============================================
// Faculty Attendance
// GET /api/faculty
// ============================================

app.get("/api/faculty", (req, res) => {

    let attendance = "";

    if (fs.existsSync(attendanceFile)) {
        attendance = fs.readFileSync(
            attendanceFile,
            "utf8"
        ).trim();
    }


    const rollNumbers = attendance
        ? attendance.split(",").map(Number)
        : [];


    const attendanceStudents = students.filter(
        student => rollNumbers.includes(student.rollNo)
    );


    res.json({
        success: true,
        totalPresent: attendanceStudents.length,
        attendance: attendanceStudents
    });

});


// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});