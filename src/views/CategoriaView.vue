<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCategoriaStore } from '@/stores/categoria'
import { useToastStore } from '@/stores/toast'

const categoriaStore = useCategoriaStore()
const toast = useToastStore()

const defaultCategoria = { id: null, descricao: '' }
const categoria = reactive({ ...defaultCategoria })
const busca = ref('')
let buscaTimer = null

onMounted(async () => {
  await categoriaStore.getCategorias()
})

function onBusca() {
  clearTimeout(buscaTimer)
  buscaTimer = setTimeout(() => {
    categoriaStore.getCategorias(1, busca.value)
  }, 400)
}

function limpar() {
  Object.assign(categoria, { ...defaultCategoria })
}

async function salvar() {
  try {
    await categoriaStore.salvarCategoria({ ...categoria })
    toast.showToast(categoria.id ? 'Categoria atualizada!' : 'Categoria criada!')
    limpar()
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao salvar categoria.', 'error')
  }
}

function editar(cat) {
  Object.assign(categoria, cat)
}

async function excluir(id) {
  if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
  try {
    await categoriaStore.excluirCategoria(id)
    toast.showToast('Categoria excluída!')
    limpar()
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao excluir. Verifique se não há registros vinculados.', 'error')
  }
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">Categorias</h1>
    <div class="form-row">
      <div class="form-group">
        <label class="label" for="cat-desc">Descrição</label>
        <input id="cat-desc" type="text" v-model="categoria.descricao" />
      </div>
      <button class="btn" @click="salvar">Salvar</button>
      <button class="btn btn-outline" @click="limpar">Limpar</button>
    </div>

    <input class="search-input" type="text" v-model="busca" @input="onBusca" placeholder="Buscar categorias..." />

    <div v-if="!categoriaStore.categorias.length" class="empty-state">
      Nenhuma categoria cadastrada.
    </div>
    <ul class="list" v-else>
      <li class="list-item" v-for="cat in categoriaStore.categorias" :key="cat.id">
        <span>({{ cat.id }}) — {{ cat.descricao }}</span>
        <div class="list-item-actions">
          <button class="btn btn-outline btn-sm" @click="editar(cat)">Editar</button>
          <button class="btn btn-destructive btn-sm" @click="excluir(cat.id)">Excluir</button>
        </div>
      </li>
    </ul>

    <div class="paginator">
      <button class="btn btn-outline btn-sm" :disabled="categoriaStore.meta.page == 1" @click="categoriaStore.paginaAnterior">Anterior</button>
      <button class="btn btn-outline btn-sm" :disabled="categoriaStore.meta.page == categoriaStore.meta.total_pages" @click="categoriaStore.proximaPagina">Próxima</button>
      <span>Página {{ categoriaStore.meta.page }} de {{ categoriaStore.meta.total_pages }}</span>
    </div>
  </div>
</template>
