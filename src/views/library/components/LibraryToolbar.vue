<script setup lang="ts">
import { FolderPlus, Plus, Trash2 } from 'lucide-vue-next'
import type { LibraryStatistics } from '../types/library'
import LibraryStorageUsage from './LibraryStorageUsage.vue'

defineProps<{
  statistics: LibraryStatistics | null
  keyword: string
  canDelete: boolean
  uploading?: boolean
  uploadProgress?: number
}>()

const emit = defineEmits<{
  'update:keyword': [value: string]
  upload: []
  createFolder: []
  remove: []
}>()
</script>

<template>
  <div class="toolbar-wrap">
    <div class="header">
      <div>
        <h1>我的 HTML 小站</h1>
        <p>上传 .html 文件，文件名会成为左侧菜单名称；只接受 HTML，其它格式会被拦截。</p>
      </div>
      <LibraryStorageUsage :statistics="statistics" />
    </div>

    <div class="actions">
      <div class="left">
        <button type="button" class="primary" :disabled="uploading" @click="emit('upload')">
          <Plus :size="15" />
          {{ uploading ? `上传中 ${uploadProgress || 0}%` : '新增文件' }}
        </button>
        <button type="button" class="ghost" @click="emit('createFolder')">
          <FolderPlus :size="15" />
          新建文件夹
        </button>
        <button type="button" class="ghost danger" :disabled="!canDelete" @click="emit('remove')">
          <Trash2 :size="15" />
          删除文件
        </button>
        <input
          :value="keyword"
          type="search"
          placeholder="搜索文件或文件夹名称..."
          @input="emit('update:keyword', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="count">
        {{ statistics?.folderCount ?? 0 }} 个文件夹 · {{ statistics?.fileCount ?? 0 }} 个页面
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar-wrap {
  margin-bottom: 16px;
}
.header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 16px;
}
.header h1 {
  margin: 0;
  font-size: 26px;
  letter-spacing: -0.04em;
}
.header p {
  margin: 8px 0 0;
  color: #8b84a3;
  font-size: 13px;
  max-width: 560px;
  line-height: 1.55;
}
.actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.left {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.primary,
.ghost {
  height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  border-radius: 12px;
  border: 0;
  cursor: pointer;
  font-size: 13px;
}
.primary {
  color: white;
  background: #8b6df0;
  box-shadow: 0 12px 22px -16px #8b6df0;
}
.ghost {
  border: 1px solid #ebe6f6;
  background: white;
  color: #5b5475;
}
.ghost:disabled,
.primary:disabled {
  opacity: 0.45;
  cursor: default;
}
.ghost.danger {
  color: #d56f8e;
}
.left input {
  height: 36px;
  min-width: 220px;
  border: 1px solid #ebe6f6;
  border-radius: 12px;
  padding: 0 12px;
  background: #faf8ff;
  color: var(--text-primary);
}
.count {
  color: #9a93b2;
  font-size: 12px;
}
@media (max-width: 860px) {
  .header {
    flex-direction: column;
  }
}
</style>
