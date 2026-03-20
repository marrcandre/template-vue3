<script setup>
import { onMounted } from 'vue'
import { useCompraStore } from '@/stores/compra'
import { useToastStore } from '@/stores/toast'

const compraStore = useCompraStore()
const toast = useToastStore()

onMounted(async () => {
  await compraStore.getCarrinho()
})

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function alterarQuantidade(item, delta) {
  const novaQtd = item.quantidade + delta
  if (novaQtd < 1) return
  try {
    await compraStore.alterarQuantidadeItem(item.livro.id, novaQtd)
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao alterar quantidade.', 'error')
  }
}

async function removerItem(item) {
  if (!confirm('Tem certeza que deseja remover este item do carrinho?')) return
  try {
    await compraStore.removerItemDoCarrinho(item.livro.id)
    toast.showToast('Item removido do carrinho.')
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao remover item.', 'error')
  }
}

async function finalizar() {
  if (!compraStore.carrinho) return
  if (!confirm('Tem certeza que deseja finalizar a compra?')) return
  try {
    await compraStore.finalizarCompra(compraStore.carrinho.id)
    toast.showToast('Compra finalizada com sucesso!')
  } catch (error) {
    toast.showToast(error.response?.data?.detail || 'Erro ao finalizar compra.', 'error')
  }
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">Carrinho de Compras</h1>
    <div v-if="!compraStore.carrinho || !compraStore.carrinho.itens?.length" class="empty-state">
      <p>Seu carrinho está vazio.</p>
      <router-link class="btn btn-outline" :to="{ name: 'livros' }">Ver livros</router-link>
    </div>
    <div v-else class="carrinho">
      <ul class="list">
        <li class="list-item" v-for="item in compraStore.carrinho.itens" :key="item.livro">
          <span class="item-nome">{{ item.livro.titulo || item.livro }}</span>
          <div class="item-qty">
            <button class="btn btn-outline btn-sm btn-icon" @click="alterarQuantidade(item, -1)">−</button>
            <span>{{ item.quantidade }}</span>
            <button class="btn btn-outline btn-sm btn-icon" @click="alterarQuantidade(item, 1)">+</button>
          </div>
          <span class="item-preco">{{ formatarPreco(item.preco) }}</span>
          <button class="btn btn-ghost btn-sm" @click="removerItem(item)">✕</button>
        </li>
      </ul>
      <div class="carrinho-footer">
        <strong>Total: {{ formatarPreco(compraStore.carrinho.total) }}</strong>
        <button class="btn btn-success" @click="finalizar">Finalizar Compra</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carrinho {
  width: 100%;
  max-width: 640px;
}
.item-nome {
  flex: 2;
}
.item-qty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.item-preco {
  min-width: 80px;
  text-align: right;
}
.carrinho-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}
</style>
