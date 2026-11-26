<script setup lang="ts">
import { FileCode2, Star } from 'lucide-vue-next'
import type { LibraryFile } from '../types/library'
import { formatBytes, formatDate } from '../composables/useLibrary'
import LibraryFileRowMenu from './LibraryFileRowMenu.vue'

defineProps<{
  files: LibraryFile[]
  loading?: boolean
  selectedIds: number[]
  activeId?: number | null
}>()

const emit = defineEmits<{
  open: [id: number]
  toggleSelect: [id: number]
  favorite: [id: number, favorite: boolean]
  rename: [file: LibraryFile]
  move: [file: LibraryFile]
  remove: [file: LibraryFile]
}>()
</script>

<template>
  <section class="list-panel">
    <div class="list-head">
      <h3>文件列表</h3>
      <span>{{ files.length }} 项</span>
    </div>
    <div v-if="loading" class="state">正在加载文件…</div>
    <div v-else-if="!files.length" class="state">当前目录还没有 HTML 页面。</div>
    <ul v-else class="file-list">
      <li v-for="file in files" :key="file.id">
        <div
          class="file-row"
          :class="{ active: activeId === file.id, checked: selectedIds.includes(file.id) }"
        >
          <input
            type="checkbox"
            :checked="selectedIds.includes(file.id)"
            @change="emit('toggleSelect', file.id)"
          />
          <button type="button" class="main" @click="emit('open', file.id)">
            <span class="icon"><FileCode2 :size="16" /></span>
            <span class="copy">
              <strong>{{ file.name }}</strong>
              <small>
                {{ formatBytes(file.fileSize) }} · 上传 {{ formatDate(file.createTime) }} · 更新
                {{ formatDate(file.updateTime) }}
              </small>
            </span>
          </button>
          <button
            type="button"
            class="star"
            :class="{ on: file.favorite }"
            :title="file.favorite ? '取消收藏' : '收藏'"
            @click="emit('favorite', file.id, !file.favorite)"
          >
            <Star :size="15" />
          </button>
          <LibraryFileRowMenu
            :file-id="file.id"
            @rename="emit('rename', file)"
            @move="emit('move', file)"
            @remove="emit('remove', file)"
          />
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.list-panel {
  min-width: 0;
  height: 100%;
  padding: 14px;
  border: 1px solid #efeaf8;
  border-radius: 20px;
  background: white;
}
.list-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.list-head h3 {
  margin: 0;
  font-size: 14px;
}
.list-head span,
.state {
  color: #9a93b2;
  font-size: 12px;
}
.state {
  display: grid;
  place-items: center;
  min-height: 240px;
}
.file-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
  max-height: min(58vh, 620px);
  overflow: auto;
}
.file-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 14px;
  border: 1px solid transparent;
}
.file-row.active,
.file-row:hover,
.file-row.checked {
  background: #f7f4fd;
  border-color: #efe8ff;
}
.main {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #8b6df0;
  background: #efe8ff;
}
.copy {
  min-width: 0;
}
.copy strong,
.copy small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.copy strong {
  font-size: 13px;
}
.copy small {
  margin-top: 3px;
  color: #a49db9;
  font-size: 11px;
}
.star {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #a49db9;
  cursor: pointer;
}
.star.on {
  color: #eaa66d;
}
:global(:root[data-theme='dark']) .list-panel {
  background: rgb(45 41 59 / 88%);
  border-color: var(--border-color);
}
</style>
