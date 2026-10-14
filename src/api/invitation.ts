export async function getInvites() {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('http://localhost:3000/invites/get', {
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

  const response = await fetch(`http://localhost:3000/invites/send/${id}`, {
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

  const response = await fetch(`http://localhost:3000/invites/${id}/accept`, {
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

  const response = await fetch(`http://localhost:3000/invites/${id}/reject`, {
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
