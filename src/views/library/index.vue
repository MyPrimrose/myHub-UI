<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useLibraryStore } from '@/stores/library'
import type { ConflictStrategy, LibraryFile } from './types/library'
import LibraryToolbar from './components/LibraryToolbar.vue'
import LibraryFolderTree from './components/LibraryFolderTree.vue'
import LibraryFileList from './components/LibraryFileList.vue'
import LibraryFilePreview from './components/LibraryFilePreview.vue'

const store = useLibraryStore()
const fileInput = ref<HTMLInputElement | null>(null)

let keywordTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  void store.bootstrap()
})

watch(
  () => store.selection,
  () => {
    void store.loadFiles()
  },
)

watch(
  () => store.keyword,
  () => {
    if (keywordTimer) clearTimeout(keywordTimer)
    keywordTimer = setTimeout(() => {
      void store.loadFiles()
    }, 300)
  },
)

function triggerUpload() {
  fileInput.value?.click()
}

async function onFilesChosen(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  for (const file of files) {
    const lower = file.name.toLowerCase()
    if (!lower.endsWith('.html') && !lower.endsWith('.htm')) {
      ElMessage.warning(`${file.name} 不是 HTML 文件，已跳过`)
      continue
    }
    try {
      await store.upload(file, 'REJECT')
      ElMessage.success(`已上传 ${file.name}`)
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number; data?: { message?: string } } })?.response
      if (status?.status === 409) {
        const action = await askConflict(file.name)
        if (!action) continue
        try {
          await store.upload(file, action)
          ElMessage.success(`已处理同名文件 ${file.name}`)
        } catch {
          /* toast already shown */
        }
      }
    }
  }
}

async function askConflict(name: string): Promise<ConflictStrategy | null> {
  try {
    await ElMessageBox.confirm(
      `「${name}」已存在。确定覆盖，取消则自动重命名。`,
      '同名文件',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '覆盖',
        cancelButtonText: '重命名',
        type: 'warning',
      },
    )
    return 'OVERWRITE'
  } catch (action) {
    if (action === 'cancel') return 'RENAME'
    return null
  }
}

async function createFolder(parentId?: number | null) {
  const parent =
    parentId !== undefined
      ? parentId
      : store.selection.type === 'folder'
        ? store.selection.id
        : null
  try {
    const { value } = await ElMessageBox.prompt(
      parent ? '将在当前选中文件夹下创建子文件夹' : '将创建根级文件夹',
      '新建文件夹',
      {
        confirmButtonText: '创建',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '名称不能为空',
      },
    )
    await store.createFolder(value.trim(), parent)
    ElMessage.success(parent ? '子文件夹已创建' : '文件夹已创建')
  } catch {
    /* cancelled */
  }
}

function createFolderFromToolbar() {
  void createFolder(store.selection.type === 'folder' ? store.selection.id : null)
}

async function renameFolder(id: number) {
  try {
    const { value } = await ElMessageBox.prompt('请输入新的文件夹名称', '重命名文件夹', {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '名称不能为空',
    })
    await store.renameFolder(id, value.trim())
    ElMessage.success('已重命名')
  } catch {
    /* cancelled */
  }
}

async function deleteFolder(id: number) {
  try {
    await ElMessageBox.confirm(
      '删除后文件夹本身会移除。若其中还有子文件夹或文件，会先移动到上级目录（或未归类），不会静默清空。',
      '删除文件夹',
      {
        type: 'warning',
        distinguishCancelAndClose: true,
        confirmButtonText: '上移后删除',
        cancelButtonText: '仅删空文件夹',
      },
    )
    await store.removeFolder(id, 'MOVE_UP')
    ElMessage.success('文件夹已删除')
  } catch (action) {
    if (action === 'cancel') {
      try {
        await store.removeFolder(id, 'EMPTY_ONLY')
        ElMessage.success('空文件夹已删除')
      } catch {
        /* toast already shown by interceptor when non-empty */
      }
      return
    }
    /* closed dialog */
  }
}

async function renameFile(file: LibraryFile) {
  try {
    const { value } = await ElMessageBox.prompt('请输入新的文件名', '重命名文件', {
      inputValue: file.name,
      confirmButtonText: '保存',
      cancelButtonText: '取消',
    })
    await store.renameFile(file.id, value.trim())
    ElMessage.success('已重命名')
  } catch {
    /* cancelled */
  }
}

async function moveFile(file: LibraryFile) {
  const options = flattenFolders(store.tree)
    .map((item) => `${item.id}:${item.path}`)
    .concat([':未归类的页面'])
  try {
    const { value } = await ElMessageBox.prompt(
      `输入目标文件夹 ID（可选）：\n${options.join('\n')}`,
      '移动文件',
      {
        inputPlaceholder: '留空表示未归类',
        confirmButtonText: '移动',
        cancelButtonText: '取消',
      },
    )
    const target = value.trim() === '' ? null : Number(value.trim())
    if (value.trim() && Number.isNaN(target)) {
      ElMessage.warning('请输入有效的文件夹 ID')
      return
    }
    await store.moveFile(file.id, target)
    ElMessage.success('已移动')
  } catch {
    /* cancelled */
  }
}

function flattenFolders(
  nodes: { id: number; name: string; children?: unknown[] }[],
  prefix = '',
): { id: number; path: string }[] {
  const result: { id: number; path: string }[] = []
  for (const node of nodes) {
    const path = prefix ? `${prefix}/${node.name}` : node.name
    result.push({ id: node.id, path })
    if (Array.isArray(node.children) && node.children.length) {
      result.push(
        ...flattenFolders(node.children as { id: number; name: string; children?: unknown[] }[], path),
      )
    }
  }
  return result
}

async function removeFile(file: LibraryFile) {
  try {
    await ElMessageBox.confirm(`确定删除「${file.name}」吗？`, '删除文件', {
      type: 'warning',
      confirmButtonText: '删除',
    })
    await store.removeFile(file.id)
    ElMessage.success('已删除')
  } catch {
    /* cancelled */
  }
}

async function removeSelected() {
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${store.selectedIds.length} 个文件吗？`, '批量删除', {
      type: 'warning',
      confirmButtonText: '删除',
    })
    await store.removeSelected()
    ElMessage.success('已删除')
  } catch {
    /* cancelled */
  }
}
</script>

<template>
  <div class="library-page">
    <LibraryToolbar
      :statistics="store.statistics"
      :keyword="store.keyword"
      :can-delete="store.selectedIds.length > 0"
      :uploading="store.uploading"
      :upload-progress="store.uploadProgress"
      @update:keyword="store.keyword = $event"
      @upload="triggerUpload"
      @create-folder="createFolderFromToolbar"
      @remove="removeSelected"
    />

    <div class="workspace">
      <LibraryFolderTree
        :tree="store.tree"
        :selection="store.selection"
        :recent-count="store.recent.length"
        :favorite-count="store.favorites.length"
        :uncategorized-count="store.uncategorizedCount"
        @select="store.selectNode"
        @open-file="store.openFile"
        @create-folder="createFolder"
        @rename-folder="renameFolder"
        @delete-folder="deleteFolder"
      />
      <LibraryFileList
        :files="store.files"
        :loading="store.loading"
        :selected-ids="store.selectedIds"
        :active-id="store.selectedFileId"
        @open="store.openFile"
        @toggle-select="store.toggleSelect"
        @favorite="(id, favorite) => store.toggleFavorite(id, favorite)"
        @rename="renameFile"
        @move="moveFile"
        @remove="removeFile"
      />
      <LibraryFilePreview
        :preview="store.preview"
        :loading="store.previewLoading"
        :error="store.previewError"
        :update-time="store.selectedFile?.updateTime"
        @close="store.closePreview"
        @reload="store.selectedFileId && store.openFile(store.selectedFileId)"
      />
    </div>

    <input
      ref="fileInput"
      class="hidden-input"
      type="file"
      accept=".html,.htm,text/html"
      multiple
      @change="onFilesChosen"
    />
  </div>
</template>

<style scoped lang="scss">
.library-page {
  min-width: 0;
}
.workspace {
  display: grid;
  grid-template-columns: 250px minmax(280px, 1fr) minmax(320px, 1.1fr);
  gap: 14px;
  align-items: stretch;
  min-height: 560px;
}
.hidden-input {
  display: none;
}
@media (max-width: 1180px) {
  .workspace {
    grid-template-columns: 1fr;
  }
}
</style>
