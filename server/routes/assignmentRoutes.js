import express from 'express';

const router = express.Router();

// Mock In-Memory Database Data Structure
let assignments = [
  {
    id: 1,
    subject: 'CS3301 - Full Stack',
    title: 'Lab Assignment 2: React Routing',
    status: 'Pending',
    dueDate: 'Sept 15, 2026'
  },
  {
    id: 2,
    subject: 'CS3302 - DBMS',
    title: 'ER Diagram Project Report',
    status: 'Submitted',
    dueDate: 'Sept 01, 2026'
  }
];

// -------------------------------------------------------------------
// 1. READ ALL (GET /api/assignments)
// -------------------------------------------------------------------
router.get('/', (req, res) => {
  if (req.query.format === 'wrapped') {
    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  }
  res.status(200).json(assignments);
});

// -------------------------------------------------------------------
// 2. READ ONE BY ID (GET /api/assignments/:id)
// -------------------------------------------------------------------
router.get('/:id', (req, res) => {
  const assignmentId = parseInt(req.params.id, 10);
  const assignment = assignments.find((item) => item.id === assignmentId);

  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: `Assignment with ID ${assignmentId} not found`
    });
  }

  res.status(200).json(assignment);
});

// -------------------------------------------------------------------
// 3. CREATE NEW (POST /api/assignments)
// -------------------------------------------------------------------
router.post('/', (req, res) => {
  const { subject, title, dueDate } = req.body;

  // Manual Body Validation
  if (!subject || !title) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Please provide subject and title fields'
    });
  }

  const newAssignment = {
    id: assignments.length > 0 ? assignments[assignments.length - 1].id + 1 : 1,
    subject,
    title,
    status: 'Pending',
    dueDate: dueDate || 'Sept 30, 2026'
  };

  assignments.push(newAssignment);

  res.status(201).json(newAssignment);
});

// -------------------------------------------------------------------
// 4. UPDATE / SUBMIT (PUT /api/assignments/:id/submit)
// -------------------------------------------------------------------
router.put('/:id/submit', (req, res) => {
  const assignmentId = parseInt(req.params.id, 10);
  const assignment = assignments.find((item) => item.id === assignmentId);

  if (!assignment) {
    return res.status(404).json({
      success: false,
      message: `Assignment with ID ${assignmentId} not found`
    });
  }

  // Mutate assignment status state
  assignment.status = 'Submitted';

  res.status(200).json(assignment);
});

// -------------------------------------------------------------------
// 5. DELETE (DELETE /api/assignments/:id)
// -------------------------------------------------------------------
router.delete('/:id', (req, res) => {
  const assignmentId = parseInt(req.params.id, 10);
  const initialLength = assignments.length;

  assignments = assignments.filter((item) => item.id !== assignmentId);

  if (assignments.length === initialLength) {
    return res.status(404).json({
      success: false,
      message: `Delete Failed: Assignment with ID ${assignmentId} does not exist`
    });
  }

  res.status(200).json({
    success: true,
    message: `Assignment ${assignmentId} successfully removed`
  });
});

export default router;
