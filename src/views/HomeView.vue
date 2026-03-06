<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.loggedIn);
const user = computed(() => authStore.user);
</script>

<template>
  <div class="container">
    <div v-if="isLoggedIn">
      <h1>Bem-vindo, {{ user.name || user.email }}!</h1>
      <p>Use o menu acima para navegar pelo sistema.</p>
    </div>
    <div v-else>
      <h1>Bem-vindo à Livraria</h1>
      <p>Faça <router-link :to="{ name: 'login' }">login</router-link> para acessar o sistema.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
}

h1 {
  font-size: 2rem;
  color: #343a40;
  margin-bottom: 10px;
}

p {
  font-size: 1.1rem;
  color: #555;
}

p a {
  color: #343a40;
  font-weight: bold;
}
</style>
