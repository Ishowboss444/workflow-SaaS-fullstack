export async function getWorkplaces() {}

export async function getWorkplaceMembers(workplaceId: number) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(
    `http://localhost:3000/workplace/${workplaceId}/members`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch members');
  }

  return data;
}

export async function getMemberAssignments(
  workplaceId: number,
  memberId: number
) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(
    `http://localhost:3000/workplace/${workplaceId}/members/${memberId}/assignments`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch assignments');
  }

  return data;
}
