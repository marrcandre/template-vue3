<script setup>
import { onMounted, ref } from 'vue'
import { useFavoritoStore } from '@/stores/favorito'
import { useToastStore } from '@/stores/toast'

const favoritoStore = useFavoritoStore()
const toast = useToastStore()
const editandoId = ref(null)
const editNota = ref(null)
const editComentario = ref('')

onMounted(async () => {
  await favoritoStore.getFavoritos()
})

function iniciarEdicao(fav) {
  editandoId.value = fav.id
  editNota.value = fav.nota
  editComentario.value = fav.comentario || ''
}

function cancelarEdicao() {
  editandoId.value = null
}

async function salvarEdicao(id) {
  try {
    await favoritoStore.atualizarFavorito(id, {
      nota: editNota.value,
      comentario: editComentario.value
    })
    editandoId.value = null
    toast.showToast('Favorito atualizado.')
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao atualizar favorito.', 'error')
  }
}

async function excluir(id) {
  if (!confirm('Tem certeza que deseja remover este favorito?')) return
  try {
    await favoritoStore.excluirFavorito(id)
    toast.showToast('Favorito removido.')
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao remover favorito.', 'error')
  }
}

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">Meus Favoritos</h1>
    <div v-if="!favoritoStore.favoritos.length" class="empty-state">
      <p>Nenhum favorito ainda.</p>
      <router-link class="btn btn-outline" :to="{ name: 'livros' }">Ver livros</router-link>
    </div>
    <div class="favoritos-list" v-else>
      <div v-for="fav in favoritoStore.favoritos" :key="fav.id" class="card">
        <div class="fav-header">
          <strong>{{ fav.livro_titulo || `Livro #${fav.livro}` }}</strong>
          <small class="text-muted">{{ formatarData(fav.data_atualizacao) }}</small>
        </div>

        <div v-if="editandoId === fav.id">
          <div class="stars">
            <span
              v-for="n in 5"
              :key="n"
              class="star clickable"
              :class="{ active: n <= editNota }"
              @click="editNota = n"
            >&#9733;</span>
          </div>
          <textarea class="input" v-model="editComentario" placeholder="Comentário" rows="2"></textarea>
          <div class="fav-actions">
            <button class="btn btn-sm" @click="salvarEdicao(fav.id)">Salvar</button>
            <button class="btn btn-outline btn-sm" @click="cancelarEdicao">Cancelar</button>
          </div>
        </div>

        <div v-else>
          <div class="stars">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ active: n <= fav.nota }"
            >&#9733;</span>
          </div>
          <p v-if="fav.comentario" class="text-muted" style="margin-bottom: 0.5rem;">{{ fav.comentario }}</p>
          <div class="fav-actions">
            <button class="btn btn-outline btn-sm" @click="iniciarEdicao(fav)">Editar</button>
            <button class="btn btn-destructive btn-sm" @click="excluir(fav.id)">Remover</button>
          </div>
        </div>
      </div>
    </div>
    <div class="paginator" v-if="favoritoStore.meta.total_pages > 1">
      <button class="btn btn-outline btn-sm" :disabled="favoritoStore.meta.page == 1" @click="favoritoStore.paginaAnterior">
        Anterior
      </button>
      <span>Página {{ favoritoStore.meta.page }} de {{ favoritoStore.meta.total_pages }}</span>
      <button class="btn btn-outline btn-sm" :disabled="favoritoStore.meta.page == favoritoStore.meta.total_pages" @click="favoritoStore.proximaPagina">
        Próxima
      </button>
    </div>
  </div>
</template>

<style scoped>
.favoritos-list {
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.fav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.fav-actions {
  display: flex;
  gap: 0.5rem;
}
textarea.input {
  margin-bottom: 0.5rem;
}
</style>
