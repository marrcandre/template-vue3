<template>
  <Navbar />
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Navbar from './views/NavBar.vue';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.checkAuth();
});
</script>

<style>
/* Seu estilo principal */
</style>
