import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/students';

const studentApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Helper to extract clean error message
const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred';
};

/**
 * Retrieve all students from the database
 */
export const getStudents = async () => {
  try {
    const response = await studentApiClient.get('/');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

/**
 * Retrieve a single student by MongoDB _id
 */
export const getStudent = async (id) => {
  try {
    const response = await studentApiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

/**
 * Create a new student in MongoDB
 */
export const createStudent = async (data) => {
  try {
    const response = await studentApiClient.post('/', data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

/**
 * Update an existing student record in MongoDB
 */
export const updateStudent = async (id, data) => {
  try {
    const response = await studentApiClient.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

/**
 * Delete a student record from MongoDB
 */
export const deleteStudent = async (id) => {
  try {
    const response = await studentApiClient.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

export default {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};
