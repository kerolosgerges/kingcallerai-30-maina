import React from 'react';
import { Trash2, X, CheckSquare, Square, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkDelete: () => void;
  onExport: () => void;
  allSelected: boolean;
}

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onExport,
  allSelected
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-primary">
              {selectedCount} selected
            </Badge>
            <span className="text-sm text-muted-foreground">
              of {totalCount} assistants
            </span>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="flex items-center gap-2"
            >
              {allSelected ? (
                <>
                  <Square className="h-4 w-4" />
                  Deselect All
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4" />
                  Select All
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Selected
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({selectedCount})
          </Button>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <div className="flex items-center gap-2 text-sm text-yellow-800">
          <X className="h-4 w-4" />
          <span className="font-medium">Bulk Actions Active</span>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          You can export selected assistants as backup before deletion. 
          Bulk delete operations cannot be undone.
        </p>
      </div>
    </div>
  );
};