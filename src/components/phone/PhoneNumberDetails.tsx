
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Settings, Phone, MessageSquare, Shield, Star } from "lucide-react";

interface PhoneNumberDetailsProps {
  phoneNumber: string;
}

export const PhoneNumberDetails = ({ phoneNumber }: PhoneNumberDetailsProps) => {
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [verifiedPhoneEnabled, setVerifiedPhoneEnabled] = useState(false);
  const [brandedCallEnabled, setBrandedCallEnabled] = useState(false);

  // Mock data - replace with actual data from your API
  const phoneData = {
    number: "+1 (507) 580-5007",
    id: phoneNumber,
    provider: "Twilio",
    status: "active",
    monthlyFee: "$2.00"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{phoneData.number}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-muted-foreground">
              ID: {phoneData.id}
            </span>
            <Badge variant="secondary">
              Provider: {phoneData.provider}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Identity Verification Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-orange-800">Verify your identity to make outbound calls</span>
          </div>
        </CardContent>
      </Card>

      {/* Call Agent Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Inbound call agent</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <span className="text-sm">None (disable inbound)</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="inbound-webhook" />
                <Label htmlFor="inbound-webhook" className="text-sm">
                  Add an inbound webhook. <span className="text-primary">(Learn more)</span>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Outbound call agent</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted rounded-md">
              <span className="text-sm">None (disable outbound)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Add-Ons */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Add-Ons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SMS */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">SMS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The ability to send SMS ($20/month + $0.01/each SMS)
              </p>
            </div>
            <Button variant="outline" size="sm">
              Set Up
            </Button>
          </div>

          <Separator />

          {/* Verified Phone Number */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Verified Phone Number</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Set up verification to prevent your phone number from being marked as "Spam Likely". ($100.00/month)
              </p>
            </div>
            <Button variant="outline" size="sm">
              Set Up
            </Button>
          </div>

          <Separator />

          {/* Branded Call */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span className="font-medium">Branded Call</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Display your verified business name as the caller ID. ($0.1/outbound call)
              </p>
            </div>
            <Button variant="outline" size="sm">
              Set Up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
