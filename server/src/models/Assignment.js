import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required']
    },
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Graded'],
      default: 'Pending'
    },
    dueDate: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
