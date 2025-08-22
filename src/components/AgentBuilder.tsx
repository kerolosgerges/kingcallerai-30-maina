import { useEffect, useState } from "react";
import { TopNavigation } from "./agent/TopNavigation";
import { PromptDesignArea } from "./agent/PromptDesignArea";
import { TestingPanel } from "./agent/TestingPanel";
import { SettingsSidebar } from "./agent/SettingsSidebar";
import { UnsavedChangesDialog } from "./agent/UnsavedChangesDialog";
import { useKingCallerAgentBuilder } from "@/hooks/useKingCallerAgentBuilder";
import { useAgentNavigation } from "@/hooks/useAgentNavigation";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { SaveSummaryModal } from "./agent/SaveSummaryModal";

/**
 * Helper: Extracts settings from API response and maps to local state shape.
 */
function extractSettingsFromApi(json: any) {
  const toolsConfig = json?.tasks?.[0]?.tools_config || {};
  const taskConfig = json?.tasks?.[0]?.task_config || {};

  // Speech/Synthesizer
  const synth = toolsConfig.synthesizer || {};
  const synthProvider = synth.provider_config || {};

  // Transcriber
  const transcriber = toolsConfig.transcriber || {};

  // Input/Output
  const input = toolsConfig.input || {};
  const output = toolsConfig.output || {};

  // Advanced agent settings
  return {
    speechSettings: {
      speechRate: synthProvider.speechRate ?? 1,
      speechPitch: synthProvider.speechPitch ?? 1,
      speechVolume: synthProvider.speechVolume ?? 1,
      voiceEmotion: synthProvider.voiceEmotion ?? "neutral",
      enableSSML: synthProvider.enableSSML ?? false,
      ssmlProsody: synthProvider.ssmlProsody ?? {
        rate: "medium",
        pitch: "medium",
        volume: "medium",
      },
      breathiness: synthProvider.breathiness ?? 0,
      intonationPattern: synthProvider.intonationPattern ?? "default",
      voiceStyle: synthProvider.voiceStyle ?? "",
    },
    callTimeout: taskConfig.max_call_duration ?? 30,
    silenceTimeout: taskConfig.hangup_after_silence ?? 5,
    callRecording: taskConfig.call_recording ?? true,
    voicemailDetection: taskConfig.voicemail_detection ?? false,
    transcriptionLanguage: transcriber.language ?? "en",
    inputProvider: input.provider ?? "twilio",
    outputProvider: output.provider ?? "twilio",
    transcriberProvider: transcriber.provider ?? "deepgram",
    outputFormat: output.format ?? "wav",
    webhookUrl: taskConfig.webhook_url ?? "",
    postCallAnalysisType: taskConfig.post_call_analysis_type ?? "comprehensive",
    postCallReportFormat: taskConfig.post_call_report_format ?? "json",
    fallbackAction: taskConfig.fallback_action ?? "repeat_prompt",
    optimizeLatency: taskConfig.optimize_latency ?? false,
    incrementalDelay: taskConfig.incremental_delay ?? 900,
    numberOfWordsForInterruption: taskConfig.number_of_words_for_interruption ?? 1,
    interruptionBackoffPeriod: taskConfig.interruption_backoff_period ?? 100,
    hangupAfterLLMCall: taskConfig.hangup_after_LLMCall ?? false,
    callCancellationPrompt: taskConfig.call_cancellation_prompt ?? "",
    backchanneling: taskConfig.backchanneling ?? false,
    backchannelingMessageGap: taskConfig.backchanneling_message_gap ?? 5,
    backchannelingStartDelay: taskConfig.backchanneling_start_delay ?? 5,
    ambientNoise: taskConfig.ambient_noise ?? false,
    ambientNoiseTrack: taskConfig.ambient_noise_track ?? "convention_hall",
    callTerminate: taskConfig.call_terminate ?? 90,
    useFillers: taskConfig.use_fillers ?? false,
    triggerUserOnlineMessageAfter: taskConfig.trigger_user_online_message_after ?? 10,
    checkUserOnlineMessage: taskConfig.check_user_online_message ?? "Hey, are you still there",
    checkIfUserOnline: taskConfig.check_if_user_online ?? true,
    generatePreciseTranscript: taskConfig.generate_precise_transcript ?? false,
  };
}

export const AgentBuilder = () => {
  const { subAccountId, agentId } = useParams();
  const { toast } = useToast();
  const [showSaveSummaryModal, setShowSaveSummaryModal] = useState(false);

  // API Fetched Data
  const [agentData, setAgentData] = useState<any>(null);
  const [loadingAgentData, setLoadingAgentData] = useState(false);
  const [agentDataError, setAgentDataError] = useState<string | null>(null);

  // Save/Dirty State
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Debug panel state
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Local Editing State
  const {
    prompt,
    welcomeMessage,
    agentName,
    selectedModel,
    selectedVoice,
    selectedVoiceName,
    speechSettings,
    isLoading,
    isNewAgent,
    agentId: builderAgentId,
    hasUnsavedChanges: builderHasUnsavedChanges,
    setPrompt,
    setWelcomeMessage,
    setAgentName,
    setSelectedModel,
    setSelectedVoice,
    setSelectedVoiceName,
    setSpeechSettings,
  } = useKingCallerAgentBuilder();

  // Advanced settings state
  const [callTimeout, setCallTimeout] = useState(30);
  const [silenceTimeout, setSilenceTimeout] = useState(5);
  const [callRecording, setCallRecording] = useState(true);
  const [voicemailDetection, setVoicemailDetection] = useState(false);
  const [transcriptionLanguage, setTranscriptionLanguage] = useState("en");
  const [inputProvider, setInputProvider] = useState("twilio");
  const [outputProvider, setOutputProvider] = useState("twilio");
  const [transcriberProvider, setTranscriberProvider] = useState("deepgram");
  const [outputFormat, setOutputFormat] = useState("wav");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [postCallAnalysisType, setPostCallAnalysisType] = useState("comprehensive");
  const [postCallReportFormat, setPostCallReportFormat] = useState("json");
  const [fallbackAction, setFallbackAction] = useState("repeat_prompt");
  const [optimizeLatency, setOptimizeLatency] = useState(false);
  const [incrementalDelay, setIncrementalDelay] = useState(900);
  const [numberOfWordsForInterruption, setNumberOfWordsForInterruption] = useState(1);
  const [interruptionBackoffPeriod, setInterruptionBackoffPeriod] = useState(100);
  const [hangupAfterLLMCall, setHangupAfterLLMCall] = useState(false);
  const [callCancellationPrompt, setCallCancellationPrompt] = useState("");
  const [backchanneling, setBackchanneling] = useState(false);
  const [backchannelingMessageGap, setBackchannelingMessageGap] = useState(5);
  const [backchannelingStartDelay, setBackchannelingStartDelay] = useState(5);
  const [ambientNoise, setAmbientNoise] = useState(false);
  const [ambientNoiseTrack, setAmbientNoiseTrack] = useState("convention_hall");
  const [callTerminate, setCallTerminate] = useState(90);
  const [useFillers, setUseFillers] = useState(false);
  const [triggerUserOnlineMessageAfter, setTriggerUserOnlineMessageAfter] = useState(10);
  const [checkUserOnlineMessage, setCheckUserOnlineMessage] = useState("Hey, are you still there");
  const [checkIfUserOnline, setCheckIfUserOnline] = useState(true);
  const [generatePreciseTranscript, setGeneratePreciseTranscript] = useState(false);

  const {
    showLeaveConfirmation,
    setShowLeaveConfirmation,
    handleNavigation,
    confirmLeave,
    cancelLeave,
  } = useAgentNavigation(hasUnsavedChanges);

  // Fetch agent details from API
  const fetchAgentData = async () => {
    if (!agentId || !subAccountId) return;
    setLoadingAgentData(true);
    setAgentDataError(null);

    try {
      const res = await fetch(
        `https://voiceai.kingcaller.ai/agent/${agentId}?saas_id=${subAccountId}`
      );
      if (!res.ok) throw new Error("Failed to fetch agent data");

      const json = await res.json();
      setAgentData(json);
      setAgentName(json.agent_name || "");
      setWelcomeMessage(json.config?.agent_welcome_message || "");
      setPrompt(
        json?.prompts?.task_1?.system_prompt || ""
      );
      setSelectedVoice(
        json?.tasks?.[0]?.tools_config?.synthesizer?.provider_config?.voice_id || ""
      );
      setSelectedModel(
        json?.tasks?.[0]?.tools_config?.llm_agent?.llm_config?.model || ""
      );

      // Extract and set all mapped settings
      const extracted = extractSettingsFromApi(json);
      setSpeechSettings(extracted.speechSettings);
      setCallTimeout(extracted.callTimeout);
      setSilenceTimeout(extracted.silenceTimeout);
      setCallRecording(extracted.callRecording);
      setVoicemailDetection(extracted.voicemailDetection);
      setTranscriptionLanguage(extracted.transcriptionLanguage);
      setInputProvider(extracted.inputProvider);
      setOutputProvider(extracted.outputProvider);
      setTranscriberProvider(extracted.transcriberProvider);
      setOutputFormat(extracted.outputFormat);
      setWebhookUrl(extracted.webhookUrl);
      setPostCallAnalysisType(extracted.postCallAnalysisType);
      setPostCallReportFormat(extracted.postCallReportFormat);
      setFallbackAction(extracted.fallbackAction);
      setOptimizeLatency(extracted.optimizeLatency);
      setIncrementalDelay(extracted.incrementalDelay);
      setNumberOfWordsForInterruption(extracted.numberOfWordsForInterruption);
      setInterruptionBackoffPeriod(extracted.interruptionBackoffPeriod);
      setHangupAfterLLMCall(extracted.hangupAfterLLMCall);
      setCallCancellationPrompt(extracted.callCancellationPrompt);
      setBackchanneling(extracted.backchanneling);
      setBackchannelingMessageGap(extracted.backchannelingMessageGap);
      setBackchannelingStartDelay(extracted.backchannelingStartDelay);
      setAmbientNoise(extracted.ambientNoise);
      setAmbientNoiseTrack(extracted.ambientNoiseTrack);
      setCallTerminate(extracted.callTerminate);
      setUseFillers(extracted.useFillers);
      setTriggerUserOnlineMessageAfter(extracted.triggerUserOnlineMessageAfter);
      setCheckUserOnlineMessage(extracted.checkUserOnlineMessage);
      setCheckIfUserOnline(extracted.checkIfUserOnline);
      setGeneratePreciseTranscript(extracted.generatePreciseTranscript);

    } catch (e: any) {
      setAgentDataError(e.message);
      setAgentData(null);
    } finally {
      setLoadingAgentData(false);
    }
  };

  // Call fetch on mount
  useEffect(() => {
    fetchAgentData();
    // eslint-disable-next-line
  }, [agentId, subAccountId]);

  // Any field change triggers unsaved changes
  const onFieldChange = (setter: any) => (val: any) => {
    setter(val);
    setHasUnsavedChanges(true);
  };

  // Sync unsaved changes state
  // (Removed context syncing to avoid overwriting unsaved state)

  // Save logic - build PUT payload and send to API
  const handleSave = async () => {
    if (!agentId || !subAccountId) return false;

    setIsSaving(true);
    setSaveError(null);

    try {
      // Map all relevant settings to API payload
      const payload = {
        agent_config: {
          agent_name: agentName,
          agent_type: "other",
          agent_welcome_message: welcomeMessage,
          tasks: [
            {
              task_type: "conversation",
              toolchain: {
                execution: "parallel",
                pipelines: [["transcriber", "llm", "synthesizer"]],
              },
              tools_config: {
                input: {
                  format: outputFormat,
                  provider: inputProvider,
                },
                llm_agent: {
                  agent_type: "simple_llm_agent",
                  agent_flow_type: "streaming",
                  routes: null,
                  llm_config: {
                    agent_flow_type: "streaming",
                    provider: "openai",
                    request_json: true,
                    model: selectedModel,
                  },
                },
                output: {
                  format: outputFormat,
                  provider: outputProvider,
                },
                synthesizer: {
                  audio_format: outputFormat,
                  provider: "elevenlabs",
                  stream: true,
                  provider_config: {
                    voice: selectedVoiceName,
                    model: "eleven_flash_v2_5",
                    voice_id: selectedVoice,
                    speechRate: speechSettings.speechRate,
                    speechPitch: speechSettings.speechPitch,
                    speechVolume: speechSettings.speechVolume,
                    voiceEmotion: speechSettings.voiceEmotion,
                    enableSSML: speechSettings.enableSSML,
                    ssmlProsody: speechSettings.ssmlProsody,
                    breathiness: speechSettings.breathiness,
                    intonationPattern: speechSettings.intonationPattern,
                  },
                  buffer_size: 100.0,
                },
                transcriber: {
                  encoding: "linear16",
                  language: transcriptionLanguage,
                  provider: transcriberProvider,
                  stream: true,
                },
              },
              task_config: {
                hangup_after_silence: silenceTimeout,
                max_call_duration: callTimeout,
                call_recording: callRecording,
                voicemail_detection: voicemailDetection,
                webhook_url: webhookUrl,
                post_call_analysis_type: postCallAnalysisType,
                post_call_report_format: postCallReportFormat,
                fallback_action: fallbackAction,
                optimize_latency: optimizeLatency,
                incremental_delay: incrementalDelay,
                number_of_words_for_interruption: numberOfWordsForInterruption,
                interruption_backoff_period: interruptionBackoffPeriod,
                hangup_after_LLMCall: hangupAfterLLMCall,
                call_cancellation_prompt: callCancellationPrompt,
                backchanneling: backchanneling,
                backchanneling_message_gap: backchannelingMessageGap,
                backchanneling_start_delay: backchannelingStartDelay,
                ambient_noise: ambientNoise,
                ambient_noise_track: ambientNoiseTrack,
                call_terminate: callTerminate,
                use_fillers: useFillers,
                trigger_user_online_message_after: triggerUserOnlineMessageAfter,
                check_user_online_message: checkUserOnlineMessage,
                check_if_user_online: checkIfUserOnline,
                generate_precise_transcript: generatePreciseTranscript,
              },
            },
          ],
        },
        agent_prompts: {
          task_1: {
            system_prompt: prompt,
          },
        },
      };

      const res = await fetch(
        `https://voiceai.kingcaller.ai/agent/${agentId}?saas_id=${subAccountId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`Failed to save changes (${res.status})`);
      const updated = await res.json();

      setAgentData(updated);
      setHasUnsavedChanges(false);
      return true;
    } catch (error: any) {
      setSaveError(error.message || "Failed to save changes");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Error state
  if (agentDataError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        Failed to load agent: {agentDataError}
      </div>
    );
  }

  // Main UI
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {saveError && (
          <div className="bg-red-50 border-b border-red-200 text-red-600 px-6 py-2">
            {saveError}
          </div>
        )}
        {/* Show success message on save */}
        {!saveError && !hasUnsavedChanges && !isSaving && (
          <div className="bg-green-50 border-b border-green-200 text-green-700 px-6 py-2">
            Changes saved successfully.
          </div>
        )}
        <TopNavigation
          agentName={agentName}
          agentId={builderAgentId}
          selectedModel={selectedModel}
          selectedVoice={selectedVoice}
          onAgentNameChange={onFieldChange(setAgentName)}
          onSave={handleSave}
          onBack={() => handleNavigation(`/${subAccountId}/agents`)}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          urlParams={{ subAccountId, agentId }}
        />

        {/* Desktop Layout */}
        <div className="hidden lg:flex h-[calc(100vh-64px)]">
          <div className="w-[45%] p-4">
            <PromptDesignArea
              prompt={prompt}
              welcomeMessage={welcomeMessage}
              selectedVoice={selectedVoice}
              selectedVoiceName={selectedVoiceName}
              selectedModel={selectedModel}
              onPromptChange={onFieldChange(setPrompt)}
              onWelcomeMessageChange={onFieldChange(setWelcomeMessage)}
              onVoiceChange={onFieldChange(setSelectedVoice)}
              onVoiceNameChange={onFieldChange(setSelectedVoiceName)}
              onModelChange={onFieldChange(setSelectedModel)}
            />
          </div>

          <div className="w-[35%] border-l border-slate-200 bg-white/70 backdrop-blur-sm">
            <SettingsSidebar
              speechSettings={speechSettings}
              onSpeechSettingsChange={onFieldChange(setSpeechSettings)}
              silenceTimeout={silenceTimeout}
              onSilenceTimeoutChange={onFieldChange(setSilenceTimeout)}
              callTimeout={callTimeout}
              onCallTimeoutChange={onFieldChange(setCallTimeout)}
              callRecording={callRecording}
              onCallRecordingChange={onFieldChange(setCallRecording)}
              voicemailDetection={voicemailDetection}
              onVoicemailDetectionChange={onFieldChange(setVoicemailDetection)}
              transcriptionLanguage={transcriptionLanguage}
              onTranscriptionLanguageChange={onFieldChange(setTranscriptionLanguage)}
              inputProvider={inputProvider}
              onInputProviderChange={onFieldChange(setInputProvider)}
              outputProvider={outputProvider}
              onOutputProviderChange={onFieldChange(setOutputProvider)}
              transcriberProvider={transcriberProvider}
              onTranscriberProviderChange={onFieldChange(setTranscriberProvider)}
              outputFormat={outputFormat}
              onOutputFormatChange={onFieldChange(setOutputFormat)}
              webhookUrl={webhookUrl}
              onWebhookUrlChange={onFieldChange(setWebhookUrl)}
              postCallAnalysisType={postCallAnalysisType}
              onPostCallAnalysisTypeChange={onFieldChange(setPostCallAnalysisType)}
              postCallReportFormat={postCallReportFormat}
              onPostCallReportFormatChange={onFieldChange(setPostCallReportFormat)}
              fallbackAction={fallbackAction}
              onFallbackActionChange={onFieldChange(setFallbackAction)}
              optimizeLatency={optimizeLatency}
              onOptimizeLatencyChange={onFieldChange(setOptimizeLatency)}
              incrementalDelay={incrementalDelay}
              onIncrementalDelayChange={onFieldChange(setIncrementalDelay)}
              numberOfWordsForInterruption={numberOfWordsForInterruption}
              onNumberOfWordsForInterruptionChange={onFieldChange(setNumberOfWordsForInterruption)}
              interruptionBackoffPeriod={interruptionBackoffPeriod}
              onInterruptionBackoffPeriodChange={onFieldChange(setInterruptionBackoffPeriod)}
              hangupAfterLLMCall={hangupAfterLLMCall}
              onHangupAfterLLMCallChange={onFieldChange(setHangupAfterLLMCall)}
              callCancellationPrompt={callCancellationPrompt}
              onCallCancellationPromptChange={onFieldChange(setCallCancellationPrompt)}
              backchanneling={backchanneling}
              onBackchannelingChange={onFieldChange(setBackchanneling)}
              backchannelingMessageGap={backchannelingMessageGap}
              onBackchannelingMessageGapChange={onFieldChange(setBackchannelingMessageGap)}
              backchannelingStartDelay={backchannelingStartDelay}
              onBackchannelingStartDelayChange={onFieldChange(setBackchannelingStartDelay)}
              ambientNoise={ambientNoise}
              onAmbientNoiseChange={onFieldChange(setAmbientNoise)}
              ambientNoiseTrack={ambientNoiseTrack}
              onAmbientNoiseTrackChange={onFieldChange(setAmbientNoiseTrack)}
              callTerminate={callTerminate}
              onCallTerminateChange={onFieldChange(setCallTerminate)}
              useFillers={useFillers}
              onUseFillersChange={onFieldChange(setUseFillers)}
              triggerUserOnlineMessageAfter={triggerUserOnlineMessageAfter}
              onTriggerUserOnlineMessageAfterChange={onFieldChange(setTriggerUserOnlineMessageAfter)}
              checkUserOnlineMessage={checkUserOnlineMessage}
              onCheckUserOnlineMessageChange={onFieldChange(setCheckUserOnlineMessage)}
              checkIfUserOnline={checkIfUserOnline}
              onCheckIfUserOnlineChange={onFieldChange(setCheckIfUserOnline)}
              generatePreciseTranscript={generatePreciseTranscript}
              onGeneratePreciseTranscriptChange={onFieldChange(setGeneratePreciseTranscript)}
            />
          </div>

          <div className="w-[20%] border-l border-slate-200 bg-white/50 backdrop-blur-sm">
            <TestingPanel agentData={agentData} agentId={agentId || "agent_test_001"} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="p-4 space-y-6">
            <PromptDesignArea
              prompt={prompt}
              welcomeMessage={welcomeMessage}
              selectedVoice={selectedVoice}
              selectedVoiceName={selectedVoiceName}
              selectedModel={selectedModel}
              onPromptChange={onFieldChange(setPrompt)}
              onWelcomeMessageChange={onFieldChange(setWelcomeMessage)}
              onVoiceChange={onFieldChange(setSelectedVoice)}
              onVoiceNameChange={onFieldChange(setSelectedVoiceName)}
              onModelChange={onFieldChange(setSelectedModel)}
            />

            <div className="border-t border-slate-200 pt-6">
              <SettingsSidebar
                speechSettings={speechSettings}
                onSpeechSettingsChange={onFieldChange(setSpeechSettings)}
                silenceTimeout={silenceTimeout}
                onSilenceTimeoutChange={onFieldChange(setSilenceTimeout)}
                callTimeout={callTimeout}
                onCallTimeoutChange={onFieldChange(setCallTimeout)}
                callRecording={callRecording}
                onCallRecordingChange={onFieldChange(setCallRecording)}
                voicemailDetection={voicemailDetection}
                onVoicemailDetectionChange={onFieldChange(setVoicemailDetection)}
                transcriptionLanguage={transcriptionLanguage}
                onTranscriptionLanguageChange={onFieldChange(setTranscriptionLanguage)}
                inputProvider={inputProvider}
                onInputProviderChange={onFieldChange(setInputProvider)}
                outputProvider={outputProvider}
                onOutputProviderChange={onFieldChange(setOutputProvider)}
                transcriberProvider={transcriberProvider}
                onTranscriberProviderChange={onFieldChange(setTranscriberProvider)}
                outputFormat={outputFormat}
                onOutputFormatChange={onFieldChange(setOutputFormat)}
                webhookUrl={webhookUrl}
                onWebhookUrlChange={onFieldChange(setWebhookUrl)}
                postCallAnalysisType={postCallAnalysisType}
                onPostCallAnalysisTypeChange={onFieldChange(setPostCallAnalysisType)}
                postCallReportFormat={postCallReportFormat}
                onPostCallReportFormatChange={onFieldChange(setPostCallReportFormat)}
                fallbackAction={fallbackAction}
                onFallbackActionChange={onFieldChange(setFallbackAction)}
                optimizeLatency={optimizeLatency}
                onOptimizeLatencyChange={onFieldChange(setOptimizeLatency)}
                incrementalDelay={incrementalDelay}
                onIncrementalDelayChange={onFieldChange(setIncrementalDelay)}
                numberOfWordsForInterruption={numberOfWordsForInterruption}
                onNumberOfWordsForInterruptionChange={onFieldChange(setNumberOfWordsForInterruption)}
                interruptionBackoffPeriod={interruptionBackoffPeriod}
                onInterruptionBackoffPeriodChange={onFieldChange(setInterruptionBackoffPeriod)}
                hangupAfterLLMCall={hangupAfterLLMCall}
                onHangupAfterLLMCallChange={onFieldChange(setHangupAfterLLMCall)}
                callCancellationPrompt={callCancellationPrompt}
                onCallCancellationPromptChange={onFieldChange(setCallCancellationPrompt)}
                backchanneling={backchanneling}
                onBackchannelingChange={onFieldChange(setBackchanneling)}
                backchannelingMessageGap={backchannelingMessageGap}
                onBackchannelingMessageGapChange={onFieldChange(setBackchannelingMessageGap)}
                backchannelingStartDelay={backchannelingStartDelay}
                onBackchannelingStartDelayChange={onFieldChange(setBackchannelingStartDelay)}
                ambientNoise={ambientNoise}
                onAmbientNoiseChange={onFieldChange(setAmbientNoise)}
                ambientNoiseTrack={ambientNoiseTrack}
                onAmbientNoiseTrackChange={onFieldChange(setAmbientNoiseTrack)}
                callTerminate={callTerminate}
                onCallTerminateChange={onFieldChange(setCallTerminate)}
                useFillers={useFillers}
                onUseFillersChange={onFieldChange(setUseFillers)}
                triggerUserOnlineMessageAfter={triggerUserOnlineMessageAfter}
                onTriggerUserOnlineMessageAfterChange={onFieldChange(setTriggerUserOnlineMessageAfter)}
                checkUserOnlineMessage={checkUserOnlineMessage}
                onCheckUserOnlineMessageChange={onFieldChange(setCheckUserOnlineMessage)}
                checkIfUserOnline={checkIfUserOnline}
                onCheckIfUserOnlineChange={onFieldChange(setCheckIfUserOnline)}
                generatePreciseTranscript={generatePreciseTranscript}
                onGeneratePreciseTranscriptChange={onFieldChange(setGeneratePreciseTranscript)}
              />
            </div>

            <div className="border-t border-slate-200 pt-6">
              <TestingPanel agentData={agentData} agentId={agentId || "agent_test_001"} />
            </div>
          </div>
        </div>

        <UnsavedChangesDialog
          open={showLeaveConfirmation}
          onOpenChange={setShowLeaveConfirmation}
          onConfirmLeave={confirmLeave}
          onCancelLeave={cancelLeave}
        />

        {/* Debug Panel */}
        <div className="fixed bottom-4 right-4 w-full max-w-[500px] lg:w-[500px] mx-4 lg:mx-0 bg-white border border-slate-300 shadow-lg rounded-lg text-xs z-50 transition-all duration-300">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-slate-100 rounded-t-lg">
            <span className="font-bold text-slate-700">🧪 Debug Panel</span>
            <div className="space-x-2">
              <button
                className="text-xs text-blue-600 hover:underline"
                onClick={() => setShowDebugPanel(!showDebugPanel)}
              >
                {showDebugPanel ? "Hide" : "Show"}
              </button>
              {showDebugPanel && (
                <button
                  className="text-xs text-green-600 hover:underline"
                  onClick={fetchAgentData}
                  disabled={loadingAgentData}
                >
                  {loadingAgentData ? "Refreshing..." : "Refresh"}
                </button>
              )}
            </div>
          </div>

          {showDebugPanel && (
            <div className="h-[300px] lg:h-[400px] overflow-auto p-3">
              <pre className="whitespace-pre-wrap break-words text-slate-700">
                {JSON.stringify(agentData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      <SaveSummaryModal
        open={showSaveSummaryModal}
        onClose={() => setShowSaveSummaryModal(false)}
        selectedModel={selectedModel}
        selectedVoice={selectedVoice}
        selectedVoiceName={selectedVoiceName}
        prompt={prompt}
      />
    </>
  );
};
