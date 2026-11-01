/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
const API_URL = import.meta.env.VITE_API_URL;

export async function getMyAssignments() {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/assignment/my`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch assignments');
  }
  return data;
}

export async function createAssignment(assignmentData : any) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/assignment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(assignmentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create assignment');
  }
  return data;
}