import { request } from '../request'
import type {
  ConflictStrategy,
  FolderDeleteMode,
  LibraryFile,
  LibraryFolderNode,
  LibraryPreview,
  LibraryStatistics,
  PageResult,
} from '@/views/library/types/library'

interface ApiResult<T> {
  code: number
  message: string
  data: T
}

export async function fetchLibraryTree() {
  return request.get('/library/folders/tree') as Promise<ApiResult<LibraryFolderNode[]>>
}

export async function createLibraryFolder(payload: { name: string; parentId?: number | null }) {
  return request.post('/library/folders', payload) as Promise<ApiResult<LibraryFolderNode>>
}

export async function renameLibraryFolder(id: number, payload: { name: string }) {
  return request.put(`/library/folders/${id}`, payload) as Promise<ApiResult<LibraryFolderNode>>
}

export async function moveLibraryFolder(id: number, targetFolderId: number | null) {
  return request.put(`/library/folders/${id}/move`, { targetFolderId }) as Promise<ApiResult<null>>
}

export async function deleteLibraryFolder(id: number, mode: FolderDeleteMode = 'EMPTY_ONLY') {
  return request.delete(`/library/folders/${id}`, { params: { mode } }) as Promise<ApiResult<null>>
}

export async function fetchLibraryFiles(params: {
  folderId?: number | null
  uncategorized?: boolean
  keyword?: string
  favorite?: boolean
  page?: number
  size?: number
}) {
  return request.get('/library/files', { params }) as Promise<ApiResult<PageResult<LibraryFile>>>
}

export async function uploadLibraryFile(
  file: File,
  options: { folderId?: number | null; conflictStrategy?: ConflictStrategy; onProgress?: (pct: number) => void },
) {
  const form = new FormData()
  form.append('file', file)
  if (options.folderId != null) form.append('folderId', String(options.folderId))
  form.append('conflictStrategy', options.conflictStrategy || 'REJECT')
  return request.post('/library/files/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    transformRequest: [
      (data, headers) => {
        // Let the browser set multipart boundary.
        if (headers && typeof headers === 'object') {
          delete (headers as Record<string, unknown>)['Content-Type']
        }
        return data
      },
    ],
    onUploadProgress: (event) => {
      if (!options.onProgress || !event.total) return
      options.onProgress(Math.round((event.loaded / event.total) * 100))
    },
  }) as Promise<ApiResult<LibraryFile>>
}

export async function fetchLibraryFile(id: number) {
  return request.get(`/library/files/${id}`) as Promise<ApiResult<LibraryFile>>
}

export async function fetchLibraryPreview(id: number) {
  return request.get(`/library/files/${id}/preview`, {
    timeout: 60_000,
  }) as Promise<ApiResult<LibraryPreview>>
}

export async function renameLibraryFile(id: number, name: string) {
  return request.put(`/library/files/${id}`, { name }) as Promise<ApiResult<LibraryFile>>
}

export async function moveLibraryFile(id: number, targetFolderId: number | null) {
  return request.put(`/library/files/${id}/move`, { targetFolderId }) as Promise<ApiResult<LibraryFile>>
}

export async function favoriteLibraryFile(id: number, favorite: boolean) {
  return request.patch(`/library/files/${id}/favorite`, { favorite }) as Promise<ApiResult<LibraryFile>>
}

export async function deleteLibraryFile(id: number) {
  return request.delete(`/library/files/${id}`) as Promise<ApiResult<null>>
}

export async function batchDeleteLibraryFiles(ids: number[]) {
  return request.delete('/library/files/batch', { data: { ids } }) as Promise<ApiResult<null>>
}

export async function fetchLibraryStatistics() {
  return request.get('/library/statistics') as Promise<ApiResult<LibraryStatistics>>
}

export async function fetchLibraryRecent(limit = 10) {
  return request.get('/library/recent', { params: { limit } }) as Promise<ApiResult<LibraryFile[]>>
}

export async function fetchLibraryFavorites(limit = 50) {
  return request.get('/library/favorites', { params: { limit } }) as Promise<ApiResult<LibraryFile[]>>
}
