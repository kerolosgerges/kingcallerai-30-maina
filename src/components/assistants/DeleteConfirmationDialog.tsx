import React, { useState } from 'react';
import { AlertCircle, Trash2, Loader2 } from 'lucide-react';
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

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assistant: any;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  assistant,
  onConfirm,
  isLoading
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState<'initial' | 'confirm' | 'final'>('initial');

  const resetDialog = () => {
    setStep('initial');
    setConfirmText('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog();
    }
    onOpenChange(newOpen);
  };

  const handleNext = () => {
    if (step === 'initial') {
      setStep('confirm');
    } else if (step === 'confirm' && confirmText === assistant?.agentName) {
      setStep('final');
    }
  };

  const handleConfirm = async () => {
    await onConfirm();
    resetDialog();
  };

  const isConfirmTextValid = confirmText === assistant?.agentName;

  if (!assistant) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            {step === 'initial' && 'Delete Assistant?'}
            {step === 'confirm' && 'Confirm Deletion'}
            {step === 'final' && 'Final Warning'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              {step === 'initial' && (
                <>
                  <p>
                    You are about to delete the assistant <strong>"{assistant.agentName}"</strong>.
                  </p>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-destructive">Warning</span>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• This action cannot be undone</li>
                      <li>• All assistant data will be permanently deleted</li>
                      <li>• Active calls using this assistant may be affected</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Assistant Details:</p>
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <span className="text-sm font-medium">{assistant.agentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">ID:</span>
                        <span className="text-sm font-mono">{assistant.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 'confirm' && (
                <>
                  <p>
                    To confirm deletion, please type the assistant name exactly as shown:
                  </p>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="font-mono text-sm">{assistant.agentName}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-name">Type assistant name to confirm:</Label>
                      <Input
                        id="confirm-name"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Enter assistant name"
                        className={confirmText && !isConfirmTextValid ? 'border-destructive' : ''}
                      />
                      {confirmText && !isConfirmTextValid && (
                        <p className="text-sm text-destructive">Name does not match</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {step === 'final' && (
                <>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trash2 className="h-5 w-5 text-destructive" />
                      <span className="font-bold text-destructive">FINAL WARNING</span>
                    </div>
                    <p className="text-sm">
                      You are about to permanently delete <strong>"{assistant.agentName}"</strong>.
                      This action is <strong>irreversible</strong>.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click "Delete Permanently" to proceed with the deletion.
                  </p>
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
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
              Next
            </AlertDialogAction>
          )}
          {step === 'final' && (
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Permanently
                </>
              )}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};