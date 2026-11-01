/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
const API_URL = import.meta.env.VITE_API_URL;

export async function getInvites() {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/invites/get`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'loading invitations failed');
  }

  return data;
}

export async function sendInvites(id: number) {
  if (!id) throw new Error('no user id was given');

  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/invites/send/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'sending invitation failed');
  }

  return data;
}

export async function acceptInvite(id: number) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/invites/${id}/accept`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Accept failed: ${response.status}`);
  }

  return await response.json();
}

export async function rejectInvite(id: number) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/invites/${id}/reject`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Reject failed: ${response.status}`);
  }

  return await response.json();
}
