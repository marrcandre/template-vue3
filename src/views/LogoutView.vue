<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  authStore.logout()
  router.push({ name: 'home' })
})
</script>

<template>
  <h1>Saindo...</h1>
</template>

<style></style>
