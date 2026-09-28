import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/assignments';

export const getAssignments = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const submitAssignment = async (id) => {
  const response = await axios.put(`${API_BASE_URL}/${id}/submit`);
  return response.data;
};

export const createAssignment = async (assignmentData) => {
  const response = await axios.post(API_BASE_URL, assignmentData);
  return response.data;
};
