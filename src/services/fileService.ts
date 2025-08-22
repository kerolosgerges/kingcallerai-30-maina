import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { FileItem, FolderStructure } from '@/types/files';

/**
 * FileService
 * - Normalizes `parentId` to `null` (never `undefined`)
 * - Strips undefined before Firestore writes
 * - Uses serverTimestamp() for createdAt/updatedAt
 * - Consistent queries for root (parentId === null)
 */
export class FileService {
  private static instance: FileService;

  static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────────
  private normalizeParentId(parentId?: string | null): string | null {
    return parentId ?? null; // never undefined
  }

  private stripUndefined<T extends Record<string, any>>(obj: T): T {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) out[k] = v;
    }
    return out as T;
  }

  private buildPath(name: string, parentId: string | null): string {
    return parentId ? `${parentId}/${name}` : name;
  }

  private getSortField(sortBy: string): string {
    switch (sortBy) {
      case 'name':
        return 'name';
      case 'size':
        return 'size';
      case 'date':
        return 'updatedAt';
      case 'type':
        return 'type';
      default:
        return 'name';
    }
  }

  private matchesTypeFilter(file: FileItem, type: string): boolean {
    if (file.type === 'folder') return false;
    if (!file.mimeType) return type === 'others';

    switch (type) {
      case 'images':
        return file.mimeType.startsWith('image/');
      case 'documents':
        return (
          file.mimeType.includes('pdf') ||
          file.mimeType.includes('msword') ||
          file.mimeType.includes('officedocument') ||
          file.mimeType.includes('text')
        );
      case 'videos':
        return file.mimeType.startsWith('video/');
      case 'audio':
        return file.mimeType.startsWith('audio/');
      case 'others':
        return (
          !file.mimeType.startsWith('image/') &&
          !file.mimeType.startsWith('video/') &&
          !file.mimeType.startsWith('audio/') &&
          !file.mimeType.includes('pdf') &&
          !file.mimeType.includes('document')
        );
      default:
        return true;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Create folder
  // ────────────────────────────────────────────────────────────────────────────
  async createFolder(
    subAccountId: string,
    name: string,
    parentId?: string | null,
    createdBy: string = 'system'
  ): Promise<string | null> {
    try {
      const normalizedParentId = this.normalizeParentId(parentId);

      const folderData: Omit<FileItem, 'id'> = {
        name,
        type: 'folder',
        size: 0,
        parentId: normalizedParentId,
        path: this.buildPath(name, normalizedParentId),
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        createdBy,
        subAccountId,
        tags: [],
        isShared: false,
      } as any;

      const safeData = this.stripUndefined(folderData);
      const docRef = await addDoc(collection(db, 'files'), safeData);
      console.log('✅ Folder created:', { id: docRef.id, name });
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating folder:', error);
      return null;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Upload file with progress tracking
  // ────────────────────────────────────────────────────────────────────────────
  async uploadFile(
    subAccountId: string,
    file: File,
    parentId?: string | null,
    createdBy: string = 'system',
    onProgress?: (progress: number) => void
  ): Promise<{ fileId: string | null; downloadUrl: string | null }> {
    try {
      const normalizedParentId = this.normalizeParentId(parentId);

      // 1) Create Firestore doc to reserve an ID
      const fileData: Omit<FileItem, 'id'> = {
        name: file.name,
        type: 'file',
        size: file.size ?? 0,
        mimeType: file.type || 'application/octet-stream',
        parentId: normalizedParentId,
        path: this.buildPath(file.name, normalizedParentId),
        url: '', // will be set post-upload
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        createdBy,
        subAccountId,
        tags: [],
        isShared: false,
      } as any;

      const safeData = this.stripUndefined(fileData);
      const docRef = await addDoc(collection(db, 'files'), safeData);
      const fileId = docRef.id;

      // 2) Upload bytes to Storage: /subAccountId/{fileId}
      const storageRef = ref(storage, `${subAccountId}/${fileId}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(progress);
          },
          (error) => {
            console.error('❌ Upload error:', error);
            deleteDoc(doc(db, 'files', fileId)).catch(console.error);
            reject(error);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              await updateDoc(doc(db, 'files', fileId), {
                url: downloadUrl,
                updatedAt: serverTimestamp(),
              } as any);
              console.log('✅ File uploaded:', {
                id: fileId,
                name: file.name,
                path: `${subAccountId}/${fileId}`,
              });
              resolve({ fileId, downloadUrl });
            } catch (error) {
              console.error('❌ Error updating file metadata:', error);
              deleteDoc(doc(db, 'files', fileId)).catch(console.error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      return { fileId: null, downloadUrl: null };
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Get files and folders
  // ────────────────────────────────────────────────────────────────────────────
  async getFiles(
    subAccountId: string,
    parentId?: string | null,
    filters?: {
      type?: 'all' | 'images' | 'documents' | 'videos' | 'audio' | 'others';
      sortBy?: 'name' | 'size' | 'date' | 'type';
      sortOrder?: 'asc' | 'desc';
      search?: string;
    }
  ): Promise<FileItem[]> {
    try {
      const normalizedParentId = this.normalizeParentId(parentId);

      let q = query(
        collection(db, 'files'),
        where('subAccountId', '==', subAccountId),
        where('parentId', '==', normalizedParentId)
      );

      // Sorting
      if (filters?.sortBy) {
        const sortField = this.getSortField(filters.sortBy);
        const sortDirection = filters.sortOrder === 'desc' ? 'desc' : 'asc';
        q = query(q, orderBy(sortField, sortDirection));
      } else {
        q = query(q, orderBy('name', 'asc'));
      }

      const snapshot = await getDocs(q);
      let files = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as FileItem[];

      // Client-side search
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        files = files.filter((file) => file.name.toLowerCase().includes(searchTerm));
      }

      // Client-side type filter
      if (filters?.type && filters.type !== 'all') {
        files = files.filter((file) => this.matchesTypeFilter(file, filters.type!));
      }

      console.log('📁 Files retrieved:', { count: files.length, parentId: normalizedParentId });
      return files;
    } catch (error) {
      console.error('❌ Error getting files:', error);
      return [];
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Get folder structure
  // ────────────────────────────────────────────────────────────────────────────
  async getFolderStructure(subAccountId: string): Promise<FolderStructure[]> {
    try {
      const q = query(
        collection(db, 'files'),
        where('subAccountId', '==', subAccountId),
        where('type', '==', 'folder'),
        orderBy('name', 'asc')
      );

      const snapshot = await getDocs(q);
      const folders = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as FileItem[];

      const folderMap = new Map<string, FolderStructure>();
      const rootFolders: FolderStructure[] = [];

      // Create all folder nodes
      folders.forEach((folder) => {
        const node: FolderStructure = {
          id: folder.id,
          name: folder.name,
          path: folder.path,
          parentId: (folder as any).parentId ?? null,
          children: [],
          fileCount: 0,
          totalSize: 0,
        };
        folderMap.set(folder.id, node);
        if (node.parentId == null) {
          rootFolders.push(node);
        }
      });

      // Link children
      folders.forEach((folder) => {
        const pid = (folder as any).parentId ?? null;
        if (pid && folderMap.has(pid)) {
          const parent = folderMap.get(pid)!;
          const child = folderMap.get(folder.id)!;
          parent.children.push(child);
        }
      });

      await this.calculateFolderStats(subAccountId, folderMap);
      return rootFolders;
    } catch (error) {
      console.error('❌ Error getting folder structure:', error);
      return [];
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Delete file or folder
  // ────────────────────────────────────────────────────────────────────────────
  async deleteFile(subAccountId: string, fileId: string): Promise<boolean> {
    try {
      const fileDoc = await getDoc(doc(db, 'files', fileId));
      if (!fileDoc.exists()) {
        console.error('❌ File not found:', fileId);
        return false;
      }

      const fileData = fileDoc.data() as FileItem;

      if (fileData.type === 'file') {
        try {
          const storageRef = ref(storage, `${subAccountId}/${fileId}`);
          await deleteObject(storageRef);
        } catch (storageError) {
          console.warn('⚠️ Error deleting file from storage:', storageError);
        }
      }

      if (fileData.type === 'folder') {
        await this.deleteFolderContents(subAccountId, fileId);
      }

      await deleteDoc(doc(db, 'files', fileId));
      console.log('✅ File deleted:', { id: fileId, name: fileData.name });
      return true;
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      return false;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Live subscription
  // ────────────────────────────────────────────────────────────────────────────
  subscribeToFiles(
    subAccountId: string,
    parentId: string | null,
    callback: (files: FileItem[]) => void
  ) {
    const normalizedParentId = this.normalizeParentId(parentId);

    let qRef = query(
      collection(db, 'files'),
      where('subAccountId', '==', subAccountId),
      where('parentId', '==', normalizedParentId),
      orderBy('name', 'asc')
    );

    return onSnapshot(qRef, (snapshot) => {
      const files = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as FileItem[];
      callback(files);
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Rename
  // ────────────────────────────────────────────────────────────────────────────
  async renameFile(
    subAccountId: string,
    fileId: string,
    newName: string
  ): Promise<boolean> {
    try {
      const fileDoc = await getDoc(doc(db, 'files', fileId));
      if (!fileDoc.exists()) {
        console.error('❌ File not found:', fileId);
        return false;
      }

      const fileData = fileDoc.data() as FileItem;

      if (fileData.subAccountId !== subAccountId) {
        console.error('❌ File does not belong to sub-account:', fileId);
        return false;
      }

      const parentId = (fileData as any).parentId ?? null;
      const newPath = parentId ? `${parentId}/${newName}` : newName;

      await updateDoc(doc(db, 'files', fileId), {
        name: newName,
        path: newPath,
        updatedAt: serverTimestamp(),
      } as any);

      console.log('✅ File renamed:', { id: fileId, oldName: fileData.name, newName });
      return true;
    } catch (error) {
      console.error('❌ Error renaming file:', error);
      return false;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Recursive helpers
  // ────────────────────────────────────────────────────────────────────────────
  private async deleteFolderContents(
    subAccountId: string,
    folderId: string
  ): Promise<void> {
    const qRef = query(
      collection(db, 'files'),
      where('subAccountId', '==', subAccountId),
      where('parentId', '==', folderId)
    );

    const snapshot = await getDocs(qRef);
    const batch = writeBatch(db);

    for (const d of snapshot.docs) {
      const data = d.data() as FileItem;

      if (data.type === 'folder') {
        await this.deleteFolderContents(subAccountId, d.id);
      }

      if (data.type === 'file') {
        try {
          const storageRef = ref(storage, `${subAccountId}/${d.id}`);
          await deleteObject(storageRef);
        } catch (error) {
          console.warn('⚠️ Error deleting file from storage:', error);
        }
      }

      batch.delete(d.ref);
    }

    await batch.commit();
  }

  private async calculateFolderStats(
    _subAccountId: string,
    folderMap: Map<string, FolderStructure>
  ): Promise<void> {
    // TODO: implement real aggregation if needed
    folderMap.forEach((folder) => {
      folder.fileCount = 0;
      folder.totalSize = 0;
    });
  }
}

export const fileService = FileService.getInstance();
