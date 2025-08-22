import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Volume2,
  MessageCircle,
  Mic,
  Play,
  Square,
  Send,
  Bot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TestingPanelProps {
  agentData: any;
  agentId: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type ConnectionStatus = "disconnected" | "connecting" | "connected";


export const TestingPanel = ({ agentData, agentId }: TestingPanelProps) => {
  const [isVoiceTesting, setIsVoiceTesting] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [userPrompt, setUserPrompt] = useState(
    "You are a customer who wants to return a package..."
  );
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");

  // Device selection state
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedInputDeviceId, setSelectedInputDeviceId] = useState<string>("");
  const [selectedOutputDeviceId, setSelectedOutputDeviceId] = useState<string>("");

  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioQueue = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Enumerate devices on mount and initialize waveform
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setInputDevices(devices.filter(d => d.kind === "audioinput"));
        setOutputDevices(devices.filter(d => d.kind === "audiooutput"));
        // Set default selected devices
        if (!selectedInputDeviceId && devices.find(d => d.kind === "audioinput")) {
          setSelectedInputDeviceId(devices.find(d => d.kind === "audioinput")!.deviceId);
        }
        if (!selectedOutputDeviceId && devices.find(d => d.kind === "audiooutput")) {
          setSelectedOutputDeviceId(devices.find(d => d.kind === "audiooutput")!.deviceId);
        }
      } catch (err) {
        console.error("Error enumerating devices", err);
      }
    };
    getDevices();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleVoiceTest = async () => {
    if (isVoiceTesting) {
      stopVoiceTest();
    } else {
      await startVoiceTest();
    }
  };

  // ✅ Final startVoiceTest implementation
  const startVoiceTest = async () => {
    try {
      setIsVoiceTesting(true);
      setConnectionStatus("connecting");

      const audioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = audioContext;
      await audioContext.resume();

      // Use selected input device
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedInputDeviceId ? { exact: selectedInputDeviceId } : undefined,
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      // Connect stream to waveform for visualization
      if (audioContextRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        
        // Create a simple waveform visualization
        const updateWaveform = () => {
          if (!isVoiceTesting || !canvasRef.current) return;
          
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);
          
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw frequency bars
          const barWidth = canvas.width / dataArray.length * 2;
          let x = 0;
          
          for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            
            // Use CSS custom property for primary color
            ctx.fillStyle = '#3b82f6'; // fallback color
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
          }
          
          animationFrameRef.current = requestAnimationFrame(updateWaveform);
        };
        updateWaveform();
      }

      const ws = new WebSocket(`wss://voiceai.kingcaller.ai/chat/v1/${agentId}`);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        console.log("✅ Connected to voice WebSocket");
        console.log(`[🧠 Agent: ${agentId}] Voice WebSocket connected`);
        setConnectionStatus("connected");
        socketRef.current = ws;
        setupAudioProcessing(stream, ws);
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "audio" && data.data) {
            const audioBuffer = Uint8Array.from(atob(data.data), c =>
              c.charCodeAt(0)
            );
            await playAudioBuffer(audioBuffer.buffer);
          }

          if (data.type === "clear") {
            console.log("🧹 Clear signal received");
            audioQueue.current = [];
          }
        } catch (err) {
          console.error("Error handling WebSocket message:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
      };

      ws.onclose = () => {
        console.log("🔌 WebSocket closed");
        setConnectionStatus("disconnected");
      };
    } catch (error) {
      console.error("❌ Failed to start voice test:", error);
      setIsVoiceTesting(false);
      setConnectionStatus("disconnected");
    }
  };

  const setupAudioProcessing = (stream: MediaStream, socket: WebSocket) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (event) => {
      const inputBuffer = event.inputBuffer.getChannelData(0);
      const int16Buffer = new Int16Array(inputBuffer.length);

      for (let i = 0; i < inputBuffer.length; i++) {
        int16Buffer[i] = Math.max(
          -32768,
          Math.min(32767, inputBuffer[i] * 32768)
        );
      }

      if (socket.readyState === WebSocket.OPEN) {
        const base64Audio = btoa(
          String.fromCharCode(...new Uint8Array(int16Buffer.buffer))
        );
        socket.send(JSON.stringify({ type: "audio", data: base64Audio }));
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1.0;
    gainNode.connect(audioContext.destination);
    gainNodeRef.current = gainNode;
  };

  const playAudioBuffer = async (audioData: ArrayBuffer) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const pcm = new Int16Array(audioData);
    const float32 = new Float32Array(pcm.length);

    for (let i = 0; i < pcm.length; i++) {
      float32[i] = pcm[i] / 32768;
    }

    const buffer = audioContext.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);

    audioQueue.current.push(buffer);

    if (!isPlayingRef.current) {
      playNextInQueue();
    }
  };

  const playNextInQueue = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext || audioQueue.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const buffer = audioQueue.current.shift();
    if (!buffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    // Output device selection (if supported)
    if (gainNodeRef.current) {
      source.connect(gainNodeRef.current);
    } else {
      source.connect(audioContext.destination);
    }

    // Try to set output device if supported
    if (selectedOutputDeviceId && typeof (source as any).setSinkId === "function") {
      (source as any).setSinkId(selectedOutputDeviceId).catch((err: any) => {
        console.warn("Could not set output device:", err);
      });
    }

    source.onended = () => {
      playNextInQueue();
    };

    source.start(0);
  };

  const stopVoiceTest = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop waveform animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsVoiceTesting(false);
    setConnectionStatus("disconnected");
  };

  useEffect(() => {
    return () => {
      stopVoiceTest();
    };
    // eslint-disable-next-line
  }, []);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Hello! I'm your AI assistant. Based on your prompt, I'm configured to assist users in a friendly and professional manner. How can I help you today?",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSimulateConversation = () => {
    // Clear existing messages
    setChatMessages([]);

    // Simulate conversation based on user prompt
    setTimeout(() => {
      const simulatedUserMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: "How are you doing?",
        timestamp: new Date(),
      };
      setChatMessages([simulatedUserMessage]);

      setTimeout(() => {
        const simulatedAssistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I am doing well",
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, simulatedAssistantMessage]);
      }, 1000);
    }, 500);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      default:
        return "Disconnected";
    }
  };

  return (
    <div className="h-full p-6 space-y-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Assistant Testing & Simulation
      </h2>


      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Text LLM
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          {/* Manual Chat Section */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 text-center">
              <CardTitle className="text-base font-medium">
                Manual Chat
              </CardTitle>
              <p className="text-sm text-slate-600 mb-4">
                <span className="font-medium">Agent ID:</span> {agentId}
              </p>

              <p className="text-sm text-slate-500">
                Manually chat with the assistant
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Chat Messages */}
              <div className="h-48 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                {chatMessages.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-8">
                    Start a conversation with your assistant
                  </p>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-2 rounded-lg text-sm ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-slate-200"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Simulated Chat Section */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 text-center">
              <CardTitle className="text-base font-medium">
                AI Simulated Chat
              </CardTitle>
              <p className="text-sm text-slate-500">
                Use prompt to simulate user responses
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    User Prompt
                  </label>
                  <Textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="You are a customer who wants to return a package..."
                    className="min-h-[80px] text-sm"
                  />
                </div>

                <Button
                  onClick={handleSimulateConversation}
                  className="w-full"
                  variant="outline"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Simulate Conversation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <Card className="shadow-sm border-slate-200 h-96">
            <CardContent className="h-full flex flex-col items-center justify-center space-y-6">
              {/* Connection Status */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}
                ></div>
                <span className="text-sm text-slate-600">
                  {getConnectionStatusText()}
                </span>
              </div>

              {/* Large Microphone Icon */}
              <div
                className={`flex items-center justify-center w-20 h-20 rounded-full ${
                  isVoiceTesting ? "bg-red-100 animate-pulse" : "bg-slate-100"
                }`}
              >
                <Mic
                  className={`w-10 h-10 ${
                    isVoiceTesting ? "text-red-500" : "text-slate-400"
                  }`}
                />
              </div>

              {/* Test your assistant text */}
              <p className="text-lg font-medium text-slate-700">
                Test your voice assistant
              </p>

              {/* Input Audio Waveform */}
              {isVoiceTesting && (
                <div className="w-full max-w-md">
                  <p className="text-sm font-medium text-slate-700 mb-2 text-center">
                    Input Audio Level
                  </p>
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={60}
                    className="w-full h-15 border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>
              )}

              {/* Test Button */}
              <Button
                onClick={handleVoiceTest}
                size="lg"
                className="px-8"
                variant={isVoiceTesting ? "destructive" : "default"}
              >
                {isVoiceTesting ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Test
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Test
                  </>
                )}
              </Button>

              {/* Device Selection - Below Start Test Button */}
              <div className="w-full space-y-3">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Device Settings</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Input Device</label>
                    <select
                      className="w-full border rounded px-2 py-1 text-sm bg-white"
                      value={selectedInputDeviceId}
                      onChange={e => setSelectedInputDeviceId(e.target.value)}
                    >
                      {inputDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Microphone (${device.deviceId})`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Output Device</label>
                    <select
                      className="w-full border rounded px-2 py-1 text-sm bg-white"
                      value={selectedOutputDeviceId}
                      onChange={e => setSelectedOutputDeviceId(e.target.value)}
                    >
                      {outputDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Speaker (${device.deviceId})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Status indicator when testing */}
              {isVoiceTesting && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-sm text-blue-700">
                      Voice test in progress...
                    </p>
                  </div>
                  <p className="text-xs text-blue-600">
                    Speak into your microphone to interact with the assistant
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};