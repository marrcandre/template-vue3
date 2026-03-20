<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.loggedIn);
const user = computed(() => authStore.user);
const canManage = computed(() => authStore.canManage);
const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}
function closeDropdown(e) {
  if (!e.target.closest(".user-menu")) showDropdown.value = false;
}
onMounted(() => document.addEventListener("click", closeDropdown));
onUnmounted(() => document.removeEventListener("click", closeDropdown));
</script>

<template>
  <header class="navbar">
    <nav>
      <div class="nav-left">
        <router-link :to="{ name: 'home' }" class="nav-link nav-logo">Livraria</router-link>
        <router-link v-if="canManage" :to="{ name: 'categorias' }" class="nav-link">Categorias</router-link>
        <router-link v-if="canManage" :to="{ name: 'editoras' }" class="nav-link">Editoras</router-link>
        <router-link v-if="canManage" :to="{ name: 'autores' }" class="nav-link">Autores</router-link>
        <router-link :to="{ name: 'livros' }" class="nav-link">Livros</router-link>
      </div>

      <div class="nav-right" v-if="isLoggedIn">
        <router-link :to="{ name: 'carrinho' }" class="nav-link" title="Carrinho">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </router-link>
        <router-link :to="{ name: 'compras' }" class="nav-link">Compras</router-link>
        <router-link :to="{ name: 'favoritos' }" class="nav-link">Favoritos</router-link>

        <div class="user-menu" @click="toggleDropdown">
          <img
            :src="user.foto?.url || 'https://placehold.co/36'"
            alt="Menu do usuário"
            class="user-photo"
          />
          <div v-if="showDropdown" class="dropdown">
            <p class="dropdown-name">{{ user.name }}</p>
            <p class="dropdown-email">{{ user.email }}</p>
            <router-link :to="{ name: 'usuario' }" class="dropdown-item">Perfil</router-link>
            <router-link to="/logout" class="dropdown-item">Sair</router-link>
          </div>
        </div>
      </div>

      <div class="nav-right" v-else>
        <router-link to="/login" class="nav-link">Login</router-link>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.user-menu { position: relative; cursor: pointer; margin-left: 4px; }
.user-photo {
  width: 36px; height: 36px; border-radius: 50%; object-fit: cover;
  border: 2px solid rgba(255,255,255,0.3); transition: border-color 0.15s;
}
.user-photo:hover { border-color: rgba(255,255,255,0.7); }
.dropdown {
  position: absolute; top: 44px; right: 0;
  background: var(--card); color: var(--card-foreground);
  border: 1px solid var(--border); border-radius: var(--radius);
  padding: 12px; min-width: 200px; z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.dropdown-name { font-weight: 600; font-size: 0.875rem; margin-bottom: 2px; }
.dropdown-email { font-size: 0.8rem; color: var(--muted-foreground); margin-bottom: 8px; word-break: break-all; }
.dropdown-item {
  display: block; text-decoration: none; color: var(--card-foreground);
  padding: 6px 8px; border-radius: calc(var(--radius) - 2px); font-size: 0.875rem;
}
.dropdown-item:hover { background: var(--accent); }
</style>
