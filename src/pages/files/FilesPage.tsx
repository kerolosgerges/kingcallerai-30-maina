
import React, { useCallback, useMemo, useState } from 'react';
import { FileManagerSidebar } from '@/components/files/FileManagerSidebar';
import { FileManagerHeader } from '@/components/files/FileManagerHeader';
import { FileGrid } from '@/components/files/FileGrid';
import { FileUploadProgress } from '@/components/files/FileUploadProgress';
import { FilePagination } from '@/components/files/FilePagination';
import { CreateFolderModal } from '@/components/files/CreateFolderModal';
import { DeleteConfirmationModal } from '@/components/files/DeleteConfirmationModal';
import { RenameModal } from '@/components/files/RenameModal';
import { VoicePreviewDrawer } from '@/components/files/VoicePreviewDrawer';
import { useFileManager } from '@/hooks/useFileManager';
import type { FileItem } from '@/types/files';

const FilesPage = () => {
  const {
    files,
    folders,
    currentFolder,
    selectedFiles,
    uploadProgress,
    isLoading,
    viewMode,
    filters,
    currentPage,
    totalPages,
    itemsPerPage,
    totalFiles,
    uploadFiles,
    createFolder,
    deleteFiles,
    renameItem,
    handleFileSelect,
    handleSelectAll,
    handleFileAction: hookHandleFileAction,
    handleBulkAction,
    navigateToFolder,
    showCreateFolderModal,
    showDeleteModal,
    showRenameModal,
    itemToRename,
    itemsToDelete,
    isPerformingAction,
    setShowCreateFolderModal,
    setShowDeleteModal,
    setShowRenameModal,
    handleCancelUpload,
    handleDismissUpload,
    handleRetryUpload,
    setFilters,
    setViewMode,
    setCurrentPage,
    setItemsPerPage,
    getBreadcrumbs,
  } = useFileManager();

  // Drawer state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  // Handle file actions including folder navigation and file preview
  const handleFileAction = useCallback((
    fileId: string,
    action: 'download' | 'share' | 'delete' | 'rename' | 'preview'
  ) => {
    const file = files.find(x => x.id === fileId);
    if (!file) return;

    if (action === 'preview') {
      if (file.type === 'folder') {
        // Navigate to folder
        navigateToFolder(file.id);
      } else {
        // Open file in preview drawer
        setPreviewFile(file);
        setPreviewOpen(true);
      }
      return;
    }
    
    // Delegate other actions to the hook
    hookHandleFileAction(fileId, action);
  }, [files, hookHandleFileAction, navigateToFolder]);

  // Stable transcript loader (only when a file is selected)
  const requestTranscript = useCallback(async () => {
    if (!previewFile?.id) return [];
    const res = await fetch(`/api/transcripts?id=${encodeURIComponent(previewFile.id)}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.words || []);
  }, [previewFile?.id]);

  // Memo the props we pass to the drawer to avoid prop identity churn
  const drawerProps = useMemo(() => {
    if (!previewFile) return null;
    return {
      fileUrl: previewFile.url ?? '',
      fileName: previewFile.name ?? 'File',
      mimeType: previewFile.mimeType,
      sizeBytes: previewFile.size,
      onRequestTranscript: requestTranscript,
    } as const;
  }, [previewFile, requestTranscript]);

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <FileManagerSidebar
        folders={folders}
        currentFolder={currentFolder}
        onFolderSelect={navigateToFolder}
        onCreateFolder={createFolder}
        filters={filters}
        onFiltersChange={setFilters}
        isLoading={isLoading}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <FileManagerHeader
          selectedFiles={selectedFiles}
          currentFolder={currentFolder}
          breadcrumbs={getBreadcrumbs()}
          filters={filters}
          viewMode={viewMode}
          onFiltersChange={setFilters}
          onViewModeChange={setViewMode}
          onUpload={uploadFiles}
          onCreateFolder={() => createFolder()}
          onBulkAction={handleBulkAction}
          onBreadcrumbClick={navigateToFolder}
          isLoading={isLoading}
        />

        {/* File Grid */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <FileGrid
              files={files}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onFileAction={handleFileAction}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <FilePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalFiles}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>

      {/* Upload Progress */}
      <FileUploadProgress
        uploads={uploadProgress}
        onCancel={handleCancelUpload}
        onDismiss={handleDismissUpload}
        onRetry={handleRetryUpload}
      />

      {/* Modals */}
      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onCreateFolder={createFolder}
        parentFolderName={currentFolder ? folders.find(f => f.id === currentFolder)?.name : undefined}
        isLoading={isPerformingAction}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteFiles(itemsToDelete.map(item => item.id))}
        items={itemsToDelete}
        isLoading={isPerformingAction}
      />

      <RenameModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onRename={renameItem}
        item={itemToRename}
        isLoading={isPerformingAction}
      />

      {/* Drawer — only mount when open & we have a file.
          key={id} forces a clean instance when switching files quickly. */}
      {previewOpen && drawerProps && (
        <VoicePreviewDrawer
          key={previewFile!.id}
          open={previewOpen}
          onClose={() => { setPreviewOpen(false); setPreviewFile(null); }}
          {...drawerProps}
        />
      )}
    </div>
  );
};

export default FilesPage;
