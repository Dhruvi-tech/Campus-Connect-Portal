import express from 'express';
import mongoose from 'mongoose';
import Student from '../models/Student.js';

const router = express.Router();

// ===================================================================
// 1. READ ALL STUDENTS (GET /api/students)
// ===================================================================
router.get('/', async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
});

// ===================================================================
// 2. READ ONE STUDENT BY ID (GET /api/students/:id)
// ===================================================================
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
});

// ===================================================================
// 3. CREATE NEW STUDENT (POST /api/students)
// ===================================================================
router.post('/', async (req, res, next) => {
  try {
    const { name, usn, department, marks } = req.body;

    // Validation 1: Required fields presence
    if (
      !name ||
      !usn ||
      !department ||
      marks === undefined ||
      marks === null ||
      marks === ''
    ) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: name, usn, department, and marks are all required'
      });
    }

    // Validation 2: Marks range (0 to 100)
    const numericMarks = Number(marks);
    if (isNaN(numericMarks) || numericMarks < 0 || numericMarks > 100) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: marks must be a number between 0 and 100'
      });
    }

    const formattedUSN = String(usn).trim().toUpperCase();

    // Validation 3: Check duplicate USN
    const existingStudent = await Student.findOne({ usn: formattedUSN });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: `Duplicate USN Error: A student with USN "${formattedUSN}" already exists`
      });
    }

    const newStudent = await Student.create({
      name: String(name).trim(),
      usn: formattedUSN,
      department: String(department).trim(),
      marks: numericMarks
    });

    return res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: newStudent
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate USN Error: A student with this USN already exists'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
});

// ===================================================================
// 4. UPDATE STUDENT (PUT /api/students/:id)
// ===================================================================
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const { name, usn, department, marks } = req.body;

    if (
      name === undefined &&
      usn === undefined &&
      department === undefined &&
      marks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Please provide at least one field to update'
      });
    }

    const updateFields = {};

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Validation Error: 'name' cannot be empty"
        });
      }
      updateFields.name = String(name).trim();
    }

    if (department !== undefined) {
      if (!String(department).trim()) {
        return res.status(400).json({
          success: false,
          message: "Validation Error: 'department' cannot be empty"
        });
      }
      updateFields.department = String(department).trim();
    }

    if (marks !== undefined) {
      const numericMarks = Number(marks);
      if (isNaN(numericMarks) || numericMarks < 0 || numericMarks > 100) {
        return res.status(400).json({
          success: false,
          message: 'Validation Error: marks must be a number between 0 and 100'
        });
      }
      updateFields.marks = numericMarks;
    }

    if (usn !== undefined) {
      const formattedUSN = String(usn).trim().toUpperCase();
      if (!formattedUSN) {
        return res.status(400).json({
          success: false,
          message: "Validation Error: 'usn' cannot be empty"
        });
      }

      const duplicateCheck = await Student.findOne({
        usn: formattedUSN,
        _id: { $ne: id }
      });
      if (duplicateCheck) {
        return res.status(400).json({
          success: false,
          message: `Duplicate USN Error: A student with USN "${formattedUSN}" already exists`
        });
      }
      updateFields.usn = formattedUSN;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate USN Error: A student with this USN already exists'
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
});

// ===================================================================
// 5. DELETE STUDENT (DELETE /api/students/:id)
// ===================================================================
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: deletedStudent
    });
  } catch (error) {
    next(error);
  }
});

export default router;
