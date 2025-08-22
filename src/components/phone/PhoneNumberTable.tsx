import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PhoneNumber } from '@/services/subAccountKingCallerAuth';

interface PhoneNumberTableProps {
  phoneNumbers: PhoneNumber[];
}

export const PhoneNumberTable: React.FC<PhoneNumberTableProps> = ({
  phoneNumbers,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (phoneNumbers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 font-medium">Phone Number</th>
                <th className="p-4 font-medium">Label</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Twilio SID</th>
                <th className="p-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {phoneNumbers.map((phoneNumber) => (
                <tr key={phoneNumber.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{phoneNumber.phoneNumber}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-900">{phoneNumber.label}</div>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(phoneNumber.status)}>
                      {phoneNumber.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-500 font-mono">
                      {phoneNumber.twilioSid ? phoneNumber.twilioSid.substring(0, 20) + '...' : 'N/A'}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {phoneNumber.createdAt 
                      ? new Date(phoneNumber.createdAt).toLocaleDateString()
                      : 'N/A'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};