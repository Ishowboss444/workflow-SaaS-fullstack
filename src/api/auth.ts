export interface SignupInfo {
  name: string;
  username: string;
  password: string;
}
export interface LoginInfo {
  username: string;
  password: string;
}
export async function signup(info: SignupInfo) {
  try {
    const raw = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: info.name,
        username: info.username,
        password: info.password,
      }),
    });
    if (!raw.ok) {
      throw new Error(`Signup falied  :${raw.status}`);
    }
    return await raw.json();
  } catch (err) {
    console.log('Here is the error:', err);
    throw err;
  }
}

export async function login(info: LoginInfo) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: info.username,
      password: info.password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return await response.json();
}
