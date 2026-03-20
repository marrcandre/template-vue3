<script setup>
import { ref, onMounted, computed } from "vue";
import ModalAdicionarLivro from "../components/livros/ModalAdicionarLivro.vue";
import { useLivroStore } from "@/stores/livro";
import { useCompraStore } from "@/stores/compra";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import LivrosApi from "@/api/livros";

const livrosApi = new LivrosApi();
const livroStore = useLivroStore();
const compraStore = useCompraStore();
const authStore = useAuthStore();
const toast = useToastStore();
const canManage = computed(() => authStore.canManage);
const showModal = ref(false);
const livroParaEditar = ref(null);
const busca = ref('');
let buscaTimer = null;

onMounted(async () => {
  await livroStore.getLivros();
});

function onBusca() {
  clearTimeout(buscaTimer);
  buscaTimer = setTimeout(() => {
    livroStore.getLivros(1, busca.value);
  }, 400);
}

function editar(livro) {
  livroParaEditar.value = { ...livro };
  showModal.value = true;
}

function abrirModal() {
  livroParaEditar.value = null;
  showModal.value = true;
}

async function excluir(id) {
  if (!confirm('Tem certeza que deseja excluir este livro?')) return;
  try {
    await livroStore.excluirLivro(id);
    toast.showToast('Livro excluído!');
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao excluir. Verifique se não há registros vinculados.', 'error');
  }
}

async function adicionarAoCarrinho(livroId) {
  try {
    await compraStore.adicionarAoCarrinho(livroId);
    toast.showToast('Adicionado ao carrinho!');
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao adicionar ao carrinho.', 'error');
  }
}

async function favoritar(livroId) {
  try {
    await livrosApi.favoritar(livroId, {});
    toast.showToast('Adicionado aos favoritos!');
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao favoritar livro.', 'error');
  }
}

async function aoSalvar() {
  showModal.value = false;
  toast.showToast('Livro salvo!');
  await livroStore.getLivros(livroStore.meta.page);
}

function capUrl(livro) {
  if (livro.capa && livro.capa.url) return livro.capa.url;
  return "https://placehold.co/50x70?text=?";
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
</script>

<template>
  <div class="page">
    <div class="livro-header">
      <h1 class="page-title">Livros</h1>
      <button v-if="canManage" class="btn btn-icon" @click="abrirModal">+</button>
    </div>

    <input class="search-input" type="text" v-model="busca" @input="onBusca" placeholder="Buscar livros..." />

    <p v-if="livroStore.loading" class="text-muted">Carregando...</p>
    <div v-else-if="!livroStore.livros.length" class="empty-state">Nenhum livro cadastrado.</div>
    <ul class="list" v-else>
      <li class="list-item" v-for="livro in livroStore.livros" :key="livro.id">
        <div class="livro-info" @click="editar(livro)">
          <img :src="capUrl(livro)" alt="Capa" class="livro-capa" />
          <div>
            <strong>{{ livro.titulo }}</strong>
            <span class="text-muted text-sm">{{ formatarPreco(livro.preco) }}</span>
          </div>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-ghost btn-sm" @click="favoritar(livro.id)">&hearts;</button>
          <button class="btn btn-success btn-sm" @click="adicionarAoCarrinho(livro.id)">Carrinho</button>
          <button v-if="canManage" class="btn btn-destructive btn-sm" @click="excluir(livro.id)">Excluir</button>
        </div>
      </li>
    </ul>

    <div class="paginator">
      <button class="btn btn-outline btn-sm" :disabled="livroStore.meta.page == 1" @click="livroStore.paginaAnterior">Anterior</button>
      <button class="btn btn-outline btn-sm" :disabled="livroStore.meta.page == livroStore.meta.total_pages" @click="livroStore.proximaPagina">Próxima</button>
      <span>Página {{ livroStore.meta.page }} de {{ livroStore.meta.total_pages }}</span>
    </div>
  </div>

  <modal-adicionar-livro
    v-if="showModal"
    :livro-para-editar="livroParaEditar"
    @close="showModal = false"
    @salvo="aoSalvar"
  />
</template>

<style scoped>
.livro-header { display: flex; justify-content: space-between; align-items: center; }
.livro-info { display: flex; gap: 12px; align-items: center; cursor: pointer; }
.livro-capa { width: 48px; height: 64px; object-fit: cover; border-radius: calc(var(--radius) - 2px); }
.livro-info div { display: flex; flex-direction: column; }
</style>
