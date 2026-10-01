import express from 'express';

const router = express.Router();

// ===================================================================
// IN-MEMORY TEMPORARY DATA STORAGE (Experiment 6)
// ===================================================================
// Mock in-memory students array - no external database used
let students = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    course: 'Cloud Computing'
  },
  {
    id: 2,
    name: 'Ananya Patel',
    email: 'ananya@example.com',
    course: 'Full Stack Development'
  }
];

// Counter for auto-generating unique numeric IDs
let nextStudentId = 3;

// ===================================================================
// 1. READ ALL STUDENTS (GET /api/students)
// ===================================================================
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// ===================================================================
// 2. READ ONE STUDENT BY ID (GET /api/students/:id)
// ===================================================================
router.get('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  if (isNaN(studentId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID. ID must be a number'
    });
  }

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// ===================================================================
// 3. CREATE NEW STUDENT (POST /api/students)
// ===================================================================
router.post('/', (req, res) => {
  const { name, email, course } = req.body;

  // Validation: ensure name, email, and course are provided and non-empty
  if (
    !name ||
    !email ||
    !course ||
    !String(name).trim() ||
    !String(email).trim() ||
    !String(course).trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: 'name', 'email', and 'course' are required fields"
    });
  }

  const newStudent = {
    id: nextStudentId++,
    name: String(name).trim(),
    email: String(email).trim(),
    course: String(course).trim()
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: newStudent
  });
});

// ===================================================================
// 4. UPDATE STUDENT (PUT /api/students/:id)
// ===================================================================
router.put('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  if (isNaN(studentId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID. ID must be a number'
    });
  }

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  const { name, email, course } = req.body;

  if (name === undefined && email === undefined && course === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Please provide at least one field to update (name, email, or course)'
    });
  }

  if (name !== undefined) {
    if (!String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'name' cannot be empty"
      });
    }
    student.name = String(name).trim();
  }

  if (email !== undefined) {
    if (!String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'email' cannot be empty"
      });
    }
    student.email = String(email).trim();
  }

  if (course !== undefined) {
    if (!String(course).trim()) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'course' cannot be empty"
      });
    }
    student.course = String(course).trim();
  }

  res.status(200).json({
    success: true,
    message: 'Student updated successfully',
    data: student
  });
});

// ===================================================================
// 5. DELETE STUDENT (DELETE /api/students/:id)
// ===================================================================
router.delete('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  if (isNaN(studentId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID. ID must be a number'
    });
  }

  const studentIndex = students.findIndex((s) => s.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  const [deletedStudent] = students.splice(studentIndex, 1);

  res.status(200).json({
    success: true,
    message: 'Student deleted successfully',
    data: deletedStudent
  });
});

export default router;
