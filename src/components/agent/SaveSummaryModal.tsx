import React from "react";

interface SaveSummaryModalProps {
  open: boolean;
  onClose: () => void;
  selectedModel: string;
  selectedVoice: string;
  selectedVoiceName?: string;
  prompt: string;
}

export const SaveSummaryModal: React.FC<SaveSummaryModalProps> = ({
  open,
  onClose,
  selectedModel,
  selectedVoice,
  selectedVoiceName,
  prompt,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Save Summary</h2>
        <div className="mb-3">
          <div className="font-medium">AI Model:</div>
          <div className="text-slate-700">{selectedModel}</div>
        </div>
        <div className="mb-3">
          <div className="font-medium">Voice:</div>
          <div className="text-slate-700">
            {selectedVoiceName ? (
              <>
                {selectedVoiceName} <span className="text-xs text-slate-400">({selectedVoice})</span>
              </>
            ) : (
              selectedVoice
            )}
          </div>
        </div>
        <div className="mb-3">
          <div className="font-medium">System Prompt:</div>
          <div className="bg-slate-100 rounded p-2 text-slate-800 whitespace-pre-wrap max-h-40 overflow-auto">
            {prompt || <span className="text-slate-400 italic">No prompt provided.</span>}
          </div>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};