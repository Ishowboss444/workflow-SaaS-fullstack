/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
const API_URL = import.meta.env.VITE_API_URL;

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
  const response = await fetch(`${API_URL}/auth/signup`, {
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
  if (!response.ok) {
    throw new Error(`Signup falied  :${response.status}`);
  }
  return await response.json();
}

export async function login(info: LoginInfo) {
  const response = await fetch(`${API_URL}/auth/login`, {
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
