<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const name = ref('');
const password = ref('');
const passwordConfirm = ref('');
const error = ref('');

async function handleRegister() {
  error.value = '';
  if (password.value !== passwordConfirm.value) {
    error.value = 'As senhas não conferem.';
    return;
  }
  try {
    await authStore.register(email.value, name.value, password.value);
    router.push({ name: 'home' });
  } catch (err) {
    error.value = err.response?.data?.email?.[0]
      || err.response?.data?.password?.[0]
      || 'Erro ao criar conta. Verifique os dados.';
  }
}
</script>

<template>
  <div class="container">
    <h1>Cadastro</h1>
    <div class="authContainer">
      <form @submit.prevent="handleRegister">
        <input type="text" v-model="name" placeholder="Nome" />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Senha (mínimo 8 caracteres)" required />
        <input type="password" v-model="passwordConfirm" placeholder="Confirmar senha" required />
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit">Cadastrar</button>
      </form>
      <p class="login-link">
        Já tem conta? <router-link :to="{ name: 'login' }">Faça login</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

h1 {
  font-size: 2rem;
  color: #343a40;
  margin-bottom: 30px;
  text-align: center;
}

.authContainer {
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

button {
  padding: 12px;
  background-color: #343a40;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #000;
}

.error {
  color: #dc3545;
  margin: 0;
}

.login-link {
  margin-top: 20px;
  color: #555;
}

.login-link a {
  color: #343a40;
  font-weight: bold;
}

@media (max-width: 600px) {
  .authContainer {
    padding: 20px;
    max-width: 90%;
  }
}
</style>
