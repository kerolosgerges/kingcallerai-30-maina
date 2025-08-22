
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: any;
}

export const CodePreviewDialog = ({ open, onOpenChange, payload }: CodePreviewDialogProps) => {
  const { toast } = useToast();

  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    toast({
      title: "Copied to clipboard",
      description: "Tool configuration copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Tool Configuration Preview</DialogTitle>
              <DialogDescription>
                JSON payload that will be sent to the API
              </DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4 overflow-auto max-h-96">
            <pre className="text-sm font-mono text-muted-foreground">
              {jsonString}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
