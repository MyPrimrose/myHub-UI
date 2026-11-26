<script setup lang="ts">
import { FileCode2, Folder, Plus, Star } from 'lucide-vue-next'
import type { LibraryFolderNode, LibrarySelection } from '../types/library'
import LibraryFolderNodeItem from './LibraryFolderNodeItem.vue'

defineProps<{
  tree: LibraryFolderNode[]
  selection: LibrarySelection
  recentCount?: number
  favoriteCount?: number
  uncategorizedCount?: number
}>()

const emit = defineEmits<{
  select: [selection: LibrarySelection]
  openFile: [id: number]
  createFolder: [parentId?: number | null]
  renameFolder: [id: number]
  deleteFolder: [id: number]
}>()
</script>

<template>
  <aside class="tree-panel">
    <div class="section-label">目录</div>
    <button
      type="button"
      class="nav-item"
      :class="{ active: selection.type === 'all' }"
      @click="emit('select', { type: 'all' })"
    >
      <Folder :size="15" />
      <span>全部页面</span>
    </button>
    <button
      type="button"
      class="nav-item"
      :class="{ active: selection.type === 'favorites' }"
      @click="emit('select', { type: 'favorites' })"
    >
      <Star :size="15" />
      <span>收藏</span>
      <em>{{ favoriteCount || 0 }}</em>
    </button>
    <button
      type="button"
      class="nav-item"
      :class="{ active: selection.type === 'recent' }"
      @click="emit('select', { type: 'recent' })"
    >
      <FileCode2 :size="15" />
      <span>最近访问</span>
      <em>{{ recentCount || 0 }}</em>
    </button>

    <div class="section-label">文件夹</div>
    <div class="folder-tree">
      <LibraryFolderNodeItem
        v-for="node in tree"
        :key="node.id"
        :node="node"
        :selection="selection"
        :depth="0"
        @select="emit('select', $event)"
        @open-file="emit('openFile', $event)"
        @create-folder="emit('createFolder', $event)"
        @rename-folder="emit('renameFolder', $event)"
        @delete-folder="emit('deleteFolder', $event)"
      />
      <div v-if="!tree.length" class="empty-hint">还没有文件夹，可先新建一个。</div>
    </div>

    <button
      type="button"
      class="nav-item"
      :class="{ active: selection.type === 'uncategorized' }"
      @click="emit('select', { type: 'uncategorized' })"
    >
      <Folder :size="15" />
      <span>未归类的页面</span>
      <em>{{ uncategorizedCount || 0 }}</em>
    </button>

    <button type="button" class="create-folder" @click="emit('createFolder', null)">
      <Plus :size="14" />
      新建根文件夹
    </button>
  </aside>
</template>

<style scoped lang="scss">
.tree-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border: 1px solid #efeaf8;
  border-radius: 20px;
  background: #faf8ff;
  height: 100%;
  overflow: auto;
}
.section-label {
  margin: 8px 8px 6px;
  color: #b1aac6;
  font-size: 11px;
  letter-spacing: 0.08em;
}
.nav-item,
.create-folder {
  border: 0;
  background: transparent;
  cursor: pointer;
}
.nav-item {
  width: 100%;
  min-height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border-radius: 12px;
  color: #6f678b;
  text-align: left;
  font-size: 13px;
}
.nav-item:hover,
.nav-item.active {
  background: #efe8ff;
  color: #6b52d1;
}
.nav-item em {
  margin-left: auto;
  color: #b1aac6;
  font-style: normal;
  font-size: 11px;
}
.folder-tree {
  display: grid;
  gap: 2px;
  min-height: 80px;
}
.empty-hint {
  padding: 10px 12px;
  color: #a49db9;
  font-size: 12px;
}
.create-folder {
  margin-top: auto;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 12px;
  color: #8b6df0;
  background: white;
  border: 1px dashed #ddd4f5;
  font-size: 12px;
}
:global(:root[data-theme='dark']) .tree-panel {
  background: rgb(45 41 59 / 72%);
  border-color: var(--border-color);
}
</style>
