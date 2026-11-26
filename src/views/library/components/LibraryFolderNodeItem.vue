<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  Folder,
  FolderOpen,
  FolderPlus,
  MoreHorizontal,
  Trash2,
} from 'lucide-vue-next'
import type { LibraryFolderNode, LibrarySelection } from '../types/library'
import { useActionMenu } from '../composables/useActionMenu'

const props = defineProps<{
  node: LibraryFolderNode
  selection: LibrarySelection
  depth?: number
}>()

const emit = defineEmits<{
  select: [selection: LibrarySelection]
  openFile: [id: number]
  createFolder: [parentId?: number | null]
  renameFolder: [id: number]
  deleteFolder: [id: number]
}>()

const expanded = ref(true)
const depth = computed(() => props.depth ?? 0)
const menuKey = computed(() => `folder-${props.node.id}`)
const { open: menuOpen, toggle: toggleMenu, runAndClose } = useActionMenu(menuKey)

const active = computed(
  () => props.selection.type === 'folder' && props.selection.id === props.node.id,
)
</script>

<template>
  <div class="node" :style="{ '--depth': depth }">
    <div class="folder-row" :class="{ active }">
      <button type="button" class="chevron" @click="expanded = !expanded">
        <ChevronDown v-if="expanded" :size="14" />
        <ChevronRight v-else :size="14" />
      </button>
      <button
        type="button"
        class="folder-btn"
        @click="emit('select', { type: 'folder', id: node.id })"
      >
        <FolderOpen v-if="expanded" :size="15" />
        <Folder v-else :size="15" />
        <span>{{ node.name }}</span>
        <em>{{ node.fileCount }}</em>
      </button>
      <div class="menu" data-action-menu>
        <button
          type="button"
          class="menu-trigger"
          :aria-expanded="menuOpen"
          title="更多操作"
          @click="toggleMenu"
        >
          <MoreHorizontal :size="15" />
        </button>
        <div v-if="menuOpen" class="menu-panel" role="menu">
          <button type="button" @click="runAndClose(() => emit('createFolder', node.id))">
            <FolderPlus :size="14" /> 新建子文件夹
          </button>
          <button type="button" @click="runAndClose(() => emit('renameFolder', node.id))">
            重命名
          </button>
          <button
            type="button"
            class="danger"
            @click="runAndClose(() => emit('deleteFolder', node.id))"
          >
            <Trash2 :size="14" /> 删除
          </button>
        </div>
      </div>
    </div>

    <div v-if="expanded" class="children">
      <button
        v-for="file in node.files"
        :key="file.id"
        type="button"
        class="file-item"
        @click="emit('openFile', file.id)"
      >
        <FileCode2 :size="14" />
        <span>{{ file.name }}</span>
      </button>

      <LibraryFolderNodeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selection="selection"
        :depth="depth + 1"
        @select="emit('select', $event)"
        @open-file="emit('openFile', $event)"
        @create-folder="emit('createFolder', $event)"
        @rename-folder="emit('renameFolder', $event)"
        @delete-folder="emit('deleteFolder', $event)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.node {
  min-width: 0;
}
.folder-row {
  display: flex;
  align-items: center;
  padding-left: calc(var(--depth) * 14px);
}
.folder-row.active .folder-btn {
  background: #efe8ff;
  color: #6b52d1;
}
.chevron,
.folder-btn,
.file-item,
.menu-trigger,
.menu-panel button {
  border: 0;
  background: transparent;
  cursor: pointer;
}
.chevron {
  width: 22px;
  height: 28px;
  display: grid;
  place-items: center;
  color: #a49db9;
  flex: 0 0 22px;
}
.folder-btn,
.file-item {
  min-width: 0;
  flex: 1;
  min-height: 34px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  border-radius: 12px;
  color: #6f678b;
  text-align: left;
  font-size: 13px;
}
.folder-btn:hover,
.file-item:hover {
  background: #efe8ff;
  color: #6b52d1;
}
.folder-btn em {
  margin-left: auto;
  color: #b1aac6;
  font-style: normal;
  font-size: 11px;
}
.folder-btn span,
.file-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.children {
  display: grid;
  gap: 2px;
}
.file-item {
  padding-left: calc(var(--depth) * 14px + 30px);
}
.menu {
  position: relative;
  flex: 0 0 auto;
}
.menu-trigger {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #a49db9;
}
.menu-trigger:hover,
.menu-trigger[aria-expanded='true'] {
  background: #efe8ff;
}
.menu-panel {
  position: absolute;
  right: 0;
  top: 30px;
  z-index: 8;
  min-width: 140px;
  padding: 6px;
  border: 1px solid #efeaf8;
  border-radius: 12px;
  background: white;
  box-shadow: 0 16px 32px -24px rgb(80 50 140 / 45%);
}
.menu-panel button {
  width: 100%;
  height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  border-radius: 8px;
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
