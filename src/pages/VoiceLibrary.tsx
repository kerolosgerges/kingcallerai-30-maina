import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Play, Pause, Search, Copy, Settings, AlertCircle, Star, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiKeys } from '@/config/apiKeys';

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  labels: Record<string, string>;
  preview_url?: string;
  available_for_tiers?: string[];
  samples?: Array<{
    sample_id: string;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    hash: string;
    duration_secs: number;
  }>;
  fine_tuning?: {
    is_allowed_to_fine_tune: boolean;
    verification_attempts_count: number;
    state?: Record<string, string>;
    verification_failures?: string[];
    manual_verification_requested?: boolean;
    language?: string;
  };
  settings?: {
    stability?: number;
    use_speaker_boost?: boolean;
    similarity_boost?: number;
    style?: number;
    speed?: number;
  };
  sharing?: {
    status: string;
    liked_by_count?: number;
    cloned_by_count?: number;
  };
  high_quality_base_model_ids?: string[];
  verified_languages?: Array<{
    language: string;
    model_id: string;
    accent: string;
    locale: string;
    preview_url: string;
  }>;
  safety_control?: string;
  voice_verification?: {
    requires_verification: boolean;
    is_verified: boolean;
    verification_failures?: string[];
    verification_attempts_count: number;
    language?: string;
  };
  permission_on_resource?: string;
  is_owner?: boolean;
  is_legacy?: boolean;
  is_mixed?: boolean;
  created_at_unix?: number;
}

interface VoicesResponse {
  voices: Voice[];
  has_more: boolean;
  total_count: number;
  next_page_token?: string;
}

const VoiceLibrary = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  // Helper function to determine if a voice is a default ElevenLabs voice
  const isDefaultVoice = (voice: Voice) => {
    return voice.category === 'premade' && !voice.is_owner;
  };

  // Load voices on mount using system default API key
  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async (key?: string, loadMore: boolean = false) => {
    // Try user's custom key first, then system default, then localStorage
    const apiKey = key || localStorage.getItem('elevenlabs_api_key') || apiKeys.elevenLabs;
    
    if (!apiKey?.trim()) {
      toast({
        title: "API Key Required",
        description: "Please configure your ElevenLabs API key in Settings > Integrations",
        variant: "destructive"
      });
      return;
    }

    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setVoices([]);
      setNextPageToken(null);
      setHasMore(true);
    }

    try {
      const url = new URL('https://api.elevenlabs.io/v2/voices');
      url.searchParams.append('page_size', '20');
      
      if (loadMore && nextPageToken) {
        url.searchParams.append('page_token', nextPageToken);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'xi-api-key': apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: VoicesResponse = await response.json();
      
      if (data.voices && data.voices.length > 0) {
        if (loadMore) {
          setVoices(prev => [...prev, ...data.voices]);
        } else {
          setVoices(data.voices);
        }
      }

      setHasMore(data.has_more);
      setNextPageToken(data.next_page_token || null);
      
      toast({
        title: "Success",
        description: `Loaded ${data.voices?.length || 0} voices from ElevenLabs`
      });
    } catch (error: any) {
      console.error('Failed to fetch voices:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch voices. Please check your API key in Settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreVoices = () => {
    if (!loadingMore && hasMore) {
      fetchVoices(undefined, true);
    }
  };

  const copyVoiceId = (voiceId: string) => {
    navigator.clipboard.writeText(voiceId);
    toast({
      title: "Copied",
      description: "Voice ID copied to clipboard"
    });
  };

  const playPreview = async (voice: Voice) => {
    if (playingVoice === voice.voice_id) {
      setPlayingVoice(null);
      return;
    }

    if (!voice.preview_url) {
      toast({
        title: "No Preview",
        description: "This voice doesn't have a preview available",
        variant: "destructive"
      });
      return;
    }

    try {
      setPlayingVoice(voice.voice_id);
      const audio = new Audio(voice.preview_url);
      
      audio.onended = () => setPlayingVoice(null);
      audio.onerror = () => {
        setPlayingVoice(null);
        toast({
          title: "Playback Error",
          description: "Failed to play voice preview",
          variant: "destructive"
        });
      };
      
      await audio.play();
    } catch (error) {
      setPlayingVoice(null);
      toast({
        title: "Playback Error",
        description: "Failed to play voice preview",
        variant: "destructive"
      });
    }
  };

  const filteredVoices = voices.filter(voice =>
    voice.name.toLowerCase().includes(search.toLowerCase()) ||
    voice.category.toLowerCase().includes(search.toLowerCase()) ||
    voice.description?.toLowerCase().includes(search.toLowerCase())
  );

  const defaultVoices = filteredVoices.filter(voice => isDefaultVoice(voice));
  const customVoices = filteredVoices.filter(voice => !isDefaultVoice(voice));

  const renderVoiceCard = (voice: Voice) => (
    <Card key={voice.voice_id} className="hover:shadow-md transition-shadow relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg truncate">{voice.name}</CardTitle>
              {isDefaultVoice(voice) && (
                <div title="Default ElevenLabs Voice">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </div>
              )}
              {!isDefaultVoice(voice) && (
                <div title="Custom Voice">
                  <User className="h-4 w-4 text-blue-500" />
                </div>
              )}
            </div>
            <Badge variant={isDefaultVoice(voice) ? "default" : "secondary"} className="mt-1">
              {isDefaultVoice(voice) ? "Default" : "Custom"} - {voice.category}
            </Badge>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyVoiceId(voice.voice_id)}
              className="h-8 w-8 p-0"
              title="Copy Voice ID"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => playPreview(voice)}
              disabled={!voice.preview_url}
              className="h-8 w-8 p-0"
              title={voice.preview_url ? "Play preview" : "No preview available"}
            >
              {playingVoice === voice.voice_id ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {voice.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {voice.description}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Voice ID:</span>
            <code className="bg-muted px-1 py-0.5 rounded text-xs truncate max-w-24">
              {voice.voice_id}
            </code>
          </div>
          
          {voice.labels && Object.keys(voice.labels).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(voice.labels).slice(0, 3).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
              {Object.keys(voice.labels).length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{Object.keys(voice.labels).length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {voice.available_for_tiers && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Tiers:</span> {voice.available_for_tiers.join(', ')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice Library ({voices.length} voices)
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/settings/integrations'}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => fetchVoices()} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search voices by name, category, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Voices Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            All Voices ({filteredVoices.length})
          </TabsTrigger>
          <TabsTrigger value="default" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Default ({defaultVoices.length})
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Custom ({customVoices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVoices.map(renderVoiceCard)}
          </div>
          {hasMore && (
            <div className="text-center pt-6">
              <Button 
                onClick={loadMoreVoices} 
                disabled={loadingMore}
                variant="outline"
              >
                {loadingMore ? "Loading..." : "Load More Voices"}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="default" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultVoices.map(renderVoiceCard)}
          </div>
          {defaultVoices.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Star className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No default voices found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or refresh to load default voices
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customVoices.map(renderVoiceCard)}
          </div>
          {customVoices.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No custom voices found</h3>
                <p className="text-muted-foreground">
                  Custom voices are voices you've created or cloned in ElevenLabs
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {filteredVoices.length === 0 && voices.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No voices found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </CardContent>
        </Card>
      )}
      
      {voices.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Mic className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No voices loaded</h3>
            <p className="text-muted-foreground mb-4">
              Click refresh to load voices from ElevenLabs
            </p>
            <Button onClick={() => fetchVoices()}>
              Load Voices
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceLibrary;