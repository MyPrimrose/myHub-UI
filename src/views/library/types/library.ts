export interface LibraryFile {
  id: number
  folderId?: number | null
  folderName?: string | null
  name: string
  originalName: string
  fileExtension: string
  mimeType: string
  fileSize: number
  favorite: boolean
  lastAccessTime?: string | null
  accessCount?: number
  createTime?: string
  updateTime?: string
}

export interface LibraryFolderNode {
  id: number
  name: string
  parentId?: number | null
  sortOrder?: number
  fileCount: number
  createTime?: string
  children: LibraryFolderNode[]
  files: LibraryFile[]
}

export interface LibraryStatistics {
  folderCount: number
  fileCount: number
  usedBytes: number
  maxBytes: number
  usedPercent: number
}

export interface LibraryPreview {
  id: number
  name: string
  fileSize: number
  content: string
  isolationMode: string
}

export interface PageResult<T> {
  records: T[]
  total: number
  page: number
  size: number
}

export type ConflictStrategy = 'REJECT' | 'RENAME' | 'OVERWRITE'
export type FolderDeleteMode = 'EMPTY_ONLY' | 'MOVE_UP'

export type LibrarySelection =
  | { type: 'all' }
  | { type: 'uncategorized' }
  | { type: 'folder'; id: number }
  | { type: 'favorites' }
  | { type: 'recent' }
