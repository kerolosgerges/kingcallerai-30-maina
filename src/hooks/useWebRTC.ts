
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

interface WebRTCHook {
  isConnected: boolean;
  isMuted: boolean;
  isRecording: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  toggleMute: () => void;
  startRecording: () => void;
  stopRecording: () => Blob | null;
}

const defaultConfig: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export const useWebRTC = (config: WebRTCConfig = defaultConfig): WebRTCHook => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  const initializePeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(config);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
        // Send candidate to remote peer via signaling server
      }
    };
    
    pc.ontrack = (event) => {
      console.log('Remote stream received');
      setRemoteStream(event.streams[0]);
    };
    
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      setIsConnected(pc.connectionState === 'connected');
    };
    
    peerConnection.current = pc;
  }, [config]);

  const connect = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true 
        },
        video: false
      });
      
      setLocalStream(stream);
      initializePeerConnection();
      
      if (peerConnection.current) {
        stream.getTracks().forEach(track => {
          peerConnection.current!.addTrack(track, stream);
        });
      }
      
      toast({
        title: "Microphone connected",
        description: "Ready for voice interaction"
      });
    } catch (error) {
      console.error('Failed to get media devices:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice features",
        variant: "destructive"
      });
    }
  }, [initializePeerConnection, toast]);

  const disconnect = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    setIsConnected(false);
    setRemoteStream(null);
  }, [localStream]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  const startRecording = useCallback(() => {
    if (localStream) {
      recordedChunks.current = [];
      mediaRecorder.current = new MediaRecorder(localStream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Voice recording is now active"
      });
    }
  }, [localStream, toast]);

  const stopRecording = useCallback((): Blob | null => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      
      const blob = new Blob(recordedChunks.current, { type: 'audio/webm' });
      
      toast({
        title: "Recording saved",
        description: "Voice recording has been saved"
      });
      
      return blob;
    }
    return null;
  }, [isRecording, toast]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isMuted,
    isRecording,
    localStream,
    remoteStream,
    connect,
    disconnect,
    toggleMute,
    startRecording,
    stopRecording
  };
};
