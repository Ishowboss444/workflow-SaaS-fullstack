const token = localStorage.getItem('accessToken');

export async function findUser(username: string) {
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
  console.log(data);
  return data;
}
