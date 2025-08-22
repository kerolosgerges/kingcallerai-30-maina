import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Folder, 
  FolderPlus, 
  Home, 
  Star, 
  Trash2, 
  Share, 
  Clock,
  ChevronRight,
  ChevronDown,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FolderStructure, FileFilters } from '@/types/files';

interface FileManagerSidebarProps {
  folders: FolderStructure[];
  currentFolder: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onCreateFolder: (parentId?: string) => void;
  filters: FileFilters;
  onFiltersChange: (filters: FileFilters) => void;
  isLoading: boolean;
}

interface FolderTreeItemProps {
  folder: FolderStructure;
  level: number;
  isSelected: boolean;
  onSelect: (folderId: string) => void;
  onCreateFolder: (parentId: string) => void;
}

const FolderTreeItem = ({ folder, level, isSelected, onSelect, onCreateFolder }: FolderTreeItemProps) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = folder.children.length > 0;

  return (
    <div>
      <div 
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent transition-colors",
          isSelected && "bg-accent text-accent-foreground",
          level > 0 && "ml-4"
        )}
        onClick={() => onSelect(folder.id)}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5 hover:bg-accent-foreground/10 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
        
        <Folder className="h-4 w-4 text-blue-500" />
        <span className="text-sm truncate flex-1">{folder.name}</span>
        
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            {folder.fileCount}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onCreateFolder(folder.id);
            }}
          >
            <FolderPlus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {folder.children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              level={level + 1}
              isSelected={child.id === folder.id}
              onSelect={onSelect}
              onCreateFolder={onCreateFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileManagerSidebar = ({
  folders,
  currentFolder,
  onFolderSelect,
  onCreateFolder,
  filters,
  onFiltersChange,
  isLoading
}: FileManagerSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);

  const quickFilters = [
    { label: 'All Files', value: 'all' as const, icon: Home },
    { label: 'Images', value: 'images' as const, icon: Star },
    { label: 'Documents', value: 'documents' as const, icon: Share },
    { label: 'Recent', value: 'all' as const, icon: Clock },
    { label: 'Shared', value: 'all' as const, icon: Share },
    { label: 'Trash', value: 'all' as const, icon: Trash2 },
  ];

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchTerm });
  };

  return (
    <div className="w-64 bg-background border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Files</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateFolder()}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="h-8"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSearch}
            className="h-8 w-8 p-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Quick Filters */}
          <div className="mb-4">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">QUICK ACCESS</h3>
            <div className="space-y-1">
              {quickFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.label}
                    onClick={() => onFiltersChange({ ...filters, type: filter.value })}
                    className={cn(
                      "w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors",
                      filters.type === filter.value && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Folders */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">FOLDERS</h3>
            <div className="space-y-1">
              {/* Root folder */}
              <div 
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent transition-colors",
                  currentFolder === null && "bg-accent text-accent-foreground"
                )}
                onClick={() => onFolderSelect(null)}
              >
                <Home className="h-4 w-4" />
                <span className="text-sm">All Files</span>
              </div>

              {/* Folder tree */}
              {folders.map((folder) => (
                <FolderTreeItem
                  key={folder.id}
                  folder={folder}
                  level={0}
                  isSelected={currentFolder === folder.id}
                  onSelect={onFolderSelect}
                  onCreateFolder={onCreateFolder}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Storage info */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between mb-1">
            <span>Storage used</span>
            <span>2.4 GB / 10 GB</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};