import api from "./axios";

export function logout() {
  localStorage.removeItem('access_token');
  window.location.href = '/';
}

export async function login(username: string, password: string) {
  const res = await api.post('/login/', {
    username,
    password,
  });
  console.log("token", res.data.access_token);
  return res.data.access_token;
}