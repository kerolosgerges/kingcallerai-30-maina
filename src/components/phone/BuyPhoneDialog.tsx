
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface BuyPhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BuyPhoneDialog = ({ open, onOpenChange }: BuyPhoneDialogProps) => {
  const [provider, setProvider] = useState("twilio");
  const [areaCode, setAreaCode] = useState("");

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving phone number with:", { provider, areaCode });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Phone Number</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Provider</Label>
            <RadioGroup value={provider} onValueChange={setProvider}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="twilio" id="twilio" />
                <Label htmlFor="twilio">Twilio</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telnyx" id="telnyx" />
                <Label htmlFor="telnyx">Telnyx</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Area Code */}
          <div className="space-y-2">
            <Label htmlFor="area-code" className="text-sm font-medium">
              Area Code <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="area-code"
              placeholder="e.g. 650"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
            />
          </div>

          {/* Pricing Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-700">
                  This number incurs a monthly fee of $2.00.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
