import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Search, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiKeys } from "@/config/apiKeys";

interface Voice {
  voice_id: string;
  name: string;
  preview_url?: string;
  category?: string;
  description?: string;
  labels?: Record<string, string>;
  settings?: {
    stability?: number;
    similarity_boost?: number;
  };
}

interface VoiceSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVoice: string;
  onVoiceSelect: (voiceId: string, voiceName: string) => void;
}

export const VoiceSelectionModal = ({
  open,
  onOpenChange,
  selectedVoice,
  onVoiceSelect
}: VoiceSelectionModalProps) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [customVoiceName, setCustomVoiceName] = useState('');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // ElevenLabs voice system settings
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.5);
  const [style, setStyle] = useState("default");

  useEffect(() => {
    if (open) {
      fetchVoices();
    }
    
    // Cleanup function to stop audio when modal closes
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        setAudioElement(null);
      }
      setPlayingVoice(null);
    };
  }, [open]);

  // Separate useEffect for cleanup when modal closes
  useEffect(() => {
    if (!open) {
      // Stop audio when modal closes
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        setAudioElement(null);
      }
      setPlayingVoice(null);
    }
  }, [open, audioElement]);

  const fetchVoices = async () => {
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('elevenlabs_api_key') || apiKeys.elevenLabs;
      
      if (!apiKey?.trim()) {
        toast({
          title: "API Key Required",
          description: "Please configure your ElevenLabs API key in Settings.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const data = await response.json();
      setVoices(data.voices || []);
    } catch (error) {
      console.error('Error fetching voices:', error);
      toast({
        title: "Error",
        description: "Failed to load voices from ElevenLabs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPreview = async (voice: Voice) => {
    if (playingVoice === voice.voice_id) {
      // Stop current audio
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setPlayingVoice(null);
      return;
    }

    try {
      // Stop any currently playing audio
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }

      const apiKey = localStorage.getItem('elevenlabs_api_key') || apiKeys.elevenLabs;
      
      setPlayingVoice(voice.voice_id);

      // Generate a sample text-to-speech
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.voice_id}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: "Hello! This is a preview of my voice. How do I sound?",
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: voice.settings?.stability || 0.5,
            similarity_boost: voice.settings?.similarity_boost || 0.5,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setAudioElement(audio);

      audio.onended = () => {
        setPlayingVoice(null);
        URL.revokeObjectURL(audioUrl);
        setAudioElement(null);
      };

      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setPlayingVoice(null);
        URL.revokeObjectURL(audioUrl);
        setAudioElement(null);
        toast({
          title: "Playback Error",
          description: "Failed to play voice preview. Please try again.",
          variant: "destructive",
        });
      };

      // Add load event handler
      audio.onloadeddata = () => {
        console.log('Audio loaded successfully');
      };

      audio.oncanplay = () => {
        console.log('Audio can start playing');
      };

      try {
        await audio.play();
        console.log('Audio playback started');
      } catch (playError) {
        console.error('Audio play error:', playError);
        setPlayingVoice(null);
        URL.revokeObjectURL(audioUrl);
        setAudioElement(null);
        toast({
          title: "Playback Error",
          description: "Unable to play audio. Please check your browser settings and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error playing preview:', error);
      setPlayingVoice(null);
      toast({
        title: "Error",
        description: "Failed to generate voice preview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredVoices = voices.filter(voice =>
    voice.name.toLowerCase().includes(search.toLowerCase()) ||
    voice.category?.toLowerCase().includes(search.toLowerCase()) ||
    voice.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleVoiceSelect = (voice: Voice) => {
    // Pass only the voice name as required
    onVoiceSelect(voice.voice_id, voice.name);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Select Voice
          </DialogTitle>
        </DialogHeader>

        {/* Custom ElevenLabs Voice ID */}
        <div className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Custom ElevenLabs Voice ID</label>
              <Input
                placeholder="Enter custom voice_id (e.g. JBFqnCBsd6RMkjVDRZzb)"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Custom Voice Name (optional)</label>
              <Input
                placeholder="Enter custom voice name"
                value={customVoiceName}
                onChange={e => setCustomVoiceName(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (search.trim()) {
                  onVoiceSelect(search.trim(), customVoiceName.trim() || search.trim());
                  onOpenChange(false);
                }
              }}
              className="ml-2"
            >
              Use Custom Voice
            </Button>
          </div>
        </div>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search voices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading voices...</div>
            </div>
          )}

          {/* Voices Grid */}
          {!loading && (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
                {filteredVoices.map((voice) => (
                  <div
                    key={voice.voice_id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedVoice === voice.voice_id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleVoiceSelect(voice)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{voice.name}</h3>
                        {voice.category && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {voice.category}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPreview(voice);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        {playingVoice === voice.voice_id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {voice.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {voice.description}
                      </p>
                    )}

                    {voice.labels && Object.keys(voice.labels).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(voice.labels).slice(0, 3).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {selectedVoice === voice.voice_id && (
                      <div className="mt-3 text-sm font-medium text-blue-600">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!loading && filteredVoices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {search ? 'No voices found matching your search.' : 'No voices available.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ElevenLabs Voice System Settings */}
        <div className="mt-6 p-4 border border-slate-200 rounded-lg bg-slate-50">
          <h4 className="text-xs font-bold mb-2">ElevenLabs Voice System</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Stability</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={stability}
                onChange={e => setStability(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-500 text-center">{stability}</div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Similarity Boost</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={similarityBoost}
                onChange={e => setSimilarityBoost(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-500 text-center">{similarityBoost}</div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Style</label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
                className="w-full text-xs border rounded"
              >
                <option value="default">Default</option>
                <option value="narration">Narration</option>
                <option value="conversational">Conversational</option>
                <option value="news">News</option>
                <option value="customer-support">Customer Support</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};