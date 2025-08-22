import React, { useState } from 'react';
import { AlertCircle, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BulkDeleteResult {
  assistant: any;
  success: boolean;
  error?: string;
}

interface BulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAssistants: any[];
  onConfirm: (assistants: any[]) => Promise<BulkDeleteResult[]>;
}

export const BulkDeleteDialog: React.FC<BulkDeleteDialogProps> = ({
  open,
  onOpenChange,
  selectedAssistants,
  onConfirm
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState<'initial' | 'confirm' | 'processing' | 'results'>('initial');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BulkDeleteResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const resetDialog = () => {
    setStep('initial');
    setConfirmText('');
    setProgress(0);
    setResults([]);
    setIsProcessing(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isProcessing) {
      resetDialog();
    }
    onOpenChange(newOpen);
  };

  const handleNext = () => {
    if (step === 'initial') {
      setStep('confirm');
    } else if (step === 'confirm' && isConfirmTextValid) {
      handleBulkDelete();
    }
  };

  const handleBulkDelete = async () => {
    setStep('processing');
    setIsProcessing(true);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const deleteResults = await onConfirm(selectedAssistants);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(deleteResults);
      setStep('results');
    } catch (error) {
      console.error('Bulk delete failed:', error);
      // Handle error case
    } finally {
      setIsProcessing(false);
    }
  };

  const requiredConfirmText = `DELETE ${selectedAssistants.length} ASSISTANTS`;
  const isConfirmTextValid = confirmText === requiredConfirmText;

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            {step === 'initial' && `Delete ${selectedAssistants.length} Assistants?`}
            {step === 'confirm' && 'Confirm Bulk Deletion'}
            {step === 'processing' && 'Deleting Assistants...'}
            {step === 'results' && 'Deletion Results'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {step === 'initial' && (
                <>
                  <p>
                    You are about to delete <strong>{selectedAssistants.length} assistants</strong>.
                  </p>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-destructive">Warning</span>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• This action cannot be undone</li>
                      <li>• All assistant data will be permanently deleted</li>
                      <li>• Active calls using these assistants may be affected</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Selected Assistants:</p>
                    <ScrollArea className="h-32 w-full border rounded-lg p-3">
                      <div className="space-y-2">
                        {selectedAssistants.map((assistant) => (
                          <div key={assistant.id} className="flex justify-between items-center">
                            <span className="text-sm font-medium">{assistant.agentName}</span>
                            <Badge variant="secondary">Active</Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              )}

              {step === 'confirm' && (
                <>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="font-bold text-destructive mb-2">
                      BULK DELETION CONFIRMATION
                    </p>
                    <p className="text-sm">
                      To confirm deletion of all {selectedAssistants.length} assistants, 
                      type the exact phrase below:
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="font-mono text-sm font-bold">{requiredConfirmText}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bulk-confirm">Type the phrase to confirm:</Label>
                      <Input
                        id="bulk-confirm"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type confirmation phrase"
                        className={confirmText && !isConfirmTextValid ? 'border-destructive' : ''}
                      />
                      {confirmText && !isConfirmTextValid && (
                        <p className="text-sm text-destructive">Phrase does not match</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {step === 'processing' && (
                <>
                  <div className="space-y-4">
                    <p>Deleting {selectedAssistants.length} assistants...</p>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      {progress < 100 ? 'Please wait while we delete the assistants...' : 'Finalizing...'}
                    </p>
                  </div>
                </>
              )}

              {step === 'results' && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">Successful</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{successCount}</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-800">Failed</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600">{failureCount}</p>
                      </div>
                    </div>
                    
                    {results.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-medium">Detailed Results:</p>
                        <ScrollArea className="h-40 w-full border rounded-lg p-3">
                          <div className="space-y-2">
                            {results.map((result, index) => (
                              <div key={index} className="flex items-center justify-between p-2 rounded border">
                                <span className="text-sm">{result.assistant.agentName}</span>
                                <div className="flex items-center gap-2">
                                  {result.success ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {result.success ? 'Deleted' : result.error || 'Failed'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {step !== 'processing' && (
            <AlertDialogCancel onClick={() => handleOpenChange(false)}>
              {step === 'results' ? 'Close' : 'Cancel'}
            </AlertDialogCancel>
          )}
          {step === 'initial' && (
            <AlertDialogAction
              onClick={handleNext}
              className="bg-destructive hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          )}
          {step === 'confirm' && (
            <AlertDialogAction
              onClick={handleNext}
              disabled={!isConfirmTextValid}
              className="bg-destructive hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};