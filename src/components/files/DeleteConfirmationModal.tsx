import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, File, Folder } from 'lucide-react';
import type { FileItem } from '@/types/files';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  items: FileItem[];
  isLoading?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  items,
  isLoading = false
}: DeleteConfirmationModalProps) => {
  const fileCount = items.filter(item => item.type === 'file').length;
  const folderCount = items.filter(item => item.type === 'folder').length;
  const hasSubItems = items.some(item => item.type === 'folder' && item.size > 0);

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const getWarningMessage = () => {
    if (hasSubItems) {
      return "Some folders contain files that will also be deleted permanently.";
    }
    if (items.length === 1) {
      return `This ${items[0].type} will be deleted permanently.`;
    }
    return "These items will be deleted permanently.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete {items.length === 1 ? items[0].type : 'Items'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            {getWarningMessage()}
          </p>

          {/* Show summary of items being deleted */}
          <div className="flex flex-wrap gap-2">
            {fileCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <File className="h-3 w-3" />
                {fileCount} file{fileCount !== 1 ? 's' : ''}
              </Badge>
            )}
            {folderCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Folder className="h-3 w-3" />
                {folderCount} folder{folderCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {/* Show individual items if only a few */}
          {items.length <= 3 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Items to delete:</p>
              <div className="space-y-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    {item.type === 'folder' ? (
                      <Folder className="h-4 w-4 text-blue-500" />
                    ) : (
                      <File className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive font-medium">
              ⚠️ This action cannot be undone
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};