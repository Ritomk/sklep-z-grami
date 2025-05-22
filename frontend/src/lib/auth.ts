export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
}

export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}
