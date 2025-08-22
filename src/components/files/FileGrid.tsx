
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
  File,
  Folder,
  Image,
  FileText,
  Video,
  Music,
  Archive,
  MoreHorizontal,
  Download,
  Share,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { FileItem } from '@/types/files';

// ---------- helpers ----------
function toJsDate(value: unknown): Date | null {
  if (!value) return null;
  if (typeof (value as any)?.toDate === 'function') {
    const d = (value as any).toDate();
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value as any);
  return isNaN(d.getTime()) ? null : d;
}

function formatMaybeDate(value: unknown, fmt = 'MMM d, yyyy', fallback = '—') {
  const d = toJsDate(value);
  return d ? format(d, fmt) : fallback;
}

interface FileGridProps {
  files: FileItem[];
  selectedFiles: string[];
  onFileSelect: (fileId: string, selected: boolean) => void;
  onFileAction: (
    fileId: string,
    action: 'download' | 'share' | 'delete' | 'rename' | 'preview'
  ) => void;
  isLoading: boolean;
}

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') return Folder;
  if (!file.mimeType) return File;
  if (file.mimeType.startsWith('image/')) return Image;
  if (file.mimeType.startsWith('video/')) return Video;
  if (file.mimeType.startsWith('audio/')) return Music;
  if (file.mimeType.includes('pdf') || file.mimeType.includes('document') || file.mimeType.includes('text'))
    return FileText;
  if (file.mimeType.includes('zip') || file.mimeType.includes('archive')) return Archive;
  return File;
};

const getFileTypeColor = (file: FileItem) => {
  if (file.type === 'folder') return 'text-blue-500';
  if (!file.mimeType) return 'text-gray-500';
  if (file.mimeType.startsWith('image/')) return 'text-green-500';
  if (file.mimeType.startsWith('video/')) return 'text-purple-500';
  if (file.mimeType.startsWith('audio/')) return 'text-orange-500';
  if (file.mimeType.includes('pdf')) return 'text-red-500';
  if (file.mimeType.includes('document')) return 'text-blue-600';
  return 'text-gray-500';
};

const formatFileSize = (bytes?: number) => {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const FileCard = ({
  file,
  isSelected,
  onSelect,
  onAction
}: {
  file: FileItem;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onAction: (action: 'download' | 'share' | 'delete' | 'rename' | 'preview') => void;
}) => {
  const FileIcon = getFileIcon(file);
  const iconColor = getFileTypeColor(file);

  // Handle click on thumbnail/icon - open folder or preview file
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Thumbnail clicked for file:', file.name, file.id);
    
    if (file.type === 'folder') {
      // For folders, we'll let the parent component handle navigation
      onAction('preview'); // We'll use 'preview' action for folders too
    } else {
      // For files, always open drawer
      onAction('preview');
    }
  };

  return (
    <Card
      className={cn(
        'group transition-all hover:shadow-md border-2',
        isSelected ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border'
      )}
    >
      <CardContent className="p-4">
        {/* Checkbox & menu */}
        <div className="flex items-start justify-between mb-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(checked === true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction('preview')}>
                <Eye className="h-4 w-4 mr-2" />
                {file.type === 'folder' ? 'Open' : 'Preview'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('download')}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('share')}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('rename')}>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction('delete')}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Thumbnail / icon — clickable */}
        <div
          className="flex flex-col items-center mb-3 cursor-pointer"
          onClick={handleClick}
          onMouseDown={(e) => e.preventDefault()} // blocks middle-click new tab behavior
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? handleClick(e) : null)}
        >
          {file.thumbnailUrl ? (
            <img
              src={file.thumbnailUrl}
              alt={file.name}
              className="w-16 h-16 object-cover rounded-lg mb-2"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-lg mb-2">
              <FileIcon className={cn('h-8 w-8', iconColor)} />
            </div>
          )}
          <div className="w-full text-center">
            <p className="font-medium text-sm truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {file.type === 'folder' ? `${file.size ?? 0} items` : formatFileSize(file.size)}
            </p>
          </div>
        </div>

        {/* Tags */}
        {Array.isArray(file.tags) && file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {file.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {file.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{file.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* File info */}
        <div className="text-xs text-muted-foreground">
          <p>Modified {formatMaybeDate(file.updatedAt)}</p>
          {file.isShared && (
            <Badge variant="outline" className="text-xs mt-1">
              Shared
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const FileGrid = ({
  files,
  selectedFiles,
  onFileSelect,
  onFileAction,
  isLoading
}: FileGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-3"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3 mx-auto"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Folder className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No files found</h3>
        <p className="text-muted-foreground">
          Upload some files or create a folder to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          isSelected={selectedFiles.includes(file.id)}
          onSelect={(selected) => onFileSelect(file.id, selected)}
          onAction={(action) => onFileAction(file.id, action)}
        />
      ))}
    </div>
  );
};
