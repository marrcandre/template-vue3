<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useEditoraStore } from '@/stores/editora'
import { useToastStore } from '@/stores/toast'

const editoraStore = useEditoraStore()
const toast = useToastStore()

const defaultEditora = { id: null, nome: '', site: '', email: '', cidade: '' }
const editora = reactive({ ...defaultEditora })
const busca = ref('')
let buscaTimer = null

onMounted(async () => {
  await editoraStore.getEditoras()
})

function onBusca() {
  clearTimeout(buscaTimer)
  buscaTimer = setTimeout(() => {
    editoraStore.getEditoras(1, busca.value)
  }, 400)
}

function limpar() {
  Object.assign(editora, { ...defaultEditora })
}

async function salvar() {
  try {
    await editoraStore.salvarEditora({ ...editora })
    toast.showToast(editora.id ? 'Editora atualizada!' : 'Editora criada!')
    limpar()
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao salvar editora.', 'error')
  }
}

function editar(ed) {
  Object.assign(editora, ed)
}

async function excluir(id) {
  if (!confirm('Tem certeza que deseja excluir esta editora?')) return
  try {
    await editoraStore.excluirEditora(id)
    toast.showToast('Editora excluída!')
    limpar()
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao excluir. Verifique se não há registros vinculados.', 'error')
  }
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">Editoras</h1>
    <div class="form-row">
      <div class="form-group">
        <label class="label" for="ed-nome">Nome</label>
        <input id="ed-nome" type="text" v-model="editora.nome" />
      </div>
      <div class="form-group">
        <label class="label" for="ed-site">Site</label>
        <input id="ed-site" type="text" v-model="editora.site" />
      </div>
      <div class="form-group">
        <label class="label" for="ed-email">Email</label>
        <input id="ed-email" type="text" v-model="editora.email" />
      </div>
      <div class="form-group">
        <label class="label" for="ed-cidade">Cidade</label>
        <input id="ed-cidade" type="text" v-model="editora.cidade" />
      </div>
      <button class="btn" @click="salvar">Salvar</button>
      <button class="btn btn-outline" @click="limpar">Limpar</button>
    </div>

    <input class="search-input" type="text" v-model="busca" @input="onBusca" placeholder="Buscar editoras..." />

    <div v-if="!editoraStore.editoras.length" class="empty-state">Nenhuma editora cadastrada.</div>
    <ul class="list" v-else>
      <li class="list-item" v-for="ed in editoraStore.editoras" :key="ed.id">
        <span>({{ ed.id }}) — {{ ed.nome }} <span class="text-muted text-sm" v-if="ed.cidade">— {{ ed.cidade }}</span></span>
        <div class="list-item-actions">
          <button class="btn btn-outline btn-sm" @click="editar(ed)">Editar</button>
          <button class="btn btn-destructive btn-sm" @click="excluir(ed.id)">Excluir</button>
        </div>
      </li>
    </ul>

    <div class="paginator">
      <button class="btn btn-outline btn-sm" :disabled="editoraStore.meta.page == 1" @click="editoraStore.paginaAnterior">Anterior</button>
      <button class="btn btn-outline btn-sm" :disabled="editoraStore.meta.page == editoraStore.meta.total_pages" @click="editoraStore.proximaPagina">Próxima</button>
      <span>Página {{ editoraStore.meta.page }} de {{ editoraStore.meta.total_pages }}</span>
    </div>
  </div>
</template>
