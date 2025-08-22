import { useState, useEffect, useCallback } from 'react';
import { fileService } from '@/services/fileService';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { FileItem, FolderStructure, FileFilters, FileUploadProgressItem } from '@/types/files';

export const useFileManager = () => {
  const { currentSubAccount } = useSubAccount();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // State
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderStructure[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal states
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [itemToRename, setItemToRename] = useState<FileItem | null>(null);
  const [itemsToDelete, setItemsToDelete] = useState<FileItem[]>([]);
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [totalFiles, setTotalFiles] = useState(0);

  // Filters
  const [filters, setFilters] = useState<FileFilters>({
    type: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    search: ''
  });

  // Load files with real-time subscription
  const loadFiles = useCallback(async () => {
    if (!currentSubAccount?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const allFiles = await fileService.getFiles(currentSubAccount.id, currentFolder, filters);
      setTotalFiles(allFiles.length);
      
      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedFiles = allFiles.slice(startIndex, endIndex);
      
      setFiles(paginatedFiles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load files';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentSubAccount?.id, currentFolder, filters, currentPage, itemsPerPage, toast]);

  // Set up real-time subscription for files
  useEffect(() => {
    if (!currentSubAccount?.id) return;

    const unsubscribe = fileService.subscribeToFiles(
      currentSubAccount.id,
      currentFolder,
      (updatedFiles) => {
        setTotalFiles(updatedFiles.length);
        
        // Apply filters client-side for real-time updates
        let filteredFiles = updatedFiles;
        
        // Apply search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredFiles = filteredFiles.filter(file => 
            file.name.toLowerCase().includes(searchTerm)
          );
        }

        // Apply type filter
        if (filters.type && filters.type !== 'all') {
          filteredFiles = filteredFiles.filter(file => {
            if (file.type === 'folder') return filters.type === 'all';
            if (!file.mimeType) return filters.type === 'others';

            switch (filters.type) {
              case 'images':
                return file.mimeType.startsWith('image/');
              case 'documents':
                return file.mimeType.includes('pdf') || 
                       file.mimeType.includes('document') || 
                       file.mimeType.includes('text');
              case 'videos':
                return file.mimeType.startsWith('video/');
              case 'audio':
                return file.mimeType.startsWith('audio/');
              case 'others':
                return !file.mimeType.startsWith('image/') &&
                       !file.mimeType.startsWith('video/') &&
                       !file.mimeType.startsWith('audio/') &&
                       !file.mimeType.includes('pdf') &&
                       !file.mimeType.includes('document');
              default:
                return true;
            }
          });
        }

        // Apply sorting
        filteredFiles.sort((a, b) => {
          let aValue: any, bValue: any;
          
          switch (filters.sortBy) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'size':
              aValue = a.size;
              bValue = b.size;
              break;
            case 'date':
              aValue = a.updatedAt;
              bValue = b.updatedAt;
              break;
            case 'type':
              aValue = a.type;
              bValue = b.type;
              break;
            default:
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
          }

          if (filters.sortOrder === 'desc') {
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          } else {
            return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
          }
        });

        setTotalFiles(filteredFiles.length);
        
        // Apply pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedFiles = filteredFiles.slice(startIndex, endIndex);
        
        setFiles(paginatedFiles);
      }
    );

    return unsubscribe;
  }, [currentSubAccount?.id, currentFolder, filters, currentPage, itemsPerPage]);

  // Load folder structure
  const loadFolders = useCallback(async () => {
    if (!currentSubAccount?.id) return;
    
    try {
      const folderStructure = await fileService.getFolderStructure(currentSubAccount.id);
      setFolders(folderStructure);
    } catch (err) {
      console.error('Error loading folders:', err);
    }
  }, [currentSubAccount?.id]);

  // Upload files
  const uploadFiles = useCallback(async (fileList: FileList) => {
    if (!currentSubAccount?.id || !currentUser?.uid) return;

    const newUploads: FileUploadProgressItem[] = Array.from(fileList).map(file => ({
      id: `upload_${Date.now()}_${Math.random()}`,
      name: file.name,
      progress: 0,
      status: 'uploading'
    }));

    setUploadProgress(prev => [...prev, ...newUploads]);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const uploadId = newUploads[i].id;

      try {
        const result = await fileService.uploadFile(
          currentSubAccount.id,
          file,
          currentFolder || undefined,
          currentUser.uid,
          (progress) => {
            setUploadProgress(prev => prev.map(upload => 
              upload.id === uploadId ? { ...upload, progress } : upload
            ));
          }
        );

        if (result.fileId) {
          // Mark as completed
          setUploadProgress(prev => prev.map(upload => 
            upload.id === uploadId 
              ? { ...upload, status: 'completed' as const, progress: 100 }
              : upload
          ));
        } else {
          throw new Error('Upload failed - no file ID returned');
        }

      } catch (error) {
        // Mark as error
        setUploadProgress(prev => prev.map(upload => 
          upload.id === uploadId 
            ? { 
                ...upload, 
                status: 'error' as const, 
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : upload
        ));
      }
    }

    // Files will be automatically updated via real-time subscription
    // No need to manually reload
    
    toast({
      title: "Upload Complete",
      description: `${fileList.length} file(s) uploaded successfully`,
    });
  }, [currentSubAccount?.id, currentUser?.uid, currentFolder, toast]);

  // Create folder with modal
  const createFolder = useCallback(async (name?: string, parentId?: string) => {
    if (!currentSubAccount?.id || !currentUser?.uid) return;

    if (name) {
      // Called from modal with name
      setIsPerformingAction(true);
      try {
        const folderId = await fileService.createFolder(
          currentSubAccount.id,
          name,
          parentId || currentFolder || undefined,
          currentUser.uid
        );

        if (folderId) {
          await loadFiles();
          await loadFolders();
          toast({
            title: "Folder Created",
            description: `Folder "${name}" created successfully`,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create folder",
          variant: "destructive",
        });
        throw error; // Re-throw to handle in modal
      } finally {
        setIsPerformingAction(false);
      }
    } else {
      // Show modal
      setShowCreateFolderModal(true);
    }
  }, [currentSubAccount?.id, currentUser?.uid, currentFolder, loadFiles, loadFolders, toast]);

  // Delete files with modal
  const deleteFiles = useCallback(async (fileIds?: string[]) => {
    if (!currentSubAccount?.id) return;

    if (fileIds) {
      // Called from modal confirmation
      setIsPerformingAction(true);
      try {
        for (const fileId of fileIds) {
          await fileService.deleteFile(currentSubAccount.id, fileId);
        }

        await loadFiles();
        await loadFolders();
        setSelectedFiles([]);
        
        toast({
          title: "Files Deleted",
          description: `${fileIds.length} file(s) deleted successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete files",
          variant: "destructive",
        });
        throw error; // Re-throw to handle in modal
      } finally {
        setIsPerformingAction(false);
      }
    } else {
      // Show confirmation modal
      const itemsToDelete = files.filter(file => selectedFiles.includes(file.id));
      setItemsToDelete(itemsToDelete);
      setShowDeleteModal(true);
    }
  }, [currentSubAccount?.id, files, selectedFiles, loadFiles, loadFolders, toast]);

  // File selection
  const handleFileSelect = useCallback((fileId: string, selected: boolean) => {
    setSelectedFiles(prev => 
      selected 
        ? [...prev, fileId]
        : prev.filter(id => id !== fileId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedFiles(selected ? files.map(file => file.id) : []);
  }, [files]);

  // File actions
  const handleFileOpen = useCallback((file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentFolder(file.id);
      setCurrentPage(1);
    } else {
      // Do nothing here. The page will open the VoicePreviewDrawer.
    }
  }, []);

const handleFileAction = useCallback(async (fileId: string, action: string) => {
  const file = files.find(f => f.id === fileId);
  if (!file) return;

  switch (action) {
    case 'download':
      if (file.url) window.open(file.url, '_blank');
      break;
    case 'delete':
      setItemsToDelete([file]);
      setShowDeleteModal(true);
      break;
    case 'share':
      toast({ title: "Share", description: "Share functionality coming soon" });
      break;
    case 'rename':
      setItemToRename(file);
      setShowRenameModal(true);
      break;
    case 'preview':
      // Intentionally do nothing.
      // FilesPage intercepts 'preview' and opens the VoicePreviewDrawer.
      break;
  }
}, [files, toast]);




  // Rename file/folder
  const renameItem = useCallback(async (newName: string) => {
    if (!itemToRename || !currentSubAccount?.id) return;

    setIsPerformingAction(true);
    try {
      const success = await fileService.renameFile(
        currentSubAccount.id,
        itemToRename.id,
        newName
      );

      if (success) {
        await loadFiles();
        await loadFolders();
        
        toast({
          title: "Renamed Successfully",
          description: `"${itemToRename.name}" renamed to "${newName}"`,
        });
      } else {
        throw new Error('Failed to rename file');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename item",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsPerformingAction(false);
    }
  }, [itemToRename, currentSubAccount?.id, loadFiles, loadFolders, toast]);

  // Bulk actions
  const handleBulkAction = useCallback(async (action: 'download' | 'delete' | 'share') => {
    if (selectedFiles.length === 0) return;

    switch (action) {
      case 'delete':
        const itemsToDelete = files.filter(file => selectedFiles.includes(file.id));
        setItemsToDelete(itemsToDelete);
        setShowDeleteModal(true);
        break;
      case 'download':
        // Implement bulk download
        toast({
          title: "Download",
          description: "Bulk download coming soon",
        });
        break;
      case 'share':
        // Implement bulk share
        toast({
          title: "Share",
          description: "Bulk share coming soon",
        });
        break;
    }
  }, [selectedFiles, files, toast]);

  // Upload progress management
  const handleCancelUpload = useCallback((uploadId: string) => {
    setUploadProgress(prev => prev.filter(upload => upload.id !== uploadId));
  }, []);

  const handleDismissUpload = useCallback((uploadId: string) => {
    setUploadProgress(prev => prev.filter(upload => upload.id !== uploadId));
  }, []);

  const handleRetryUpload = useCallback((uploadId: string) => {
    // Implement retry logic
    toast({
      title: "Retry",
      description: "Retry functionality coming soon",
    });
  }, [toast]);

  // Navigation
  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolder(folderId);
    setCurrentPage(1);
    setSelectedFiles([]);
  }, []);

  const getBreadcrumbs = useCallback(() => {
    const breadcrumbs = [{ id: null, name: 'All Files' }];
    
    if (currentFolder) {
      // This would need to be implemented to build the full path
      // For now, just show current folder
      const folder = folders.find(f => f.id === currentFolder);
      if (folder) {
        breadcrumbs.push({ id: folder.id, name: folder.name });
      }
    }
    
    return breadcrumbs;
  }, [currentFolder, folders]);

  // Effects - Remove the manual loadFiles effect since we're using real-time subscription
  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  // Calculate total pages
  const totalPages = Math.ceil(totalFiles / itemsPerPage);

  return {
    // State
    files,
    folders,
    currentFolder,
    selectedFiles,
    uploadProgress,
    isLoading,
    error,
    viewMode,
    filters,
    currentPage,
    totalPages,
    itemsPerPage,
    totalFiles,
    
    // Modal states
    showCreateFolderModal,
    showDeleteModal,
    showRenameModal,
    itemToRename,
    itemsToDelete,
    isPerformingAction,
    
    // Actions
    uploadFiles,
    createFolder,
    deleteFiles,
    renameItem,
    handleFileSelect,
    handleSelectAll,
    handleFileOpen,
    handleFileAction,
    handleBulkAction,
    navigateToFolder,
    
    // Modal controls
    setShowCreateFolderModal,
    setShowDeleteModal,
    setShowRenameModal,
    
    // Upload management
    handleCancelUpload,
    handleDismissUpload,
    handleRetryUpload,
    
    // UI state
    setFilters,
    setViewMode,
    setCurrentPage,
    setItemsPerPage,
    
    // Utilities
    getBreadcrumbs,
    loadFiles,
    loadFolders
  };
};