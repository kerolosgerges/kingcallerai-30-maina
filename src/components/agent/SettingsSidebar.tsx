import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Settings,
  Mic,
  Phone,
  BarChart3,
  Wrench,
  Plus,
  Volume2,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useKingCallerAgentBuilder } from "@/hooks/useKingCallerAgentBuilder";

interface SettingsSection {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  content: React.ReactNode;
}

interface SettingsSidebarProps {
  speechSettings?: any;
  onSpeechSettingsChange?: (settings: any) => void;
  silenceTimeout?: number;
  onSilenceTimeoutChange?: (timeout: number) => void;
  callTimeout?: number;
  onCallTimeoutChange?: (timeout: number) => void;
  callRecording?: boolean;
  onCallRecordingChange?: (val: boolean) => void;
  voicemailDetection?: boolean;
  onVoicemailDetectionChange?: (val: boolean) => void;
  transcriptionLanguage?: string;
  onTranscriptionLanguageChange?: (lang: string) => void;
  inputProvider?: string;
  onInputProviderChange?: (provider: string) => void;
  outputProvider?: string;
  onOutputProviderChange?: (provider: string) => void;
  transcriberProvider?: string;
  onTranscriberProviderChange?: (provider: string) => void;
  outputFormat?: string;
  onOutputFormatChange?: (format: string) => void;
  webhookUrl?: string;
  onWebhookUrlChange?: (url: string) => void;
  postCallAnalysisType?: string;
  onPostCallAnalysisTypeChange?: (type: string) => void;
  postCallReportFormat?: string;
  onPostCallReportFormatChange?: (format: string) => void;
  fallbackAction?: string;
  onFallbackActionChange?: (action: string) => void;

  // New advanced agent settings
  optimizeLatency?: boolean;
  onOptimizeLatencyChange?: (val: boolean) => void;
  incrementalDelay?: number;
  onIncrementalDelayChange?: (val: number) => void;
  numberOfWordsForInterruption?: number;
  onNumberOfWordsForInterruptionChange?: (val: number) => void;
  interruptionBackoffPeriod?: number;
  onInterruptionBackoffPeriodChange?: (val: number) => void;
  hangupAfterLLMCall?: boolean;
  onHangupAfterLLMCallChange?: (val: boolean) => void;
  callCancellationPrompt?: string;
  onCallCancellationPromptChange?: (val: string) => void;
  backchanneling?: boolean;
  onBackchannelingChange?: (val: boolean) => void;
  backchannelingMessageGap?: number;
  onBackchannelingMessageGapChange?: (val: number) => void;
  backchannelingStartDelay?: number;
  onBackchannelingStartDelayChange?: (val: number) => void;
  ambientNoise?: boolean;
  onAmbientNoiseChange?: (val: boolean) => void;
  ambientNoiseTrack?: string;
  onAmbientNoiseTrackChange?: (val: string) => void;
  callTerminate?: number;
  onCallTerminateChange?: (val: number) => void;
  useFillers?: boolean;
  onUseFillersChange?: (val: boolean) => void;
  triggerUserOnlineMessageAfter?: number;
  onTriggerUserOnlineMessageAfterChange?: (val: number) => void;
  checkUserOnlineMessage?: string;
  onCheckUserOnlineMessageChange?: (val: string) => void;
  checkIfUserOnline?: boolean;
  onCheckIfUserOnlineChange?: (val: boolean) => void;
  generatePreciseTranscript?: boolean;
  onGeneratePreciseTranscriptChange?: (val: boolean) => void;
}

export const SettingsSidebar = ({
  speechSettings,
  onSpeechSettingsChange,
  silenceTimeout: silenceTimeoutProp,
  onSilenceTimeoutChange,
  callTimeout: callTimeoutProp,
  onCallTimeoutChange,
  callRecording: callRecordingProp,
  onCallRecordingChange,
  voicemailDetection: voicemailDetectionProp,
  onVoicemailDetectionChange,
  transcriptionLanguage: transcriptionLanguageProp,
  onTranscriptionLanguageChange,
  inputProvider: inputProviderProp,
  onInputProviderChange,
  outputProvider: outputProviderProp,
  onOutputProviderChange,
  transcriberProvider: transcriberProviderProp,
  onTranscriberProviderChange,
  outputFormat: outputFormatProp,
  onOutputFormatChange,
  webhookUrl: webhookUrlProp,
  onWebhookUrlChange,
  postCallAnalysisType: postCallAnalysisTypeProp,
  onPostCallAnalysisTypeChange,
  postCallReportFormat: postCallReportFormatProp,
  onPostCallReportFormatChange,
  fallbackAction: fallbackActionProp,
  onFallbackActionChange,
  // Advanced agent settings
  optimizeLatency,
  onOptimizeLatencyChange,
  incrementalDelay,
  onIncrementalDelayChange,
  numberOfWordsForInterruption,
  onNumberOfWordsForInterruptionChange,
  interruptionBackoffPeriod,
  onInterruptionBackoffPeriodChange,
  hangupAfterLLMCall,
  onHangupAfterLLMCallChange,
  callCancellationPrompt,
  onCallCancellationPromptChange,
  backchanneling,
  onBackchannelingChange,
  backchannelingMessageGap,
  onBackchannelingMessageGapChange,
  backchannelingStartDelay,
  onBackchannelingStartDelayChange,
  ambientNoise,
  onAmbientNoiseChange,
  ambientNoiseTrack,
  onAmbientNoiseTrackChange,
  callTerminate,
  onCallTerminateChange,
  useFillers,
  onUseFillersChange,
  triggerUserOnlineMessageAfter,
  onTriggerUserOnlineMessageAfterChange,
  checkUserOnlineMessage,
  onCheckUserOnlineMessageChange,
  checkIfUserOnline,
  onCheckIfUserOnlineChange,
  generatePreciseTranscript,
  onGeneratePreciseTranscriptChange,
}: SettingsSidebarProps = {}) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [responsiveness, setResponsiveness] = useState([3]);
  const [sensitivity, setSensitivity] = useState([3]);
  const [reminderFrequency, setReminderFrequency] = useState([10]);
  const [reminderTimes, setReminderTimes] = useState([1]);

  // Use prop for callTimeout if provided, else local state
  const [localCallTimeout, setLocalCallTimeout] = useState([30]);
  const callTimeout = typeof callTimeoutProp === "number" ? [callTimeoutProp] : localCallTimeout;

  // Use prop for silenceTimeout if provided, else local state
  const [localSilenceTimeout, setLocalSilenceTimeout] = useState([5]);
  const silenceTimeout = typeof silenceTimeoutProp === "number" ? [silenceTimeoutProp] : localSilenceTimeout;

  // Call Recording
  const [localCallRecording, setLocalCallRecording] = useState(true);
  const callRecording = typeof callRecordingProp === "boolean" ? callRecordingProp : localCallRecording;

  // Voicemail Detection
  const [localVoicemailDetection, setLocalVoicemailDetection] = useState(false);
  const voicemailDetection = typeof voicemailDetectionProp === "boolean" ? voicemailDetectionProp : localVoicemailDetection;

  // Transcription Language
  const [localTranscriptionLanguage, setLocalTranscriptionLanguage] = useState("en");
  const transcriptionLanguage = transcriptionLanguageProp || localTranscriptionLanguage;

  // Providers
  const [localInputProvider, setLocalInputProvider] = useState("twilio");
  const inputProvider = inputProviderProp || localInputProvider;
  const [localOutputProvider, setLocalOutputProvider] = useState("twilio");
  const outputProvider = outputProviderProp || localOutputProvider;
  const [localTranscriberProvider, setLocalTranscriberProvider] = useState("deepgram");
  const transcriberProvider = transcriberProviderProp || localTranscriberProvider;

  // Output Format
  const [localOutputFormat, setLocalOutputFormat] = useState("wav");
  const outputFormat = outputFormatProp || localOutputFormat;

  // Webhook URL
  const [localWebhookUrl, setLocalWebhookUrl] = useState("");
  const webhookUrl = webhookUrlProp || localWebhookUrl;

  // Post-call analysis
  const [localPostCallAnalysisType, setLocalPostCallAnalysisType] = useState("comprehensive");
  const postCallAnalysisType = postCallAnalysisTypeProp || localPostCallAnalysisType;
  const [localPostCallReportFormat, setLocalPostCallReportFormat] = useState("json");
  const postCallReportFormat = postCallReportFormatProp || localPostCallReportFormat;

  // Fallback/Timeout Action
  const [localFallbackAction, setLocalFallbackAction] = useState("repeat_prompt");
  const fallbackAction = fallbackActionProp || localFallbackAction;

  const {
    speechSettings: builderSpeechSettings,
    setSpeechSettings,
    prompt,
    setPrompt
  } = useKingCallerAgentBuilder();

  // Use prop settings if provided, otherwise fall back to builder settings
  const currentSpeechSettings = speechSettings || builderSpeechSettings;
  const updateSpeechSettings = onSpeechSettingsChange || setSpeechSettings;

  const handleSpeechSettingsChange = (
    newSettings: Partial<typeof currentSpeechSettings>
  ) => {
    const updatedSettings = {
      ...currentSpeechSettings,
      ...newSettings,
    };
    console.log("Updating speech settings:", {
      old: currentSpeechSettings,
      new: updatedSettings,
    });
    updateSpeechSettings(updatedSettings);
  };

  const handleVoicePromptChange = (value: string) => {
    console.log("Updating voice prompt:", {
      old: prompt,
      new: value,
    });
    setPrompt(value);
  };

  // Pipeline section states
  const [activePipelineSection, setActivePipelineSection] = useState<string | null>(null);

  const pipelineComponents = [
    {
      id: 'transcriber',
      name: 'Transcriber',
      description: 'Speech-to-text conversion',
      icon: Mic,
      settings: ['transcription']
    },
    {
      id: 'llm_agent', 
      name: 'LLM Agent',
      description: 'AI reasoning and response',
      icon: Settings,
      settings: ['functions', 'post-call-analysis']
    },
    {
      id: 'synthesizer',
      name: 'Synthesizer', 
      description: 'Text-to-speech conversion',
      icon: Volume2,
      settings: ['speech', 'call']
    }
  ];

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const togglePipelineSection = (sectionId: string) => {
    setActivePipelineSection(prev => prev === sectionId ? null : sectionId);
  };

  const sections: SettingsSection[] = [
 
    {
      id: "speech",
      title: "Speech Settings",
      icon: Mic,
      description: "Voice and speech configuration",
      content: (
        <div className="space-y-4 w-full">
          <div className="space-y-3">
            {/* Use Fillers */}
            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-3">
                <Label className="text-xs font-medium">Use Fillers</Label>
              </div>
              <Switch
                checked={!!useFillers}
                onCheckedChange={onUseFillersChange}
              />
            </div>
            {/* Backchanneling */}
            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-3">
                <Label className="text-xs font-medium">Backchanneling</Label>
              </div>
              <Switch
                checked={!!backchanneling}
                onCheckedChange={onBackchannelingChange}
              />
            </div>
            {/* Backchanneling Message Gap */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Backchanneling Message Gap (s)</Label>
              <Input
                type="number"
                value={backchannelingMessageGap ?? ""}
                onChange={e => onBackchannelingMessageGapChange && onBackchannelingMessageGapChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            {/* Backchanneling Start Delay */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Backchanneling Start Delay (s)</Label>
              <Input
                type="number"
                value={backchannelingStartDelay ?? ""}
                onChange={e => onBackchannelingStartDelayChange && onBackchannelingStartDelayChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            {/* Ambient Noise */}
            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-3">
                <Label className="text-xs font-medium">Ambient Noise</Label>
              </div>
              <Switch
                checked={!!ambientNoise}
                onCheckedChange={onAmbientNoiseChange}
              />
            </div>
            {/* Ambient Noise Track */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Ambient Noise Track</Label>
              <Select value={ambientNoiseTrack ?? ""} onValueChange={onAmbientNoiseTrackChange}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select track" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call-center">Call Center</SelectItem>
                  <SelectItem value="coffee-shop">Coffee Shop</SelectItem>
                  <SelectItem value="office-ambience">Office Ambience</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium">Speech Rate</Label>
              <div className="px-2">
                <Slider
                  value={[currentSpeechSettings.speechRate]}
                  onValueChange={([value]) =>
                    handleSpeechSettingsChange({ speechRate: value })
                  }
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>slow</span>
                  <span>fast</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Speech Pitch</Label>
              <div className="px-2">
                <Slider
                  value={[currentSpeechSettings.speechPitch]}
                  onValueChange={([value]) =>
                    handleSpeechSettingsChange({ speechPitch: value })
                  }
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>low</span>
                  <span>high</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Speech Volume</Label>
              <div className="px-2">
                <Slider
                  value={[currentSpeechSettings.speechVolume]}
                  onValueChange={([value]) =>
                    handleSpeechSettingsChange({ speechVolume: value })
                  }
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>quiet</span>
                  <span>loud</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Voice Emotion</Label>
              <Select
                value={currentSpeechSettings.voiceEmotion}
                onValueChange={(value) =>
                  handleSpeechSettingsChange({ voiceEmotion: value })
                }
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="angry">Angry</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-3">
                <Label className="text-xs font-medium">Enable SSML</Label>
                <p className="text-xs text-slate-500">
                  Enable SSML tags for advanced speech control
                </p>
              </div>
              <Switch
                checked={currentSpeechSettings.enableSSML}
                onCheckedChange={(checked) =>
                  handleSpeechSettingsChange({ enableSSML: checked })
                }
              />
            </div>

            {currentSpeechSettings.enableSSML && (
              <div className="space-y-3 border-t pt-3">
                <Label className="text-xs font-medium">SSML Prosody</Label>
                <div className="space-y-2">
                  <Select
                    value={currentSpeechSettings.ssmlProsody.rate}
                    onValueChange={(value) =>
                      handleSpeechSettingsChange({
                        ssmlProsody: {
                          ...currentSpeechSettings.ssmlProsody,
                          rate: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue placeholder="Rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="x-slow">Extra Slow</SelectItem>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                      <SelectItem value="x-fast">Extra Fast</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={currentSpeechSettings.ssmlProsody.pitch}
                    onValueChange={(value) =>
                      handleSpeechSettingsChange({
                        ssmlProsody: {
                          ...currentSpeechSettings.ssmlProsody,
                          pitch: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue placeholder="Pitch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="x-low">Extra Low</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="x-high">Extra High</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={currentSpeechSettings.ssmlProsody.volume}
                    onValueChange={(value) =>
                      handleSpeechSettingsChange({
                        ssmlProsody: {
                          ...currentSpeechSettings.ssmlProsody,
                          volume: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue placeholder="Volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="silent">Silent</SelectItem>
                      <SelectItem value="x-soft">Extra Soft</SelectItem>
                      <SelectItem value="soft">Soft</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="loud">Loud</SelectItem>
                      <SelectItem value="x-loud">Extra Loud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs font-medium">Breathiness</Label>
              <div className="px-2">
                <Slider
                  value={[currentSpeechSettings.breathiness]}
                  onValueChange={([value]) =>
                    handleSpeechSettingsChange({ breathiness: value })
                  }
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>none</span>
                  <span>high</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Intonation Pattern</Label>
              <Select
                value={currentSpeechSettings.intonationPattern}
                onValueChange={(value) =>
                  handleSpeechSettingsChange({ intonationPattern: value })
                }
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="monotone">Monotone</SelectItem>
                  <SelectItem value="expressive">Expressive</SelectItem>
                  <SelectItem value="questioning">Questioning</SelectItem>
                  <SelectItem value="emphatic">Emphatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "functions",
      title: "Functions",
      icon: Wrench,
      description: "Add tool or API integrations",
      content: (
        <div className="space-y-4 w-full">
          <div className="space-y-3">
            <Label className="text-xs font-medium">Available Functions</Label>
            <p className="text-xs text-slate-500">
              Configure external actions, API calls, and database integrations.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md w-full">
                <div className="flex-1 pr-3">
                  <Label className="text-xs font-medium">Web Search</Label>
                  <p className="text-xs text-slate-500">
                    Allow assistant to search the web for information
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md w-full">
                <div className="flex-1 pr-3">
                  <Label className="text-xs font-medium">
                    Calendar Integration
                  </Label>
                  <p className="text-xs text-slate-500">
                    Connect to calendar for scheduling
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md w-full">
                <div className="flex-1 pr-3">
                  <Label className="text-xs font-medium">
                    Email Integration
                  </Label>
                  <p className="text-xs text-slate-500">
                    Send emails on behalf of user
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-md w-full">
                <div className="flex-1 pr-3">
                  <Label className="text-xs font-medium">Database Query</Label>
                  <p className="text-xs text-slate-500">
                    Query and update database records
                  </p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Custom API Endpoints
              </Label>
              <div className="space-y-2">
                <Input
                  placeholder="https://api.example.com/endpoint"
                  className="text-xs h-8 w-full"
                />
                <Input
                  placeholder="API Key"
                  type="password"
                  className="text-xs h-8 w-full"
                />
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="w-full flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Custom Function
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "transcription",
      title: "Transcription Settings",
      icon: Settings,
      description: "Speech-to-text configuration",
      content: (
        <div className="space-y-4 w-full">
          {/* Generate Precise Transcript */}
          <div className="flex items-center justify-between py-2">
            <div className="flex-1 pr-3">
              <Label className="text-xs font-medium">Generate Precise Transcript</Label>
            </div>
            <Switch
              checked={!!generatePreciseTranscript}
              onCheckedChange={onGeneratePreciseTranscriptChange}
            />
          </div>
          {/* Incremental Delay */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Incremental Delay (ms)</Label>
            <Input
              type="number"
              value={incrementalDelay ?? ""}
              onChange={e => onIncrementalDelayChange && onIncrementalDelayChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {/* Number of Words for Interruption */}
          <div className="space-y-2">
            <Label className="text-xs font-medium"># Words for Interruption</Label>
            <Input
              type="number"
              value={numberOfWordsForInterruption ?? ""}
              onChange={e => onNumberOfWordsForInterruptionChange && onNumberOfWordsForInterruptionChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {/* Interruption Backoff Period */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Interruption Backoff Period (ms)</Label>
            <Input
              type="number"
              value={interruptionBackoffPeriod ?? ""}
              onChange={e => onInterruptionBackoffPeriodChange && onInterruptionBackoffPeriodChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {/* Optimize Latency */}
          <div className="flex items-center justify-between py-2">
            <div className="flex-1 pr-3">
              <Label className="text-xs font-medium">Optimize Latency</Label>
            </div>
            <Switch
              checked={!!optimizeLatency}
              onCheckedChange={onOptimizeLatencyChange}
            />
          </div>
          {/* Provider Selection */}
          <div>
            <Label className="text-xs font-medium">Transcription Provider</Label>
            <Select value={transcriberProvider} onValueChange={val => {
              if (onTranscriberProviderChange) {
                onTranscriberProviderChange(val);
              } else {
                setLocalTranscriberProvider(val);
              }
            }}>
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="deepgram">Deepgram</SelectItem>
                <SelectItem value="assembly">AssemblyAI</SelectItem>
                <SelectItem value="whisper">OpenAI Whisper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-xs font-medium">
              Transcription Provider
            </Label>
            <RadioGroup defaultValue="deepgram" className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deepgram" id="deepgram" />
                <Label htmlFor="deepgram" className="text-xs">
                  Deepgram
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="assembly" id="assembly" />
                <Label htmlFor="assembly" className="text-xs">
                  AssemblyAI
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whisper" id="whisper" />
                <Label htmlFor="whisper" className="text-xs">
                  OpenAI Whisper
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex-1 pr-3">
              <Label className="text-xs font-medium">
                Real-time Transcription
              </Label>
              <p className="text-xs text-slate-500">
                Enable live transcription during calls
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex-1 pr-3">
              <Label className="text-xs font-medium">Punctuation</Label>
              <p className="text-xs text-slate-500">
                Add punctuation to transcripts
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Language Detection</Label>
            <Select value={transcriptionLanguage} onValueChange={val => {
              if (onTranscriptionLanguageChange) {
                onTranscriptionLanguageChange(val);
              } else {
                setLocalTranscriptionLanguage(val);
              }
            }}>
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      id: "call",
      title: "Call Settings",
      icon: Phone,
      description: "Call handling and timeouts",
      content: (
        <div className="space-y-4 w-full">
          <div className="space-y-3">
            {/* Max Call Duration */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Max Call Duration</Label>
              <p className="text-xs text-slate-500">
                Maximum time for a single call
              </p>
              <div className="px-2">
                <Slider
                  value={callTimeout}
                  onValueChange={vals => {
                    if (onCallTimeoutChange) {
                      onCallTimeoutChange(vals[0]);
                    } else {
                      setLocalCallTimeout(vals);
                    }
                  }}
                  max={120}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="text-center text-xs text-slate-600 mt-1">
                  {callTimeout[0]} minutes
                </div>
              </div>
            </div>

            {/* Silence Timeout */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Silence Timeout</Label>
              <p className="text-xs text-slate-500">
                End call after silence period
              </p>
              <div className="px-2">
                <Slider
                  value={silenceTimeout}
                  onValueChange={vals => {
                    if (onSilenceTimeoutChange) {
                      onSilenceTimeoutChange(vals[0]);
                    } else {
                      setLocalSilenceTimeout(vals);
                    }
                  }}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-xs text-slate-600 mt-1">
                  {silenceTimeout[0]} seconds
                </div>
              </div>
            </div>

            {/* Call Terminate */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Call Terminate (s)</Label>
              <Input
                type="number"
                value={callTerminate ?? ""}
                onChange={e => onCallTerminateChange && onCallTerminateChange(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Call Recording */}
            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-3">
                <Label className="text-xs font-medium">Call Recording</Label>
                <p className="text-xs text-slate-500">
                  Record all calls for quality assurance
                </p>
              </div>
              <Switch
                checked={callRecording}
                onCheckedChange={val => {
                  if (onCallRecordingChange) {
                    onCallRecordingChange(!!val);
                  } else {
                    setLocalCallRecording(!!val);
                  }
                }}
              />
            </div>

            {/* Voicemail Detection */}
            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-3">
                <Label className="text-xs font-medium">
                  Voicemail Detection
                </Label>
                <p className="text-xs text-slate-500">
                  Detect and handle voicemail systems
                </p>
              </div>
              <Switch
                checked={voicemailDetection}
                onCheckedChange={val => {
                  if (onVoicemailDetectionChange) {
                    onVoicemailDetectionChange(!!val);
                  } else {
                    setLocalVoicemailDetection(!!val);
                  }
                }}
              />
            </div>

            {/* Hangup After LLM Call */}
            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-3">
                <Label className="text-xs font-medium">Hangup After LLM Call</Label>
              </div>
              <Switch
                checked={!!hangupAfterLLMCall}
                onCheckedChange={onHangupAfterLLMCallChange}
              />
            </div>

            {/* Call Cancellation Prompt */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Call Cancellation Prompt</Label>
              <Input
                value={callCancellationPrompt ?? ""}
                onChange={e => onCallCancellationPromptChange && onCallCancellationPromptChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Trigger User Online Msg After */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Trigger User Online Msg After (s)</Label>
              <Input
                type="number"
                value={triggerUserOnlineMessageAfter ?? ""}
                onChange={e => onTriggerUserOnlineMessageAfterChange && onTriggerUserOnlineMessageAfterChange(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Check User Online Message */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Check User Online Message</Label>
              <Input
                value={checkUserOnlineMessage ?? ""}
                onChange={e => onCheckUserOnlineMessageChange && onCheckUserOnlineMessageChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Check If User Online */}
            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-3">
                <Label className="text-xs font-medium">Check If User Online</Label>
              </div>
              <Switch
                checked={!!checkIfUserOnline}
                onCheckedChange={onCheckIfUserOnlineChange}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "post-call-analysis",
      title: "Post-Call Analysis",
      icon: BarChart3,
      description: "Analytics and insights",
      content: (
        <div className="space-y-4 w-full">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Analysis Type</Label>
              <Select defaultValue="comprehensive">
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="basic">Basic Summary</SelectItem>
                  <SelectItem value="comprehensive">
                    Comprehensive Analysis
                  </SelectItem>
                  <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                  <SelectItem value="custom">Custom Metrics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Report Format</Label>
              <Select defaultValue="json">
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="email">Email Summary</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-3">
                <Label className="text-xs font-medium">
                  Auto-generate Insights
                </Label>
                <p className="text-xs text-slate-500">
                  Automatically generate call insights
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex-1 pr-3">
                <Label className="text-xs font-medium">Export to CRM</Label>
                <p className="text-xs text-slate-500">
                  Automatically export data to CRM
                </p>
              </div>
              <Switch />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Webhook URL</Label>
              <Input
                placeholder="https://your-api.com/webhook"
                className="text-xs h-8 w-full"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-800">
          Assistant Settings
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Configure your assistant's behavior and capabilities
        </p>
      </div>


      {/* Advanced Agent Settings REMOVED - all settings are now distributed into their respective sections */}

      {/* Settings Sections - All displayed vertically */}
      <div className="divide-y divide-slate-200">
        {sections.map((section) => {
          const isOpen = openSections.has(section.id);
          const Icon = section.icon;

          return (
            <div key={section.id} className="w-full">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Icon className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-800 truncate">
                      {section.title}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {section.description}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform duration-200" />
                  )}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 pb-4 w-full">{section.content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
