import { ref } from 'vue';
import { defineStore } from 'pinia';

import AuthService from '@/api/auth';
const authService = new AuthService();

export const useAuthStore = defineStore('auth', () => {
  const user = ref({});
  const loggedIn = ref(false);

  async function login(email, password) {
    const data = await authService.login(email, password);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    user.value = await authService.getUser();
    loggedIn.value = true;
  }

  async function register(email, name, password) {
    await authService.register(email, name, password);
    await login(email, password);
  }

  function logout() {
    user.value = {};
    loggedIn.value = false;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  async function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        user.value = await authService.getUser();
        loggedIn.value = true;
      } catch {
        logout();
      }
    }
  }

  return { user, loggedIn, login, register, logout, checkAuth };
});
