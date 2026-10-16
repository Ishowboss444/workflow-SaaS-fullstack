export interface AssignmentCreate {
  productId: number;
  workerId: number;
  quantity: number;
}

export async function createAssignment(data: AssignmentCreate) {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch('http://localhost:3000/assignment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
