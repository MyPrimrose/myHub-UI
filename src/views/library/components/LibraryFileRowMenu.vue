<script setup lang="ts">
import { computed } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import { useActionMenu } from '../composables/useActionMenu'

const props = defineProps<{ fileId: number }>()
const emit = defineEmits<{ rename: []; move: []; remove: [] }>()

const menuKey = computed(() => `file-${props.fileId}`)
const { open, toggle, runAndClose } = useActionMenu(menuKey)
</script>

<template>
  <div class="menu" data-action-menu>
    <button
      type="button"
      class="menu-trigger"
      :aria-expanded="open"
      title="更多操作"
      @click="toggle"
    >
      <MoreHorizontal :size="16" />
    </button>
    <div v-if="open" class="menu-panel" role="menu">
      <button type="button" @click="runAndClose(() => emit('rename'))">重命名</button>
      <button type="button" @click="runAndClose(() => emit('move'))">移动</button>
      <button type="button" class="danger" @click="runAndClose(() => emit('remove'))">删除</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu {
  position: relative;
}
.menu-trigger,
.menu-panel button {
  border: 0;
  background: transparent;
  cursor: pointer;
}
.menu-trigger {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #a49db9;
}
.menu-trigger:hover,
.menu-trigger[aria-expanded='true'] {
  background: #efe8ff;
}
.menu-panel {
  position: absolute;
  right: 0;
  top: 34px;
  z-index: 5;
  min-width: 120px;
  padding: 6px;
  border: 1px solid #efeaf8;
  border-radius: 12px;
  background: white;
  box-shadow: 0 16px 32px -24px rgb(80 50 140 / 45%);
}
.menu-panel button {
  width: 100%;
  height: 32px;
  border-radius: 8px;
  text-align: left;
  padding: 0 10px;
  color: #5b5475;
  font-size: 12px;
}
.menu-panel button:hover {
  background: #f7f4fd;
}
.menu-panel .danger {
  color: #d56f8e;
}
:global(:root[data-theme='dark']) .menu-panel {
  background: rgb(45 41 59 / 96%);
  border-color: var(--border-color);
}
</style>
