<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAutorStore } from '@/stores/autor'
import { useToastStore } from '@/stores/toast'

const autorStore = useAutorStore()
const toast = useToastStore()

const defaultAutor = { id: null, nome: '', email: '' }
const autor = reactive({ ...defaultAutor })
const busca = ref('')
let buscaTimer = null

onMounted(async () => {
  await autorStore.getAutores()
})

function onBusca() {
  clearTimeout(buscaTimer)
  buscaTimer = setTimeout(() => {
    autorStore.getAutores(1, busca.value)
  }, 400)
}

function limpar() {
  Object.assign(autor, { ...defaultAutor })
}

async function salvar() {
  try {
    await autorStore.salvarAutor({ ...autor })
    toast.showToast(autor.id ? 'Autor atualizado!' : 'Autor criado!')
    limpar()
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao salvar autor.', 'error')
  }
}

function editar(a) {
  Object.assign(autor, a)
}

async function excluir(id) {
  if (!confirm('Tem certeza que deseja excluir este autor?')) return
  try {
    await autorStore.excluirAutor(id)
    toast.showToast('Autor excluído!')
    limpar()
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao excluir. Verifique se não há registros vinculados.', 'error')
  }
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">Autores</h1>
    <div class="form-row">
      <div class="form-group">
        <label class="label" for="aut-nome">Nome</label>
        <input id="aut-nome" type="text" v-model="autor.nome" />
      </div>
      <div class="form-group">
        <label class="label" for="aut-email">Email</label>
        <input id="aut-email" type="text" v-model="autor.email" />
      </div>
      <button class="btn" @click="salvar">Salvar</button>
      <button class="btn btn-outline" @click="limpar">Limpar</button>
    </div>

    <input class="search-input" type="text" v-model="busca" @input="onBusca" placeholder="Buscar autores..." />

    <div v-if="!autorStore.autores.length" class="empty-state">Nenhum autor cadastrado.</div>
    <ul class="list" v-else>
      <li class="list-item" v-for="a in autorStore.autores" :key="a.id">
        <span>({{ a.id }}) — {{ a.nome }} <span class="text-muted text-sm" v-if="a.email">— {{ a.email }}</span></span>
        <div class="list-item-actions">
          <button class="btn btn-outline btn-sm" @click="editar(a)">Editar</button>
          <button class="btn btn-destructive btn-sm" @click="excluir(a.id)">Excluir</button>
        </div>
      </li>
    </ul>

    <div class="paginator">
      <button class="btn btn-outline btn-sm" :disabled="autorStore.meta.page == 1" @click="autorStore.paginaAnterior">Anterior</button>
      <button class="btn btn-outline btn-sm" :disabled="autorStore.meta.page == autorStore.meta.total_pages" @click="autorStore.proximaPagina">Próxima</button>
      <span>Página {{ autorStore.meta.page }} de {{ autorStore.meta.total_pages }}</span>
    </div>
  </div>
</template>
