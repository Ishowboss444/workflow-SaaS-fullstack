export async function getMyAssignments() {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('http://localhost:3000/assignment/my', {
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

  const response = await fetch('http://localhost:3000/assignment/create', {
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