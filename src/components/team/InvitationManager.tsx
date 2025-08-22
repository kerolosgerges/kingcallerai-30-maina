
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { useSubAccount } from '@/contexts/SubAccountContext';
import { useAuth } from '@/contexts/AuthContext';
import { invitationService, type Invitation } from '@/services/invitationService';
import { useToast } from '@/hooks/use-toast';

export const InvitationManager = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  
  const { currentSubAccount } = useSubAccount();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (currentSubAccount) {
      loadInvitations();
    }
  }, [currentSubAccount]);

  const loadInvitations = async () => {
    if (!currentSubAccount) return;
    
    try {
      setLoadingInvitations(true);
      const pendingInvites = await invitationService.getPendingInvitations(currentSubAccount.id);
      setInvitations(pendingInvites);
    } catch (error) {
      console.error('Failed to load invitations:', error);
      toast({
        title: "Error",
        description: "Failed to load pending invitations",
        variant: "destructive"
      });
    } finally {
      setLoadingInvitations(false);
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSubAccount || !currentUser) return;

    try {
      setLoading(true);
      const result = await invitationService.sendInvitation(
        currentSubAccount.id,
        email.toLowerCase().trim(),
        role,
        currentUser.uid
      );

      if (result.success) {
        toast({
          title: "Invitation Sent",
          description: `Invitation sent to ${email}`,
        });
        setEmail('');
        setRole('user');
        await loadInvitations(); // Reload to show new invitation
      } else {
        toast({
          title: "Failed to Send Invitation",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!currentUser) return;

    try {
      const result = await invitationService.cancelInvitation(invitationId, currentUser.uid);
      
      if (result.success) {
        toast({
          title: "Invitation Cancelled",
          description: "The invitation has been cancelled",
        });
        await loadInvitations();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to cancel invitation",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Send Invitation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invite Team Member
          </CardTitle>
          <CardDescription>
            Send an invitation to add a new member to your sub-account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendInvitation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Pending Invitations
          </CardTitle>
          <CardDescription>
            Manage pending invitations to your sub-account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingInvitations ? (
            <div className="text-center py-4">
              <div className="text-muted-foreground">Loading invitations...</div>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No pending invitations</div>
            </div>
          ) : (
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(invitation.status)}
                    <div>
                      <div className="font-medium">{invitation.email}</div>
                      <div className="text-sm text-muted-foreground">
                        Role: {invitation.role} • Invited {new Date(invitation.invitedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(invitation.status)}>
                      {invitation.status}
                    </Badge>
                    {invitation.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelInvitation(invitation.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
