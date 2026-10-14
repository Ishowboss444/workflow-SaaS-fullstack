export async function findUser(username: string) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username: username,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'search failed');
  }

  return data;
}
