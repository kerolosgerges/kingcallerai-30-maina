
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare, Phone, Volume2, Smartphone, Globe, Settings } from 'lucide-react';

const NotificationsTab = () => {
  const [settings, setSettings] = useState({
    email: {
      enabled: true,
      callStarted: true,
      callEnded: true,
      callFailed: true,
      voicemailReceived: true,
      transcriptionReady: true,
      weeklyReports: true,
      monthlyBilling: true,
      securityAlerts: true,
      systemUpdates: false,
    },
    sms: {
      enabled: false,
      emergencyOnly: true,
      callFailed: false,
      systemDown: true,
    },
    push: {
      enabled: true,
      callStarted: true,
      callEnded: false,
      callFailed: true,
      agentOffline: true,
      lowBalance: true,
    },
    webhook: {
      enabled: false,
      url: '',
      events: {
        callStarted: false,
        callEnded: false,
        callFailed: false,
        transcriptionReady: false,
      }
    },
    preferences: {
      quietHours: true,
      quietStart: '22:00',
      quietEnd: '08:00',
      timezone: 'America/New_York',
      frequency: 'immediate',
      digest: false,
    }
  });

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const updateNestedSetting = (category: string, subcategory: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...prev[category][subcategory],
          [key]: value
        }
      }
    }));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 w-full">
      {/* Left Column - Communication Channels */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Configure email alerts for your voice AI platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Master switch for all email notifications
                </p>
              </div>
              <button 
                onClick={() => updateSetting('email', 'enabled', !settings.email.enabled)}
                className="px-4 py-2 rounded border bg-background hover:bg-muted transition-colors"
              >
                {settings.email.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {settings.email.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Call Events</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Call Started</Label>
                    <Switch 
                      checked={settings.email.callStarted}
                      onCheckedChange={(checked) => updateSetting('email', 'callStarted', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Call Ended</Label>
                    <Switch 
                      checked={settings.email.callEnded}
                      onCheckedChange={(checked) => updateSetting('email', 'callEnded', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Call Failed</Label>
                    <Switch 
                      checked={settings.email.callFailed}
                      onCheckedChange={(checked) => updateSetting('email', 'callFailed', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Voicemail Received</Label>
                    <Switch 
                      checked={settings.email.voicemailReceived}
                      onCheckedChange={(checked) => updateSetting('email', 'voicemailReceived', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Transcription Ready</Label>
                    <Switch 
                      checked={settings.email.transcriptionReady}
                      onCheckedChange={(checked) => updateSetting('email', 'transcriptionReady', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">System & Reports</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Weekly Reports</Label>
                    <Switch 
                      checked={settings.email.weeklyReports}
                      onCheckedChange={(checked) => updateSetting('email', 'weeklyReports', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Monthly Billing</Label>
                    <Switch 
                      checked={settings.email.monthlyBilling}
                      onCheckedChange={(checked) => updateSetting('email', 'monthlyBilling', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Security Alerts</Label>
                    <Switch 
                      checked={settings.email.securityAlerts}
                      onCheckedChange={(checked) => updateSetting('email', 'securityAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">System Updates</Label>
                    <Switch 
                      checked={settings.email.systemUpdates}
                      onCheckedChange={(checked) => updateSetting('email', 'systemUpdates', checked)}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              SMS Notifications
            </CardTitle>
            <CardDescription>
              Critical alerts via text message
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  For urgent system alerts only
                </p>
              </div>
              <Switch 
                checked={settings.sms.enabled}
                onCheckedChange={(checked) => updateSetting('sms', 'enabled', checked)}
              />
            </div>

            {settings.sms.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Emergency Only</Label>
                  <Switch 
                    checked={settings.sms.emergencyOnly}
                    onCheckedChange={(checked) => updateSetting('sms', 'emergencyOnly', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Call Failures</Label>
                  <Switch 
                    checked={settings.sms.callFailed}
                    onCheckedChange={(checked) => updateSetting('sms', 'callFailed', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">System Downtime</Label>
                  <Switch 
                    checked={settings.sms.systemDown}
                    onCheckedChange={(checked) => updateSetting('sms', 'systemDown', checked)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Real-time browser and mobile notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Instant alerts in your browser
                </p>
              </div>
              <Switch 
                checked={settings.push.enabled}
                onCheckedChange={(checked) => updateSetting('push', 'enabled', checked)}
              />
            </div>

            {settings.push.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-muted">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Call Started</Label>
                  <Switch 
                    checked={settings.push.callStarted}
                    onCheckedChange={(checked) => updateSetting('push', 'callStarted', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Call Ended</Label>
                  <Switch 
                    checked={settings.push.callEnded}
                    onCheckedChange={(checked) => updateSetting('push', 'callEnded', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Call Failed</Label>
                  <Switch 
                    checked={settings.push.callFailed}
                    onCheckedChange={(checked) => updateSetting('push', 'callFailed', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Agent Offline</Label>
                  <Switch 
                    checked={settings.push.agentOffline}
                    onCheckedChange={(checked) => updateSetting('push', 'agentOffline', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Low Balance</Label>
                  <Switch 
                    checked={settings.push.lowBalance}
                    onCheckedChange={(checked) => updateSetting('push', 'lowBalance', checked)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Advanced Settings */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Webhook Notifications
            </CardTitle>
            <CardDescription>
              Send notifications to external systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Webhooks</Label>
                <p className="text-sm text-muted-foreground">
                  Send HTTP requests to your endpoint
                </p>
              </div>
              <Switch 
                checked={settings.webhook.enabled}
                onCheckedChange={(checked) => updateSetting('webhook', 'enabled', checked)}
              />
            </div>

            {settings.webhook.enabled && (
              <div className="space-y-4 pl-4 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={settings.webhook.url}
                    onChange={(e) => updateSetting('webhook', 'url', e.target.value)}
                    placeholder="https://your-api.com/webhook"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Events to Send</Label>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Call Started</Label>
                    <Switch 
                      checked={settings.webhook.events.callStarted}
                      onCheckedChange={(checked) => updateNestedSetting('webhook', 'events', 'callStarted', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Call Ended</Label>
                    <Switch 
                      checked={settings.webhook.events.callEnded}
                      onCheckedChange={(checked) => updateNestedSetting('webhook', 'events', 'callEnded', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Call Failed</Label>
                    <Switch 
                      checked={settings.webhook.events.callFailed}
                      onCheckedChange={(checked) => updateNestedSetting('webhook', 'events', 'callFailed', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Transcription Ready</Label>
                    <Switch 
                      checked={settings.webhook.events.transcriptionReady}
                      onCheckedChange={(checked) => updateNestedSetting('webhook', 'events', 'transcriptionReady', checked)}
                    />
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Test Webhook
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Control when and how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Disable non-critical notifications during specified hours
                </p>
              </div>
              <Switch 
                checked={settings.preferences.quietHours}
                onCheckedChange={(checked) => updateSetting('preferences', 'quietHours', checked)}
              />
            </div>

            {settings.preferences.quietHours && (
              <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-muted">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Start Time</Label>
                  <Input
                    id="quietStart"
                    type="time"
                    value={settings.preferences.quietStart}
                    onChange={(e) => updateSetting('preferences', 'quietStart', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quietEnd">End Time</Label>
                  <Input
                    id="quietEnd"
                    type="time"
                    value={settings.preferences.quietEnd}
                    onChange={(e) => updateSetting('preferences', 'quietEnd', e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={settings.preferences.timezone} 
                onValueChange={(value) => updateSetting('preferences', 'timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select 
                value={settings.preferences.frequency} 
                onValueChange={(value) => updateSetting('preferences', 'frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="batched">Batched (every 15 minutes)</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a daily summary email
                </p>
              </div>
              <Switch 
                checked={settings.preferences.digest}
                onCheckedChange={(checked) => updateSetting('preferences', 'digest', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Voice & Audio Alerts
            </CardTitle>
            <CardDescription>
              Audio notifications for incoming calls and events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ringtone</Label>
              <Select defaultValue="default">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Ring</SelectItem>
                  <SelectItem value="classic">Classic Phone</SelectItem>
                  <SelectItem value="modern">Modern Chime</SelectItem>
                  <SelectItem value="gentle">Gentle Tone</SelectItem>
                  <SelectItem value="urgent">Urgent Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds for various events
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Voice Announcements</Label>
                <p className="text-sm text-muted-foreground">
                  Spoken notifications for key events
                </p>
              </div>
              <Switch />
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Volume2 className="h-4 w-4 mr-2" />
              Test Audio
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="lg:col-span-2 flex justify-end">
        <Button size="lg" className="px-8">
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
};

export default NotificationsTab;
