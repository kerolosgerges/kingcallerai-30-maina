export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  mimeType?: string;
  parentId?: string;
  path: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  subAccountId: string;
  tags: string[];
  isShared: boolean;
  shareUrl?: string;
  thumbnailUrl?: string;
}

export interface FileUploadProgressItem {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface FolderStructure {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  children: FolderStructure[];
  fileCount: number;
  totalSize: number;
}

export interface FileFilters {
  type: 'all' | 'images' | 'documents' | 'videos' | 'audio' | 'others';
  sortBy: 'name' | 'size' | 'date' | 'type';
  sortOrder: 'asc' | 'desc';
  search: string;
}

export interface FileManagerState {
  files: FileItem[];
  folders: FolderStructure[];
  currentFolder: string | null;
  selectedFiles: string[];
  uploadProgress: FileUploadProgressItem[];
  filters: FileFilters;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}