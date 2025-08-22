import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import type { FileItem } from '@/types/files';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => Promise<void>;
  item: FileItem | null;
  isLoading?: boolean;
}

export const RenameModal = ({
  isOpen,
  onClose,
  onRename,
  item,
  isLoading = false
}: RenameModalProps) => {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (item && isOpen) {
      // Remove file extension for files when editing
      if (item.type === 'file') {
        const lastDotIndex = item.name.lastIndexOf('.');
        if (lastDotIndex > 0) {
          setNewName(item.name.substring(0, lastDotIndex));
        } else {
          setNewName(item.name);
        }
      } else {
        setNewName(item.name);
      }
    }
  }, [item, isOpen]);

  const getFileExtension = () => {
    if (!item || item.type === 'folder') return '';
    const lastDotIndex = item.name.lastIndexOf('.');
    return lastDotIndex > 0 ? item.name.substring(lastDotIndex) : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      setError('Name is required');
      return;
    }

    if (newName.length > 50) {
      setError('Name must be less than 50 characters');
      return;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(newName)) {
      setError('Name contains invalid characters');
      return;
    }

    const finalName = item?.type === 'file' 
      ? newName.trim() + getFileExtension()
      : newName.trim();

    if (finalName === item?.name) {
      handleClose();
      return;
    }

    try {
      await onRename(finalName);
      handleClose();
    } catch (err) {
      setError('Failed to rename. Please try again.');
    }
  };

  const handleClose = () => {
    setNewName('');
    setError('');
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Rename {item.type === 'folder' ? 'Folder' : 'File'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">
                {item.type === 'folder' ? 'Folder' : 'File'} Name
              </Label>
              <div className="flex items-center">
                <Input
                  id="item-name"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setError('');
                  }}
                  placeholder={`Enter ${item.type} name`}
                  maxLength={50}
                  disabled={isLoading}
                  autoFocus
                  className={item.type === 'file' && getFileExtension() ? 'rounded-r-none' : ''}
                />
                {item.type === 'file' && getFileExtension() && (
                  <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                    {getFileExtension()}
                  </div>
                )}
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Cannot contain: &lt; &gt; : " / \ | ? *
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newName.trim() || isLoading}
            >
              {isLoading ? 'Renaming...' : 'Rename'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};