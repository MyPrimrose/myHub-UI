import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  batchDeleteLibraryFiles,
  createLibraryFolder,
  deleteLibraryFile,
  deleteLibraryFolder,
  favoriteLibraryFile,
  fetchLibraryFavorites,
  fetchLibraryFiles,
  fetchLibraryPreview,
  fetchLibraryRecent,
  fetchLibraryStatistics,
  fetchLibraryTree,
  moveLibraryFile,
  renameLibraryFile,
  renameLibraryFolder,
  uploadLibraryFile,
} from '@/api/modules/library'
import type {
  ConflictStrategy,
  FolderDeleteMode,
  LibraryFile,
  LibraryFolderNode,
  LibraryPreview,
  LibrarySelection,
  LibraryStatistics,
} from '@/views/library/types/library'

export const useLibraryStore = defineStore('library', () => {
  const tree = ref<LibraryFolderNode[]>([])
  const files = ref<LibraryFile[]>([])
  const statistics = ref<LibraryStatistics | null>(null)
  const recent = ref<LibraryFile[]>([])
  const favorites = ref<LibraryFile[]>([])
  const selection = ref<LibrarySelection>({ type: 'all' })
  const selectedFileId = ref<number | null>(null)
  const selectedIds = ref<number[]>([])
  const preview = ref<LibraryPreview | null>(null)
  const previewError = ref<string | null>(null)
  const keyword = ref('')
  const loading = ref(false)
  const previewLoading = ref(false)
  const uploading = ref(false)
  const uploadProgress = ref(0)
  const uncategorizedCount = ref(0)
  const error = ref<string | null>(null)

  const selectedFile = computed(
    () => files.value.find((item) => item.id === selectedFileId.value) || null,
  )

  const currentFolderId = computed(() =>
    selection.value.type === 'folder' ? selection.value.id : null,
  )

  async function refreshMeta() {
    const [stats, recentRes, favRes, treeRes, uncategorizedRes] = await Promise.all([
      fetchLibraryStatistics(),
      fetchLibraryRecent(),
      fetchLibraryFavorites(),
      fetchLibraryTree(),
      fetchLibraryFiles({ uncategorized: true, page: 1, size: 1 }),
    ])
    statistics.value = stats.data
    recent.value = recentRes.data || []
    favorites.value = favRes.data || []
    tree.value = treeRes.data || []
    uncategorizedCount.value = uncategorizedRes.data?.total || 0
  }

  async function loadFiles() {
    loading.value = true
    error.value = null
    try {
      if (selection.value.type === 'favorites') {
        const result = await fetchLibraryFavorites(100)
        files.value = result.data || []
        return
      }
      if (selection.value.type === 'recent') {
        const result = await fetchLibraryRecent(50)
        files.value = result.data || []
        return
      }
      const result = await fetchLibraryFiles({
        folderId: selection.value.type === 'folder' ? selection.value.id : undefined,
        uncategorized: selection.value.type === 'uncategorized',
        keyword: keyword.value || undefined,
        page: 1,
        size: 100,
      })
      files.value = result.data?.records || []
    } catch (err) {
      error.value = '文件列表加载失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function bootstrap() {
    await refreshMeta()
    await loadFiles()
  }

  function selectNode(next: LibrarySelection) {
    selection.value = next
    selectedIds.value = []
    selectedFileId.value = null
    preview.value = null
  }

  async function openFile(id: number) {
    selectedFileId.value = id
    previewLoading.value = true
    previewError.value = null
    try {
      const result = await fetchLibraryPreview(id)
      preview.value = result.data
      if (!result.data?.content) {
        previewError.value = '预览内容为空，请检查文件编码后重新上传。'
      }
      await refreshMeta()
      await loadFiles()
    } catch {
      preview.value = null
      previewError.value = '预览加载失败，请稍后重试。'
    } finally {
      previewLoading.value = false
    }
  }

  function closePreview() {
    preview.value = null
    previewError.value = null
    selectedFileId.value = null
  }

  async function createFolder(name: string, parentId?: number | null) {
    await createLibraryFolder({ name, parentId: parentId ?? null })
    await refreshMeta()
  }

  async function renameFolder(id: number, name: string) {
    await renameLibraryFolder(id, { name })
    await refreshMeta()
  }

  async function removeFolder(id: number, mode: FolderDeleteMode) {
    await deleteLibraryFolder(id, mode)
    if (selection.value.type === 'folder' && selection.value.id === id) {
      selection.value = { type: 'all' }
    }
    await refreshMeta()
    await loadFiles()
  }

  async function upload(file: File, conflictStrategy: ConflictStrategy = 'REJECT') {
    uploading.value = true
    uploadProgress.value = 0
    try {
      const folderId =
        selection.value.type === 'folder'
          ? selection.value.id
          : selection.value.type === 'uncategorized'
            ? null
            : currentFolderId.value
      const result = await uploadLibraryFile(file, {
        folderId: folderId ?? null,
        conflictStrategy,
        onProgress: (pct) => {
          uploadProgress.value = pct
        },
      })
      await refreshMeta()
      await loadFiles()
      return result.data
    } finally {
      uploading.value = false
      uploadProgress.value = 0
    }
  }

  async function renameFile(id: number, name: string) {
    await renameLibraryFile(id, name)
    await loadFiles()
  }

  async function moveFile(id: number, targetFolderId: number | null) {
    await moveLibraryFile(id, targetFolderId)
    await refreshMeta()
    await loadFiles()
  }

  async function toggleFavorite(id: number, favorite: boolean) {
    await favoriteLibraryFile(id, favorite)
    await refreshMeta()
    await loadFiles()
  }

  async function removeFile(id: number) {
    await deleteLibraryFile(id)
    if (selectedFileId.value === id) closePreview()
    selectedIds.value = selectedIds.value.filter((item) => item !== id)
    await refreshMeta()
    await loadFiles()
  }

  async function removeSelected() {
    if (!selectedIds.value.length) return
    await batchDeleteLibraryFiles(selectedIds.value)
    if (selectedFileId.value && selectedIds.value.includes(selectedFileId.value)) closePreview()
    selectedIds.value = []
    await refreshMeta()
    await loadFiles()
  }

  function toggleSelect(id: number) {
    if (selectedIds.value.includes(id)) {
      selectedIds.value = selectedIds.value.filter((item) => item !== id)
    } else {
      selectedIds.value = [...selectedIds.value, id]
    }
  }

  return {
    tree,
    files,
    statistics,
    recent,
    favorites,
    selection,
    selectedFileId,
    selectedIds,
    selectedFile,
    preview,
    previewError,
    keyword,
    loading,
    previewLoading,
    uploading,
    uploadProgress,
    uncategorizedCount,
    error,
    currentFolderId,
    bootstrap,
    refreshMeta,
    loadFiles,
    selectNode,
    openFile,
    closePreview,
    createFolder,
    renameFolder,
    removeFolder,
    upload,
    renameFile,
    moveFile,
    toggleFavorite,
    removeFile,
    removeSelected,
    toggleSelect,
  }
})
