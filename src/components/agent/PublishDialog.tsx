
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish?: () => void;
}

export const PublishDialog = ({ open, onOpenChange, onPublish }: PublishDialogProps) => {
  const [versionName, setVersionName] = useState("V2- add a descriptive name (optional)");
  const [inboundEnabled, setInboundEnabled] = useState(true);
  const [outboundEnabled, setOutboundEnabled] = useState(true);
  const [inboundNumber, setInboundNumber] = useState("");
  const [outboundNumber, setOutboundNumber] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();

  const handlePublish = async () => {
    setIsPublishing(true);
    console.log("Publishing with:", {
      versionName,
      inboundEnabled,
      outboundEnabled,
      inboundNumber,
      outboundNumber
    });
    
    if (onPublish) {
      await onPublish();
    }
    
    setIsPublishing(false);
    onOpenChange(false);
    navigate("/"); // Go to root, will redirect to user's dashboard
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Publish</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-900 mb-2 block">
              Version name
            </label>
            <Input
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-900">Select Phone Number</h3>
              <p className="text-sm text-blue-600">Phone number is optional. You can proceed without it.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="inbound"
                  checked={inboundEnabled}
                  onCheckedChange={(checked) => setInboundEnabled(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <label htmlFor="inbound" className="text-sm font-medium text-gray-900">
                    Inbound phone number
                  </label>
                  <div className="flex space-x-2">
                    <Select value={inboundNumber} onValueChange={setInboundNumber}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1234567890">+1 (234) 567-890</SelectItem>
                        <SelectItem value="+1987654321">+1 (987) 654-321</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" className="text-blue-600 p-0 h-auto font-normal">
                    + Add
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="outbound"
                  checked={outboundEnabled}
                  onCheckedChange={(checked) => setOutboundEnabled(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <label htmlFor="outbound" className="text-sm font-medium text-gray-900">
                    Outbound phone number
                  </label>
                  <div className="flex space-x-2">
                    <Select value={outboundNumber} onValueChange={setOutboundNumber}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1234567890">+1 (234) 567-890</SelectItem>
                        <SelectItem value="+1987654321">+1 (987) 654-321</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" className="text-blue-600 p-0 h-auto font-normal">
                    + Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPublishing}>
            Cancel
          </Button>
          <Button onClick={handlePublish} className="bg-black text-white hover:bg-gray-800" disabled={isPublishing}>
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
