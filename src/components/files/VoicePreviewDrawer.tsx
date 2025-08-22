
import * as React from 'react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, SkipBack, SkipForward, Download } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

export type VoicePreviewDrawerProps = {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  language?: string;
  sampleRate?: number;
  bitrateKbps?: number;
};

const isAudio = (mime?: string, name?: string) =>
  !!(mime?.startsWith('audio/') || /\.mp3$/i.test(name || ''));
const isImage = (mime?: string) => !!mime && mime.startsWith('image/');
const isVideo = (mime?: string) => !!mime && mime.startsWith('video/');
const isPdf = (mime?: string, name?: string) =>
  !!(mime === 'application/pdf' || /\.pdf$/i.test(name || ''));
const estimateBitrate = (sizeBytes?: number, durationSec?: number | null) =>
  !sizeBytes || !durationSec || durationSec <= 0 ? null : Math.round((sizeBytes * 8) / durationSec / 1000);

export function VoicePreviewDrawer({
  open,
  onClose,
  fileUrl,
  fileName = 'File',
  mimeType,
  sizeBytes,
  language,
  sampleRate,
  bitrateKbps,
}: VoicePreviewDrawerProps) {
  // Refs
  const waveformRef = React.useRef<HTMLDivElement | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const wsRef = React.useRef<WaveSurfer | null>(null);

  // State
  const [ready, setReady] = React.useState(false);       // becomes true from AUDIO events
  const [playing, setPlaying] = React.useState(false);
  const [rate, setRate] = React.useState(1);
  const [duration, setDuration] = React.useState<number | null>(null);

  // Download
  const downloadFile = React.useCallback(() => {
    console.log('[VoicePreviewDrawer] Download click', { fileUrl, fileName });
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
  }, [fileUrl, fileName]);

  // Init audio element (source of truth) and attach listeners
  React.useEffect(() => {
    console.log('[VoicePreviewDrawer] effect:init', { open, isAudio: isAudio(mimeType, fileName), fileUrl });
    if (!open || !isAudio(mimeType, fileName) || !fileUrl) return;

    const audio = new Audio();
    audio.src = fileUrl;
    // NOTE: Some Firebase responses don't include CORS headers that allow anonymous pulls.
    // If you see playback blocked, try commenting the next line.
    // audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audioRef.current = audio;

    const onLoadedMeta = () => {
      console.log('[VoicePreviewDrawer] audio loadedmetadata', { duration: audio.duration });
      setDuration(isFinite(audio.duration) ? audio.duration : null);
      setReady(true);               // <-- enable Play button as soon as the audio is ready
      try { audio.playbackRate = rate; } catch {}
    };
    const onCanPlay = () => console.log('[VoicePreviewDrawer] audio canplay');
    const onCanPlayThrough = () => console.log('[VoicePreviewDrawer] audio canplaythrough');
    const onPlay = () => { console.log('[VoicePreviewDrawer] audio play'); setPlaying(true); };
    const onPause = () => { console.log('[VoicePreviewDrawer] audio pause'); setPlaying(false); };
    const onEnded = () => { console.log('[VoicePreviewDrawer] audio ended'); setPlaying(false); };
    const onStalled = () => console.warn('[VoicePreviewDrawer] audio stalled');
    const onError = () => console.error('[VoicePreviewDrawer] audio error', audio.error);

    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('canplaythrough', onCanPlayThrough);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('stalled', onStalled);
    audio.addEventListener('error', onError);

    return () => {
      console.log('[VoicePreviewDrawer] cleanup:audio');
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('canplaythrough', onCanPlayThrough);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('stalled', onStalled);
      audio.removeEventListener('error', onError);
      audioRef.current = null;
      setPlaying(false);
      setReady(false);
      setDuration(null);
    };
  }, [open, fileUrl, mimeType, fileName, rate]);

  // Optional: WaveSurfer visualization bound to the *same* <audio> element.
  React.useEffect(() => {
    if (!open || !isAudio(mimeType, fileName) || !fileUrl) return;
    const container = waveformRef.current;
    if (!container) return;
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;
    (async () => {
      try {
        console.log('[VoicePreviewDrawer] creating WaveSurfer instance');
        const ws = WaveSurfer.create({
          container,
          media: audio, // visualize existing element; no fetch
          height: 96,
          waveColor: '#4F4A85',
          progressColor: '#383351',
          cursorColor: 'rgba(0,0,0,0.7)',
          barWidth: 2,
          barGap: 1,
        });
        if (cancelled) return;
        
        wsRef.current = ws;

        ws.on('ready', () => {
          console.log('[VoicePreviewDrawer] wavesurfer ready (visual only)');
          // Do not gate Play button on WS, audio already handles readiness.
        });
        ws.on('error', (e: unknown) => console.error('[VoicePreviewDrawer] wavesurfer error', e));
      } catch (e) {
        console.error('[VoicePreviewDrawer] wavesurfer import/init failed — continuing without waveform', e);
      }
    })();

    return () => {
      cancelled = true;
      try { wsRef.current?.destroy?.(); } catch {}
      wsRef.current = null;
      console.log('[VoicePreviewDrawer] cleanup:wavesurfer');
    };
  }, [open, fileUrl, mimeType, fileName]);

  // Keep rate synced
  React.useEffect(() => {
    if (!isAudio(mimeType, fileName)) return;
    const audio = audioRef.current;
    if (audio) {
      try { audio.playbackRate = rate; } catch {}
      console.log('[VoicePreviewDrawer] set playbackRate', rate);
    }
    try { wsRef.current?.setPlaybackRate?.(rate); } catch {}
  }, [rate, mimeType, fileName]);

  // Controls use the audio element directly (WS just mirrors it)
  const playPause = React.useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !ready) {
      console.warn('[VoicePreviewDrawer] play/pause: not ready', { hasAudio: !!audio, ready });
      return;
    }
    try {
      if (audio.paused) {
        console.log('[VoicePreviewDrawer] playing…');
        await audio.play();
      } else {
        console.log('[VoicePreviewDrawer] pausing…');
        audio.pause();
      }
    } catch (e) {
      console.error('[VoicePreviewDrawer] play/pause error', e);
    }
  }, [ready]);

  const skip = React.useCallback((sec: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const d = isFinite(audio.duration) ? audio.duration : 0;
    const t = Math.max(0, Math.min(d, (audio.currentTime || 0) + sec));
    audio.currentTime = t;
    console.log('[VoicePreviewDrawer] skip', { sec, to: t });
  }, []);

  const resolvedBitrate = isAudio(mimeType, fileName)
    ? (bitrateKbps ?? estimateBitrate(sizeBytes, duration ?? undefined))
    : null;

  const renderViewer = () => {
    if (!isAudio(mimeType, fileName)) {
      return (
        <>
          <div className="mt-4 text-sm text-muted-foreground">Preview not available for this file type.</div>
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={downloadFile}>
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="mt-4">
          <div ref={waveformRef} className="rounded-md border" />
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Button size="sm" onClick={playPause} disabled={!ready}>
              {playing ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {playing ? 'Pause' : 'Play'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => skip(-10)} disabled={!ready}>
              <SkipBack className="h-4 w-4 mr-1" /> -10s
            </Button>
            <Button variant="outline" size="sm" onClick={() => skip(10)} disabled={!ready}>
              +10s <SkipForward className="h-4 w-4 ml-1" />
            </Button>

            <Select value={String(rate)} onValueChange={(v) => setRate(Number(v))}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Speed" />
              </SelectTrigger>
              <SelectContent>
                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((r) => (
                  <SelectItem key={r} value={String(r)}>{r}×</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={downloadFile}>
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </div>
        </div>

        <Separator className="my-4" />
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="secondary">Duration: {duration ? `${duration.toFixed(2)}s` : '—'}</Badge>
          <Badge variant="secondary">Bitrate: {resolvedBitrate ? `${resolvedBitrate} kbps` : '—'}</Badge>
          <Badge variant="secondary">Sample rate: {sampleRate ? `${sampleRate} Hz` : '—'}</Badge>
          {language && <Badge variant="outline">Language: {language}</Badge>}
        </div>

        <Separator className="my-4" />
        <Textarea placeholder="Session notes…" className="min-h-[80px]" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline">{mimeType || 'audio/mpeg'}</Badge>
        </div>
      </>
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        console.log('[VoicePreviewDrawer] onOpenChange', o);
        if (!o) {
          try { wsRef.current?.destroy?.(); } catch {}
          try { audioRef.current?.pause?.(); } catch {}
          wsRef.current = null;
          audioRef.current = null;
          onClose();
        }
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="truncate">{fileName}</SheetTitle>
          <SheetDescription>
            {isAudio(mimeType, fileName) ? 'Audio preview' : 'Preview'}
          </SheetDescription>
        </SheetHeader>

        {renderViewer()}
      </SheetContent>
    </Sheet>
  );
}
