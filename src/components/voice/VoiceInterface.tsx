
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Phone, PhoneOff, Square, Play } from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { cn } from '@/lib/utils';

interface VoiceInterfaceProps {
  agentId?: string;
  onRecordingComplete?: (blob: Blob) => void;
}

export const VoiceInterface = ({ agentId, onRecordingComplete }: VoiceInterfaceProps) => {
  const [recordings, setRecordings] = useState<{ id: string; blob: Blob; timestamp: Date }[]>([]);
  
  const {
    isConnected,
    isMuted,
    isRecording,
    connect,
    disconnect,
    toggleMute,
    startRecording,
    stopRecording
  } = useWebRTC();

  const handleStartRecording = () => {
    if (!isConnected) {
      connect().then(() => {
        startRecording();
      });
    } else {
      startRecording();
    }
  };

  const handleStopRecording = () => {
    const blob = stopRecording();
    if (blob) {
      const recording = {
        id: Date.now().toString(),
        blob,
        timestamp: new Date()
      };
      setRecordings(prev => [recording, ...prev]);
      onRecordingComplete?.(blob);
    }
  };

  const playRecording = (blob: Blob) => {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Voice Interface
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={isConnected ? disconnect : connect}
            variant={isConnected ? "destructive" : "default"}
            size="lg"
            className="rounded-full h-16 w-16"
          >
            {isConnected ? <PhoneOff className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
          </Button>
          
          {isConnected && (
            <Button
              onClick={toggleMute}
              variant={isMuted ? "destructive" : "outline"}
              size="lg"
              className="rounded-full h-16 w-16"
            >
              {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          )}
        </div>
        
        {isConnected && (
          <div className="flex justify-center">
            <Button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              variant={isRecording ? "destructive" : "default"}
              className={cn(
                "rounded-full h-20 w-20",
                isRecording && "animate-pulse"
              )}
            >
              {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
          </div>
        )}
        
        {recordings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recordings</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <span className="text-xs text-muted-foreground">
                    {recording.timestamp.toLocaleTimeString()}
                  </span>
                  <Button
                    onClick={() => playRecording(recording.blob)}
                    variant="ghost"
                    size="sm"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
