import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubAccount } from "@/contexts/SubAccountContext";
import { subAccountKingCallerAuth } from "@/services/subAccountKingCallerAuth";
import { AgentSpeechSettings } from "@/services/kingcaller/kingCallerTypes";

interface SpeechSettings {
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  voiceEmotion: string;
  enableSSML: boolean;
  ssmlProsody: {
    rate: string;
    pitch: string;
    volume: string;
  };
  breathiness: number;
  intonationPattern: string;
  voiceStyle: string;
}

export const useKingCallerAgentBuilder = () => {
  const [prompt, setPrompt] = useState("You are a helpful AI assistant.");
  const [welcomeMessage, setWelcomeMessage] = useState("Hello! How can I help you today?");
  const [agentName, setAgentName] = useState("New Assistant");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [selectedVoice, setSelectedVoice] = useState("Cimo");
  const [selectedVoiceName, setSelectedVoiceName] = useState("Select voice");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<any | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    speechRate: 1,
    speechPitch: 1,
    speechVolume: 1,
    voiceEmotion: "neutral",
    enableSSML: false,
    ssmlProsody: {
      rate: "medium",
      pitch: "medium",
      volume: "medium",
    },
    breathiness: 0,
    intonationPattern: "default",
    voiceStyle: "conversational",
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { assistantId, subAccountId } = useParams();
  const { currentUser } = useAuth();
  const { currentSubAccount } = useSubAccount();

  const isNewAgent = !currentAgent || !isEditingMode;

  // Load assistant data when component mounts or assistantId changes
  useEffect(() => {
    if (assistantId) {
      loadAgentFromVoiceAI(assistantId);
    }
  }, [assistantId]);

  const loadAgentFromVoiceAI = async (id: string) => {
    if (!currentUser || !currentSubAccount) {
      console.error("No current user or sub-account available");
      toast({
        title: "Error",
        description: "Please log in and select a sub-account to access assistant data",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("🔍 Loading assistant from Voice AI:", id);
      const assistant = await subAccountKingCallerAuth.getAssistantById(id);
      
      if (assistant) {
        console.log("📥 Raw assistant data from API:", assistant);
        
        setCurrentAgent(assistant);
        setAgentName(assistant.agentName || "Assistant");
        setPrompt(assistant.instructions || "You are a helpful AI assistant.");
        setWelcomeMessage(assistant.greeting || "Hello! How can I help you today?");
        setSelectedModel(assistant.thinkModel || "gpt-4o-mini");
        setSelectedVoice(assistant.voiceId || "Cimo");
        setIsEditingMode(true);
        setHasUnsavedChanges(false); // Reset unsaved changes since we just loaded
        
        console.log("✅ Assistant data loaded and UI populated:", {
          agentName: assistant.agentName,
          instructions: assistant.instructions,
          greeting: assistant.greeting,
          thinkModel: assistant.thinkModel,
          voiceId: assistant.voiceId
        });
      } else {
        console.error("Assistant not found:", id);
        toast({
          title: "Error",
          description: "Assistant not found",
          variant: "destructive",
        });
        navigate(`/${subAccountId}/assistants`);
      }
    } catch (error) {
      console.error("Error loading assistant from Voice AI:", error);
      toast({
        title: "Error",
        description: "Failed to load assistant",
        variant: "destructive",
      });
      navigate(`/${subAccountId}/assistants`);
    } finally {
      setIsLoading(false);
    }
  };


  // Track changes including speech settings - improved logic
  useEffect(() => {
    if (currentAgent) {
      const hasChanges = 
        agentName.trim() !== (currentAgent.agentName || "").trim() ||
        prompt.trim() !== (currentAgent.instructions || "").trim() ||
        welcomeMessage.trim() !== (currentAgent.greeting || "").trim() ||
        selectedModel !== (currentAgent.thinkModel || "") ||
        selectedVoice !== (currentAgent.voiceId || "") ||
        speechSettings.speechRate !== 1 ||
        speechSettings.speechPitch !== 1 ||
        speechSettings.speechVolume !== 1 ||
        speechSettings.voiceEmotion !== "neutral" ||
        speechSettings.enableSSML !== false ||
        speechSettings.breathiness !== 0 ||
        speechSettings.intonationPattern !== "default" ||
        speechSettings.voiceStyle !== "conversational";
      
      setHasUnsavedChanges(hasChanges);
    } else if (!isEditingMode) {
      // For new agents, mark as changed if any field differs from defaults
      const hasChanges = 
        agentName.trim() !== "New Assistant" ||
        prompt.trim() !== "You are a helpful AI assistant." ||
        welcomeMessage.trim() !== "Hello! How can I help you today?" ||
        selectedModel !== "gpt-4o-mini" ||
        selectedVoice !== "Cimo" ||
        speechSettings.speechRate !== 1 ||
        speechSettings.speechPitch !== 1 ||
        speechSettings.speechVolume !== 1 ||
        speechSettings.voiceEmotion !== "neutral" ||
        speechSettings.enableSSML !== false ||
        speechSettings.breathiness !== 0 ||
        speechSettings.intonationPattern !== "default" ||
        speechSettings.voiceStyle !== "conversational";
      
      setHasUnsavedChanges(hasChanges);
    }
  }, [prompt, welcomeMessage, agentName, selectedModel, selectedVoice, speechSettings, currentAgent, isEditingMode]);

  // Generate final PUT request payload
  const generatePutRequestPayload = () => {
    return {
      agentName: agentName.trim(),
      voiceId: selectedVoice,
      greeting: welcomeMessage.trim(),
      instructions: prompt.trim(),
      listenModel: 'nova-3',
      thinkModel: selectedModel,
      knowledgeBase: currentAgent?.knowledgeBase || {
        company: '',
        services: []
      },
      toolConfigIds: currentAgent?.toolConfigIds || [],
      speechSettings: {
        responsiveness: speechSettings.speechRate,
        interruptionSensitivity: speechSettings.speechPitch,
        enableBackchannel: speechSettings.enableSSML,
        backchannelFrequency: speechSettings.speechVolume,
        voiceEmotion: speechSettings.voiceEmotion,
        breathiness: speechSettings.breathiness,
        intonationPattern: speechSettings.intonationPattern,
        voiceStyle: speechSettings.voiceStyle,
        ssmlProsody: speechSettings.ssmlProsody,
      },
      metadata: {
        lastModified: new Date().toISOString(),
        version: (currentAgent?.metadata?.version || 0) + 1,
        editMode: isEditingMode,
        agentId: assistantId || currentAgent?.agent_id,
      }
    };
  };

  const handleSave = async (): Promise<boolean> => {
    if (!currentUser || !currentSubAccount) {
      toast({
        title: "Authentication Required",
        description: "Please log in and select a sub-account to save assistant",
        variant: "destructive",
      });
      return false;
    }
    
    setIsSaving(true);
    try {
      // Generate the complete PUT request payload
      const putRequestPayload = generatePutRequestPayload();
      console.log("🔍 Final PUT Request Payload:", JSON.stringify(putRequestPayload, null, 2));
      
      // Extract core assistant data for the API call
      const assistantData = {
        agentName: putRequestPayload.agentName,
        voiceId: putRequestPayload.voiceId,
        greeting: putRequestPayload.greeting,
        instructions: putRequestPayload.instructions,
        listenModel: putRequestPayload.listenModel,
        thinkModel: putRequestPayload.thinkModel,
        knowledgeBase: putRequestPayload.knowledgeBase,
        toolConfigIds: putRequestPayload.toolConfigIds
      };

      let savedAssistant: any | null = null;
      
      if (isEditingMode && currentAgent && assistantId) {
        // Update existing assistant
        console.log("🔄 Updating assistant...");
        
        try {
          savedAssistant = await subAccountKingCallerAuth.updateAssistant(assistantId, assistantData);
          if (!savedAssistant) throw new Error("Failed to update assistant");
          console.log("✅ Assistant updated successfully:", savedAssistant);
        } catch (apiError: any) {
          // Fallback for disabled API - create mock saved assistant
          if (apiError.message?.includes("KingCaller API disabled")) {
            console.log("📝 API disabled, using mock update...");
            savedAssistant = {
              ...currentAgent,
              ...assistantData,
              agent_id: assistantId,
              updated_at: new Date().toISOString(),
            };
            console.log("✅ Mock assistant updated:", savedAssistant);
          } else {
            throw apiError;
          }
        }

        // Save speech settings after successful assistant update
        try {
          const agentSpeechSettings: AgentSpeechSettings = {
            responsiveness: speechSettings.speechRate,
            interruptionSensitivity: speechSettings.speechPitch,
            enableBackchannel: speechSettings.enableSSML,
            backchannelFrequency: speechSettings.speechVolume,
          };

          await subAccountKingCallerAuth.updateAgentSpeechSettings(assistantId, agentSpeechSettings);
          console.log("✅ Speech settings updated successfully");
        } catch (speechError: any) {
          if (speechError.message?.includes("KingCaller API disabled")) {
            console.log("📝 Speech settings API disabled, using mock...");
          } else {
            console.warn("⚠️ Failed to update speech settings:", speechError);
          }
          // Don't fail the whole save for speech settings errors
        }
        
        toast({
          title: "Assistant Updated",
          description: `"${agentName}" has been updated successfully`,
        });
      } else {
        // Create new assistant
        console.log("🚀 Creating new assistant...");
        const createAssistantData = {
          ...assistantData,
          speechSettings: {
            responsiveness: speechSettings.speechRate,
            interruptionSensitivity: speechSettings.speechPitch,
            enableBackchannel: speechSettings.enableSSML,
            backchannelFrequency: speechSettings.speechVolume,
          }
        };
        
        try {
          const newAssistantId = await subAccountKingCallerAuth.createKingCallerAgent(createAssistantData);
          if (!newAssistantId) throw new Error("Failed to create assistant");
          
          // Load the newly created assistant
          savedAssistant = await subAccountKingCallerAuth.getAssistantById(newAssistantId);
          if (!savedAssistant) throw new Error("Failed to load newly created assistant");
          
          console.log("✅ Assistant created successfully:", savedAssistant);
          
          // Navigate to edit mode
          navigate(`/${subAccountId}/assistants/${newAssistantId}/edit`, { replace: true });
        } catch (apiError: any) {
          // Fallback for disabled API - create mock new assistant
          if (apiError.message?.includes("KingCaller API disabled")) {
            console.log("📝 API disabled, using mock creation...");
            const mockId = `mock-${Date.now()}`;
            savedAssistant = {
              ...createAssistantData,
              agent_id: mockId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              assistant_status: "active",
              agent_type: "voice"
            };
            console.log("✅ Mock assistant created:", savedAssistant);
            
            // For development: don't navigate since we don't have a real ID
            setIsEditingMode(true);
          } else {
            throw apiError;
          }
        }
        
        toast({
          title: "Assistant Created",
          description: `"${agentName}" has been created successfully`,
        });
      }
      
      setCurrentAgent(savedAssistant);
      setHasUnsavedChanges(false);
      setIsEditingMode(true);

      return true;
    } catch (error) {
      console.error("Error saving assistant:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (isEditingMode) {
        toast({
          title: "Update Failed",
          description: `Failed to update assistant: ${errorMessage}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Creation Failed",
          description: `Failed to create assistant: ${errorMessage}`,
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const agentId = currentAgent?.agent_id || assistantId;

  return {
    prompt,
    welcomeMessage,
    agentName,
    selectedModel,
    selectedVoice,
    selectedVoiceName,
    hasUnsavedChanges,
    currentAgent,
    isEditingMode,
    isSaving,
    isLoading,
    isNewAgent,
    speechSettings,
    agentId,
    setPrompt,
    setWelcomeMessage,
    setAgentName,
    setSelectedModel,
    setSelectedVoice,
    setSelectedVoiceName,
    setHasUnsavedChanges,
    setSpeechSettings,
    handleSave,
    generatePutRequestPayload,
  };
};