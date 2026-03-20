<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const usuario = computed(() => authStore.user);

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
</script>

<template>
  <div class="page" v-if="usuario">
    <h1 class="page-title">Informações do Usuário</h1>
    <div class="card user-card">
      <img
        v-if="usuario.foto && usuario.foto.url"
        :src="usuario.foto.url"
        alt="Foto do usuário"
        class="user-photo"
      />
      <img v-else src="https://placehold.co/150" alt="Sem foto" class="user-photo" />
      <p>Nome: <strong>{{ usuario.name }}</strong></p>
      <p>Email: <strong>{{ usuario.email }}</strong></p>
      <p>ID: <strong>{{ usuario.id }}</strong></p>
      <p>Superuser: <strong>{{ usuario.is_superuser ? "Sim" : "Não" }}</strong></p>
      <p>Ativo: <strong>{{ usuario.is_active ? "Sim" : "Não" }}</strong></p>
      <p>Staff: <strong>{{ usuario.is_staff ? "Sim" : "Não" }}</strong></p>
      <p>Último Login: <strong>{{ formatDate(usuario.last_login) || "Nunca logado" }}</strong></p>
      <p>Grupos: <strong>{{ usuario.groups?.length ? usuario.groups.map((group) => group.name).join(", ") : "Nenhum" }}</strong></p>
    </div>
  </div>
  <div class="page" v-else>
    <p class="text-muted">Carregando informações do usuário...</p>
  </div>
</template>

<style scoped>
.user-card {
  max-width: 500px;
}
.user-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 0 auto 1rem;
}
.user-card p {
  margin-bottom: 0.5rem;
  color: var(--muted-foreground);
}
</style>
