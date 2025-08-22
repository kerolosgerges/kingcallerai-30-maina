// hooks/useAudioStreaming.ts
import { useRef, useState, useEffect } from "react";

export const useAudioStreaming = (wsUrl: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!wsUrl) return;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket closed");
    ws.onerror = (e) => console.error("WebSocket error", e);

    ws.onmessage = async (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "audio" && data) {
        const buffer = await base64ToAudioBuffer(data);
        const source = audioCtxRef.current!.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtxRef.current!.destination);
        source.start();
      }
    };

    return () => ws.close();
  }, [wsUrl]);

  const startStreaming = async () => {
    audioCtxRef.current = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioCtxRef.current.createMediaStreamSource(stream);

    const processor = audioCtxRef.current.createScriptProcessor(4096, 1, 1);
    source.connect(processor);
    processor.connect(audioCtxRef.current.destination);

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const pcmData = new Int16Array(input.length);
      for (let i = 0; i < input.length; i++) {
        pcmData[i] = input[i] * 32767;
      }
      const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
      wsRef.current?.send(JSON.stringify({ type: "audio", data: base64Data }));
    };

    setIsStreaming(true);
  };

  const stopStreaming = () => {
    audioCtxRef.current?.close();
    setIsStreaming(false);
  };

  return { startStreaming, stopStreaming, isStreaming };
};

async function base64ToAudioBuffer(base64: string): Promise<AudioBuffer> {
  const audioCtx = new AudioContext();
  const audioData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return await audioCtx.decodeAudioData(audioData.buffer);
}
