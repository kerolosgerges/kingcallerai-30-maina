import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Check, Copy } from "lucide-react";

// Sample Kingcaller prompt (fill with your real prompt!)
const KINGCALLER_EXAMPLE = `
You are an empathetic and efficient virtual agent for Kingcaller, 
a company that specializes in booking appointments. Your primary goal is to reduce support time while providing a seamless and friendly experience for users. 
Your tone should be understanding and patient, making users feel comfortable and valued. You are capable of scheduling, rescheduling, and canceling appointments while adhering to company guidelines. 
You can access user history for context but must protect personal data according to security best practices. Always authenticate users before accessing sensitive information. If a user's request is beyond your capabilities, escalate the issue to a human agent promptly, ensuring a smooth handover. Maintain a conversational style that is clear and concise, and always strive to resolve issues in the first interaction.

RULES
Always be professional.

Greet the user warmly at the start of the conversation, and address them by name if possible.

Listen attentively: Let users finish explaining their needs before responding.

Keep language simple, clear, and free of jargon, unless the user uses specific terms first.

Summarize and confirm requests: After the user describes their need, repeat back what you understood and confirm before taking any action.




`;

const COMPANIES = [
  { label: "Kingcaller", emoji: "📞" },
  { label: "Acme Bank", emoji: "🏦" },
  { label: "Medico", emoji: "🏥" },
  { label: "WellnessCare", emoji: "💊" },
];
const USE_CASES = [
  { label: "Report outages", emoji: "⚡" },
  { label: "Manage bills", emoji: "🧾" },
  { label: "Reset passwords", emoji: "🔑" },
  { label: "Book appointments", emoji: "📅" },
];
const GOALS = [
  { label: "Improve NPS", emoji: "🌟" },
  { label: "Reduce support time", emoji: "⏱️" },
  { label: "Cross-sell upgrades", emoji: "📈" },
];
const STYLES = [
  { label: "Empathetic", emoji: "🤗" },
  { label: "Fast", emoji: "⚡" },
  { label: "Funny", emoji: "😂" },
  { label: "Always confirms", emoji: "✅" },
];

function ChipList({ items, onClick, current, disabled }: { items: any[], onClick: (label: string) => void, current: string, disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item) => (
        <button
          type="button"
          key={item.label}
          disabled={disabled}
          className={`px-3 py-1 rounded-full border text-xs flex items-center gap-1 transition
            ${current === item.label ? "bg-indigo-100 border-indigo-400 text-indigo-900" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"}
            ${disabled ? "opacity-50 pointer-events-none" : ""}`}
          onClick={() => onClick(item.label)}
        >
          <span>{item.emoji}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export const AIPromptDesigner = ({
  open,
  onOpenChange,
  onApplyPrompt,
  onApplyWelcome,
}) => {
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [useCase, setUseCase] = useState("");
  const [goal, setGoal] = useState("");
  const [purpose, setPurpose] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<"prompt" | "welcome" | false>(false);
  const [error, setError] = useState<string | null>(null);

  const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY;

  async function generatePrompts() {
    setLoading(true);
    setError(null);
    setSystemPrompt("");
    setWelcomeMsg("");

    try {
      const systemInstruction = `
You are an expert AI prompt engineer for customer support and voice bots. Given the following company, use case, goal, style, phone number, and address, generate TWO things:
1. A *system prompt* for an enterprise-grade virtual agent, inspired by the detailed Kingcaller example below, covering:
  - Personality and tone
  - Capabilities and boundaries
  - Context/memory and conversation style
  - Security/authentication best practices
  - Best practices and escalation rules

2. A short, friendly *welcome message* (greeting) for this voice bot to say to users.

Example for inspiration:
${KINGCALLER_EXAMPLE}

--- 

Generate for:

Company: ${company}
Company phone: ${phone}
Company address: ${address}
Bot use case: ${useCase}
Business/Support goal: ${goal}
Style or special instructions: ${purpose || "none"}

Return in this JSON format:
{
  "system_prompt": "...",
  "welcome_message": "..."
}
Only return the JSON, no explanation.
      `.trim();

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemInstruction },
          ],
          max_tokens: 1200,
          temperature: 0.6,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || res.statusText);
      }
      const json = await res.json();
      const output = json.choices?.[0]?.message?.content || "";

      // Try to parse out JSON
      let parsed: { system_prompt?: string; welcome_message?: string } = {};
      try {
        parsed = JSON.parse(
          output
            .replace(/^```json/, "")
            .replace(/^```/, "")
            .replace(/```$/, "")
            .trim()
        );
      } catch (e) {
        // fallback: attempt to regex for fields
        parsed.system_prompt = output.match(/"system_prompt"\s*:\s*"([\s\S]*?)"\s*,/i)?.[1] || "";
        parsed.welcome_message = output.match(/"welcome_message"\s*:\s*"([\s\S]*?)"/i)?.[1] || "";
      }

      setSystemPrompt(parsed.system_prompt || "");
      setWelcomeMsg(parsed.welcome_message || "");
    } catch (e: any) {
      setError(e.message || "Failed to generate prompt");
    } finally {
      setLoading(false);
    }
  }

  // Disable all fields while loading or after generation (so user doesn't edit fields after getting a prompt)
  const disableInputs = loading || !!systemPrompt;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[900px] max-w-4xl h-[850px] max-h-[96vh] p-8 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <Wand2 className="inline mr-2 w-5 h-5 text-indigo-600" />
            AI Prompt Designer
          </DialogTitle>
          <DialogDescription>
            <span>
              <b>System Prompt</b> and <b>Welcome Message</b> for your voice agent.
            </span>
            <br />
            <span className="text-slate-600 text-xs">
              Quick-fill with suggestions or type your own. All fields are used to create a truly custom, safe, and helpful agent!
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-2">
          {/* Company Name & Phone (side by side) */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-xs font-semibold mb-1">Company Name <span className="ml-1">🏢</span></label>
              <Input
                className="w-full h-12 text-base"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="E.g., Kingcaller, Acme Bank, Medico..."
                autoFocus
                disabled={disableInputs}
              />
              <ChipList items={COMPANIES} current={company} onClick={setCompany} disabled={disableInputs} />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-semibold mb-1">Company Phone Number <span className="ml-1">📞</span></label>
              <Input
                className="w-full h-12 text-base"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="E.g., +1 800 123 4567"
                type="tel"
                disabled={disableInputs}
              />
            </div>
          </div>
          {/* Use Case & Address (side by side) */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-xs font-semibold mb-1">What should the bot handle? (Use case) <span className="ml-1">🤖</span></label>
              <Input
                className="w-full h-12 text-base"
                value={useCase}
                onChange={e => setUseCase(e.target.value)}
                placeholder="E.g., report outages, manage bills, reset passwords, appointment booking..."
                disabled={disableInputs}
              />
              <ChipList items={USE_CASES} current={useCase} onClick={setUseCase} disabled={disableInputs} />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-semibold mb-1">Company Address <span className="ml-1">🏠</span></label>
              <Input
                className="w-full h-12 text-base"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="E.g., 123 Main St, San Francisco, CA"
                type="text"
                disabled={disableInputs}
              />
            </div>
          </div>
          {/* Goal */}
          <div>
            <label className="block text-xs font-semibold mb-1">What's your goal? <span className="ml-1">🎯</span></label>
            <Input
              className="w-full h-12 text-base"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="E.g., improve NPS, reduce support time, cross-sell upgrades..."
              disabled={disableInputs}
            />
            <ChipList items={GOALS} current={goal} onClick={setGoal} disabled={disableInputs} />
          </div>
          {/* Purpose/Style */}
          <div>
            <label className="block text-xs font-semibold mb-1">Bot purpose/style (optional) <span className="ml-1">✨</span></label>
            <Input
              className="w-full h-12 text-base"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="E.g., empathetic, funny, always confirms, etc."
              disabled={disableInputs}
            />
            <ChipList items={STYLES} current={purpose} onClick={setPurpose} disabled={disableInputs} />
          </div>
          {/* Generate Button */}
          {!systemPrompt && (
            <Button
              onClick={generatePrompts}
              disabled={loading || !company || !useCase || !goal}
              className="w-full h-12 text-lg"
            >
              {loading ? "Generating..." : <><Wand2 className="w-4 h-4 mr-1" /> Generate Prompts</>}
            </Button>
          )}
          {error && <div className="text-xs text-red-500">{error}</div>}

          {/* Results */}
          {systemPrompt && (
            <div>
              <label className="block text-xs font-semibold mb-1">AI-Generated System Prompt</label>
              <Textarea
                className="w-full min-h-[250px] max-h-[400px] bg-slate-50 text-base"
                style={{ fontFamily: "monospace", fontSize: "16px" }}
                value={systemPrompt}
                readOnly
              />
              <div className="flex gap-2 mt-2">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    onApplyPrompt(systemPrompt);
                    if (welcomeMsg) onApplyWelcome(welcomeMsg);
                    onOpenChange(false);
                  }}
                >
                  Auto Apply
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Copy prompt"
                  onClick={() => {
                    navigator.clipboard.writeText(systemPrompt);
                    setCopied("prompt");
                    setTimeout(() => setCopied(false), 1300);
                  }}
                >
                  {copied === "prompt" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
          {welcomeMsg && (
            <div className="mt-6">
              <label className="block text-xs font-semibold mb-1">AI-Generated Welcome Message</label>
              <Textarea
                className="w-full min-h-[80px] max-h-[180px] bg-slate-50 text-base"
                style={{ fontFamily: "monospace", fontSize: "16px" }}
                value={welcomeMsg}
                readOnly
              />
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onApplyWelcome(welcomeMsg);
                    onOpenChange(false);
                  }}
                >
                  Apply Welcome Only
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Copy welcome"
                  onClick={() => {
                    navigator.clipboard.writeText(welcomeMsg);
                    setCopied("welcome");
                    setTimeout(() => setCopied(false), 1300);
                  }}
                >
                  {copied === "welcome" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" className="w-full h-12" onClick={() => onOpenChange(false)} disabled={loading}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
