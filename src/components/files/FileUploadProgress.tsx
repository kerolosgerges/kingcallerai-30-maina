import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import type { FileUploadProgressItem } from '@/types/files';

interface FileUploadProgressProps {
  uploads: FileUploadProgressItem[];
  onCancel: (uploadId: string) => void;
  onDismiss: (uploadId: string) => void;
  onRetry: (uploadId: string) => void;
}

export const FileUploadProgress = ({
  uploads,
  onCancel,
  onDismiss,
  onRetry
}: FileUploadProgressProps) => {
  if (uploads.length === 0) return null;

  const activeUploads = uploads.filter(upload => upload.status === 'uploading');
  const completedUploads = uploads.filter(upload => upload.status === 'completed');
  const errorUploads = uploads.filter(upload => upload.status === 'error');

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 space-y-2">
      {/* Summary card for multiple uploads */}
      {uploads.length > 3 && (
        <Card className="shadow-lg border-border bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Progress
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => uploads.forEach(upload => onDismiss(upload.id))}
              >
                <X className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm">
              {activeUploads.length > 0 && (
                <div className="flex justify-between">
                  <span>Uploading:</span>
                  <Badge variant="secondary">{activeUploads.length}</Badge>
                </div>
              )}
              {completedUploads.length > 0 && (
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <Badge variant="default">{completedUploads.length}</Badge>
                </div>
              )}
              {errorUploads.length > 0 && (
                <div className="flex justify-between">
                  <span>Failed:</span>
                  <Badge variant="destructive">{errorUploads.length}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual upload cards (show max 3) */}
      {uploads.slice(-3).map((upload) => (
        <Card key={upload.id} className="shadow-lg border-border bg-background">
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" title={upload.name}>
                  {upload.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {upload.status === 'uploading' && (
                    <>
                      <Progress value={upload.progress} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {upload.progress}%
                      </span>
                    </>
                  )}
                  {upload.status === 'completed' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Completed</span>
                    </div>
                  )}
                  {upload.status === 'error' && (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">Failed</span>
                    </div>
                  )}
                </div>
                {upload.error && (
                  <p className="text-xs text-destructive mt-1">{upload.error}</p>
                )}
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                {upload.status === 'uploading' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onCancel(upload.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                {upload.status === 'error' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onRetry(upload.id)}
                  >
                    Retry
                  </Button>
                )}
                {(upload.status === 'completed' || upload.status === 'error') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onDismiss(upload.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};