/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
const API_URL = import.meta.env.VITE_API_URL;

export async function findUser(username: string) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/users`, {
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
