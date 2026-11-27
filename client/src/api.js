import { mockApi } from './mock';

const BASE = import.meta.env.VITE_API_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Every server call in the app goes through this one function
export async function api(path, options = {}) {
  const method = options.method || 'GET';

  // Mock mode: no server needed
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300)); // small delay so loading states are visible
    return mockApi(path, method, options.body);
  }

  const token = localStorage.getItem('token');
  const res = await fetch(BASE + '/api' + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));

  // 401 means "not logged in", except on these forms, where it just means wrong details
  const isAuthForm =
    path.startsWith('/auth/login') || path.startsWith('/auth/register') || path.startsWith('/auth/password');
  if (res.status === 401 && !isAuthForm) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}