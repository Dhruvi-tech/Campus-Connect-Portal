// Assignment Controller handlers for MERN architecture
export const getAssignments = async (req, res, next) => {
  try {
    res.json([
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
    ]);
  } catch (error) {
    next(error);
  }
};
