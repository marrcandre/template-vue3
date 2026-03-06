import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CategoriaView from "../views/CategoriaView.vue";
import LoginView from "../views/LoginView.vue";
import LogoutView from "../views/LogoutView.vue";
import RegisterView from "../views/RegisterView.vue";
import UsuarioView from "../views/UsuarioView.vue";
import LivroView from "../views/LivroView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/categorias",
      name: "categorias",
      component: CategoriaView,
      meta: { requiresAuth: true },
    },
    {
      path: "/livros",
      name: "livros",
      component: LivroView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/registro",
      name: "registro",
      component: RegisterView,
    },
    {
      path: "/usuario",
      name: "usuario",
      component: UsuarioView,
      meta: { requiresAuth: true },
    },
    {
      path: "/logout",
      name: "logout",
      component: LogoutView,
    }
  ],
});

router.beforeEach((to) => {
  const loggedIn = !!localStorage.getItem('access_token');
  if (to.meta.requiresAuth && !loggedIn) {
    return { name: 'login' };
  }
});

export default router;
