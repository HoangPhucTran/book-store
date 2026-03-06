import api from "./axios";

export function logout() {
  localStorage.removeItem('access_token');
  window.location.href = '/';
}

export async function login(username: string, password: string) {
  const res = await api.post('/auth/', {
    username,
    password,
  });

  return res.data.accessToken;
}