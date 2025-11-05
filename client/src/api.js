import axios from "axios";

const API_BASE = "http://localhost:8000";

export const addTask = async (text) => {
  const res = await axios.post(`${API_BASE}/add_task`, { text });
  return res.data;
};

export const getTasks = async () => {
  const res = await axios.get(`${API_BASE}/tasks`);
  return res.data;
};

export const generateSummary = async () => {
  const res = await axios.post(`${API_BASE}/summary`);
  return res.data;
};
