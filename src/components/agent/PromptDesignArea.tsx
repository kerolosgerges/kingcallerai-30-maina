import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Settings, Sparkles, Bot, VolumeX, Volume2, Wand2, TreePine, Edit3 } from "lucide-react";
import { VoiceSelectionModal } from "./VoiceSelectionModal";
import { AIPromptDesigner } from "./AIPromptDesigner";
import { PromptTreeBuilder } from "./PromptTreeBuilder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import openaiLogo from "@/assets/openai-svgrepo-com.svg";
import claudeLogo from "@/assets/claude-ai-icon.svg";
import geminiLogo from "@/assets/google-gemini-icon.svg";

interface PromptDesignAreaProps {
  prompt: string;
  welcomeMessage: string;
  onPromptChange: (prompt: string) => void;
  onWelcomeMessageChange: (message: string) => void;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  selectedVoiceName?: string;
  /**
   * Optional: Called when the user selects a voice name (for display).
   */
  onVoiceNameChange?: (name: string) => void;
}

const promptTemplates = [
  {
    id: "customer-support",
    title: "Customer Support Assistant",
    prompt: "You are a helpful customer support assistant. Your goal is to assist customers with their questions and concerns in a friendly, professional manner."
  },
  {
    id: "sales-assistant", 
    title: "Sales Assistant",
    prompt: "You are an experienced sales assistant. Your role is to help potential customers understand our products/services and guide them through the buying process."
  }
];

export const PromptDesignArea = ({
  prompt,
  welcomeMessage,
  onPromptChange,
  onWelcomeMessageChange,
  selectedVoice,
  onVoiceChange,
  selectedModel,
  onModelChange,
  selectedVoiceName = "Select voice",
  onVoiceNameChange,
}: PromptDesignAreaProps) => {
  const [templatesDialogOpen, setTemplatesDialogOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [aiDesignerOpen, setAiDesignerOpen] = useState(false);
  const [promptTreeOpen, setPromptTreeOpen] = useState(false);

  // Debug log wrapper for all prompt changes
  const handlePromptChange = (newPrompt: string) => {
    console.log("[DEBUG] handlePromptChange called, newPrompt:", newPrompt);
    onPromptChange(newPrompt);
  };

  const handleVoiceSelect = (voiceId: string, voiceName: string) => {
    onVoiceChange(voiceId);
    if (onVoiceNameChange) onVoiceNameChange(voiceName);
  };
  
  const handleTemplateSelect = (template: typeof promptTemplates[0]) => {
    console.log("[DEBUG] handleTemplateSelect called, template:", template);
    handlePromptChange(template.prompt);
    setTemplatesDialogOpen(false);
  };

  // Handler for AI Designer
  const handleAIDesignerApply = (newPrompt: string) => {
    console.log("[DEBUG] handleAIDesignerApply called, newPrompt:", newPrompt);
    handlePromptChange(newPrompt);
  };

  // Handler for PromptTreeBuilder save
  const handlePromptTreeSave = (data: { nodes: any[]; edges: any[] }) => {
    console.log("[DEBUG] handlePromptTreeSave called, data:", data);
    // For now, serialize the tree as JSON and set as prompt (could be improved)
    handlePromptChange("[PROMPT_TREE] " + JSON.stringify(data));
  };

  return (
    <div className="space-y-4">
      {/* AI Model and Voice Selection */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="model" className="text-sm font-medium text-gray-700">
            AI Model
          </Label>
          <div className="w-full sm:w-48">
            <Select value={selectedModel} onValueChange={onModelChange}>
              <SelectTrigger className="w-full bg-white/90 backdrop-blur-sm border-slate-200 h-9">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {/* OpenAI Models */}
                <SelectItem value="gpt-4.1-2025-04-14">
                  <div className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="w-4 h-4" />
                    <span>GPT-4.1 (Latest)</span>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-4o">
                  <div className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="w-4 h-4" />
                    <span>GPT-4o</span>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-4o-mini">
                  <div className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="w-4 h-4" />
                    <span>GPT-4o Mini</span>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-4-turbo">
                  <div className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="w-4 h-4" />
                    <span>GPT-4 Turbo</span>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-4">
                  <div className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="w-4 h-4" />
                    <span>GPT-4</span>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-3.5-turbo">
                  <div className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="w-4 h-4" />
                    <span>GPT-3.5 Turbo</span>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-3.5-turbo-16k">
                  <div className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="w-4 h-4" />
                    <span>GPT-3.5 Turbo 16K</span>
                  </div>
                </SelectItem>
                <SelectItem value="o3-2025-04-16">
                  <div className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="w-4 h-4" />
                    <span>O3 (Reasoning)</span>
                  </div>
                </SelectItem>
                <SelectItem value="o4-mini-2025-04-16">
                  <div className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="w-4 h-4" />
                    <span>O4 Mini (Fast Reasoning)</span>
                  </div>
                </SelectItem>
                <SelectItem value="gpt-4.1-mini-2025-04-14">
                  <div className="flex items-center gap-2">
                    <img src={openaiLogo} alt="OpenAI" className="w-4 h-4" />
                    <span>GPT-4.1 Mini</span>
                  </div>
                </SelectItem>
                {/* Claude Models */}
                <SelectItem value="claude-opus-4-20250514">
                  <div className="flex items-center gap-2">
                    <img src={claudeLogo} alt="Claude" className="w-4 h-4" />
                    <span>Claude Opus 4 (Most Capable)</span>
                  </div>
                </SelectItem>
                <SelectItem value="claude-sonnet-4-20250514">
                  <div className="flex items-center gap-2">
                    <img src={claudeLogo} alt="Claude" className="w-4 h-4" />
                    <span>Claude Sonnet 4 (High Performance)</span>
                  </div>
                </SelectItem>
                <SelectItem value="claude-3-5-haiku-20241022">
                  <div className="flex items-center gap-2">
                    <img src={claudeLogo} alt="Claude" className="w-4 h-4" />
                    <span>Claude 3.5 Haiku (Fastest)</span>
                  </div>
                </SelectItem>
                <SelectItem value="claude-3-7-sonnet-20250219">
                  <div className="flex items-center gap-2">
                    <img src={claudeLogo} alt="Claude" className="w-4 h-4" />
                    <span>Claude 3.7 Sonnet</span>
                  </div>
                </SelectItem>
                <SelectItem value="claude-3-5-sonnet-20241022">
                  <div className="flex items-center gap-2">
                    <img src={claudeLogo} alt="Claude" className="w-4 h-4" />
                    <span>Claude 3.5 Sonnet</span>
                  </div>
                </SelectItem>
                <SelectItem value="claude-3-opus-20240229">
                  <div className="flex items-center gap-2">
                    <img src={claudeLogo} alt="Claude" className="w-4 h-4" />
                    <span>Claude 3 Opus</span>
                  </div>
                </SelectItem>
                
                {/* Gemini Models */}
                <SelectItem value="gemini-pro">
                  <div className="flex items-center gap-2">
                    <img src={geminiLogo} alt="Gemini" className="w-4 h-4" />
                    <span>Gemini Pro</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <Label htmlFor="voice" className="text-sm font-medium text-gray-700">
            Voice
          </Label>
          <div className="w-full sm:w-48">
            <Button
              variant="outline"
              onClick={() => setVoiceModalOpen(true)}
              className="w-full justify-between bg-white/90 backdrop-blur-sm border-slate-200 h-9"
            >
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span className="truncate">{selectedVoiceName}</span>
              </span>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="prompt" className="text-sm font-medium text-gray-700">
              System Prompt (saved to API)
            </Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAiDesignerOpen(true)}
                className="text-xs h-7"
              >
                <Wand2 className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">AI Designer</span>
                <span className="sm:hidden">AI</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTemplatesDialogOpen(true)}
                className="text-xs h-7"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Use Template</span>
                <span className="sm:hidden">Template</span>
              </Button>
            </div>
          </div>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => {
              console.log("[DEBUG] Manual prompt edit:", e.target.value);
              handlePromptChange(e.target.value);
            }}
            placeholder="You are a helpful AI assistant. Your job is to assist users with their questions and provide accurate, helpful responses."
            className="w-full resize-none border-slate-200 bg-white/90 backdrop-blur-sm text-sm min-h-[200px] sm:min-h-[300px]"
          />
        </div>

        <div>
          <Label htmlFor="welcomeMessage" className="text-sm font-medium text-gray-700 mb-2 block">
            Welcome Message
          </Label>
          <Select
            value={welcomeMessage === "user-initiates" || welcomeMessage === "ai-greeting" ? welcomeMessage : "custom"}
            onValueChange={(value) => {
              if (value === "custom") {
                // If switching to custom, set empty string to show input field
                onWelcomeMessageChange("");
              } else {
                onWelcomeMessageChange(value);
              }
            }}
          >
            <SelectTrigger className="w-full bg-white/90 backdrop-blur-sm border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="user-initiates">
                User Initiates: AI remains silent until users speak first.
              </SelectItem>
              <SelectItem value="ai-greeting">
                AI Greeting: AI starts with a welcome message
              </SelectItem>
              <SelectItem value="custom">Custom Message</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Custom Message Input Field */}
          {welcomeMessage !== "user-initiates" && welcomeMessage !== "ai-greeting" && (
            <div className="mt-3">
              <Label htmlFor="customWelcomeMessage" className="text-sm font-medium text-gray-700 mb-2 block">
                Custom Welcome Message
              </Label>
              <Textarea
                id="customWelcomeMessage"
                value={welcomeMessage}
                onChange={(e) => onWelcomeMessageChange(e.target.value)}
                placeholder="Enter your custom welcome message here..."
                className="w-full resize-none border-slate-200 bg-white/90 backdrop-blur-sm text-sm min-h-[80px]"
              />
            </div>
          )}
        </div>

        {/* Prompt Tree Section */}
        <div className="mt-6">
          <Card className="border border-slate-200 bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <TreePine className="w-4 h-4" />
                Prompt Tree
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                <div className="text-center">
                  <TreePine className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                  <h3 className="text-sm font-medium text-slate-900 mb-2">
                    Welcome
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 max-w-sm">
                    Create a conversational flow with multiple states and responses for more complex interactions.
                  </p>
                  <Button
                    onClick={() => setPromptTreeOpen(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit prompt tree
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prompt Tree Builder Modal */}
      <PromptTreeBuilder
        open={promptTreeOpen}
        onOpenChange={setPromptTreeOpen}
        onSave={handlePromptTreeSave}
      />

      {/* Voice Selection Modal */}
      <VoiceSelectionModal
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
        selectedVoice={selectedVoice}
        onVoiceSelect={handleVoiceSelect}
      />

      {/* AI Prompt Designer Modal */}
      <AIPromptDesigner
        open={aiDesignerOpen}
        onOpenChange={setAiDesignerOpen}
        onApplyPrompt={handleAIDesignerApply}
        onApplyWelcome={onWelcomeMessageChange}
      />

      {/* Prompt Templates Dialog */}
      <Dialog open={templatesDialogOpen} onOpenChange={setTemplatesDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prompt Templates</DialogTitle>
            <DialogDescription>
              Choose a pre-built prompt template to get started quickly.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {promptTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                onClick={() => handleTemplateSelect(template)}
                className="p-4 h-auto justify-start text-left"
              >
                <div className="space-y-2">
                  <div className="font-medium text-slate-900">
                    {template.title}
                  </div>
                  <div className="text-sm text-slate-600 line-clamp-3">
                    {template.prompt}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};