import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FolderPlus, 
  MoreHorizontal, 
  Download, 
  Trash2, 
  Share, 
  Grid3X3, 
  List,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileFilters } from '@/types/files';

interface FileManagerHeaderProps {
  selectedFiles: string[];
  currentFolder: string | null;
  breadcrumbs: Array<{ id: string | null; name: string }>;
  filters: FileFilters;
  viewMode: 'grid' | 'list';
  onFiltersChange: (filters: FileFilters) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onUpload: (files: FileList) => void;
  onCreateFolder: () => void;
  onBulkAction: (action: 'download' | 'delete' | 'share') => void;
  onBreadcrumbClick: (folderId: string | null) => void;
  isLoading: boolean;
}

export const FileManagerHeader = ({
  selectedFiles,
  currentFolder,
  breadcrumbs,
  filters,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onUpload,
  onCreateFolder,
  onBulkAction,
  onBreadcrumbClick,
  isLoading
}: FileManagerHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="border-b border-border bg-background">
      {/* Breadcrumbs */}
      <div className="px-6 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.id || 'root'}>
              {index > 0 && <span className="text-muted-foreground">/</span>}
              <button
                onClick={() => onBreadcrumbClick(crumb.id)}
                className={cn(
                  "hover:text-primary transition-colors",
                  index === breadcrumbs.length - 1 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground"
                )}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main toolbar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Actions */}
          <div className="flex items-center gap-3">
            <Button onClick={handleUploadClick} disabled={isLoading}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
            
            <Button variant="outline" onClick={onCreateFolder} disabled={isLoading}>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>

            {selectedFiles.length > 0 && (
              <>
                <div className="h-6 w-px bg-border" />
                <Badge variant="secondary">
                  {selectedFiles.length} selected
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onBulkAction('download')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onBulkAction('share')}
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onBulkAction('delete')}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>

          {/* Right side - View controls */}
          <div className="flex items-center gap-3">
            {/* Sort controls */}
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => onFiltersChange({ 
                ...filters, 
                sortBy: value as FileFilters['sortBy'] 
              })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ 
                ...filters, 
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
              })}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>

            <div className="h-6 w-px bg-border" />

            {/* View mode toggle */}
            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />
    </div>
  );
};