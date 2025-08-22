import React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Tooltip } from "react-tooltip";
import { Copy } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Your initialized Firestore instance

export type Agent = {
  agent_id: string;
  saas_id?: string;
  agent_name: string;
  agent_type: string;
  model: string;
  voice: string;
  greeting: string;
  assistant_status: string;
};

function stripSaasPrefix(agent_id: string): string {
  return agent_id?.includes(":") ? agent_id.split(":")[1] : agent_id;
}

/**
 * Normalize and validate a phone number to E.164 format.
 * - Only one "+" at the start.
 * - No leading zeros after "+".
 * - Strips all invalid characters.
 * - Returns { value: string, error: string }
 */
function normalizeAndValidatePhone(input: string, country: string = "us"): { value: string, error: string } {
  let value = input.replace(/[^\d+]/g, "");
  // Only allow one "+" at the start
  if (value.startsWith("++")) value = value.replace(/^\++/, "+");
  if (value.startsWith("00")) value = "+" + value.slice(2);
  if (value.startsWith("+")) {
    value = "+" + value.slice(1).replace(/\+/g, "");
  } else {
    value = value.replace(/\+/g, "");
    value = "+" + value;
  }
  // Remove leading zeros after "+"
  value = value.replace(/^\+0+/, "+");
  // Remove all non-digits after "+"
  value = value[0] + value.slice(1).replace(/\D/g, "");

  // Validation
  let error = "";
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    error = "";
  } else if (!value.startsWith("+")) {
    error = "Phone number must start with +";
  } else if (country === "us") {
    // US: must be +1XXXXXXXXXX (11 digits, starts with +1, not +10, not +11, etc.)
    if (!/^(\+1\d{10})$/.test(value)) {
      error = "US numbers must be in format +1XXXXXXXXXX (10 digits after +1)";
    }
  } else {
    // International: at least 8 digits, max 15 (E.164)
    if (digits.length < 8 || digits.length > 15) {
      error = "Enter a valid international phone number (8-15 digits).";
    }
    if (/^\+\d{1,3}0/.test(value)) {
      error = "No leading zeros after country code.";
    }
  }
  // Log normalization and validation result
  console.log(`[TestCallModal] normalizeAndValidatePhone: input="${input}", country="${country}", normalized="${value}", error="${error}"`);
  return { value, error };
}

type TestCallModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
  onToast: (opts: { title: string; description: string; className?: string }) => void;
};

// --- Firestore Logging Helper ---
async function logCallToFirestore({
  saas_id,
  call_id,
  agent_id,
  agent_name,
  phone,
  status,
  extra,
}: {
  saas_id: string;
  call_id: string;
  agent_id: string;
  agent_name: string;
  phone: string;
  status: string;
  extra?: any;
}) {
  if (!call_id || !saas_id) return;
  try {
    await setDoc(
      doc(db, `subAccounts/${saas_id}/call-logs`, call_id),
      {
        call_id,
        agent_id,
        agent_name,
        phone,
        status,
        created_at: Date.now(),
        ...extra,
      },
      { merge: true }
    );
  } catch (e) {
    // You may add toast notification here if you want to surface the error to user
    console.error("Failed to log call to Firestore:", e);
  }
}

export function TestCallModal({
  open,
  onOpenChange,
  agent,
  onToast,
}: TestCallModalProps) {
  const [phone, setPhone] = React.useState(() => localStorage.getItem("testCallPhone") || "");
  const [calling, setCalling] = React.useState(false);
  const [callResult, setCallResult] = React.useState<null | string>(null);
  const [country, setCountry] = React.useState("us");
  const [phoneError, setPhoneError] = React.useState("");
  const [successFade, setSuccessFade] = React.useState(false);

  // For copying phone number
  const phoneInputRef = React.useRef<HTMLInputElement>(null);
  const [copyTooltip, setCopyTooltip] = React.useState("Copy");

  React.useEffect(() => {
    if (open) {
      setPhone(localStorage.getItem("testCallPhone") || "");
      setCallResult(null);
      setCalling(false);
      setCountry("us");
      setPhoneError("");
      setSuccessFade(false);
    }
  }, [open]);

  // Phone validation for call button
  React.useEffect(() => {
    if (!phone) {
      setPhoneError("");
      console.log(`[TestCallModal] Validation: phone is empty, no error.`);
      return;
    }
    if (country === "us") {
      const raw = phone.replace(/\D/g, "");
      if (raw.length === 10 || (raw.length === 11 && raw.startsWith("1"))) {
        setPhoneError("");
        console.log(`[TestCallModal] Validation: US phone "${phone}" is valid.`);
      } else {
        setPhoneError("US numbers must be 10 digits, e.g., (415) 123-4567");
        console.log(`[TestCallModal] Validation: US phone "${phone}" is invalid. Error: US numbers must be 10 digits, e.g., (415) 123-4567`);
      }
    } else {
      if (phone.replace(/\D/g, "").length < 8) {
        setPhoneError("Enter a valid international phone number.");
        console.log(`[TestCallModal] Validation: International phone "${phone}" is invalid. Error: Enter a valid international phone number.`);
      } else {
        setPhoneError("");
        console.log(`[TestCallModal] Validation: International phone "${phone}" is valid.`);
      }
    }
  }, [phone, country]);

  // Handle fade-out and close after success
  React.useEffect(() => {
    if (callResult && callResult.startsWith("Call started")) {
      setSuccessFade(true);
      const t = setTimeout(() => {
        setSuccessFade(false);
        onOpenChange(false);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [callResult, onOpenChange]);

  // Handle paste to auto-clean number
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("Text");
    let cleaned = text.replace(/[^0-9+]/g, "");
    if (cleaned.startsWith("00")) cleaned = "+" + cleaned.slice(2);
    setPhone(cleaned);
    console.log(`[TestCallModal] Phone input pasted: raw="${text}", cleaned="${cleaned}"`);
    e.preventDefault();
  };

  // Copy-to-clipboard
  const handleCopy = () => {
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopyTooltip("Copied!");
      setTimeout(() => setCopyTooltip("Copy"), 1200);
    }
  };

  async function handleCall() {
    if (!agent || !phone || phoneError) {
      console.log(`[TestCallModal] handleCall: Aborted. agent=${!!agent}, phone="${phone}", phoneError="${phoneError}"`);
      return;
    }
    setCalling(true);
    setCallResult(null);

    const formattedPhone = phone.startsWith("+") ? phone : "+" + phone;
    const payload = {
      recipient_phone_number: formattedPhone,
      agent_id: agent.agent_id,
      saas_id: agent.saas_id,
    };
    const rawPayload = JSON.stringify(payload);

    console.log(`[TestCallModal] handleCall: Sending payload to API:`, payload);

    try {
      const res = await fetch('https://voiceai.kingcaller.ai/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: rawPayload,
      });
      const rawResponse = await res.text();
      let data: any = null;
      try { data = JSON.parse(rawResponse); } catch (parseErr) {
        console.error(`[TestCallModal] handleCall: Failed to parse API response as JSON. Raw response:`, rawResponse, parseErr);
      }

      console.log(`[TestCallModal] handleCall: Raw API response:`, rawResponse);
      console.log(`[TestCallModal] handleCall: Parsed response:`, data);

      // Expecting: { status: "success", data: { call_sid, status } }
      if (res.ok && data && data.status === "success" && data.data) {
        setCallResult("Call started successfully!");
        localStorage.setItem("testCallPhone", formattedPhone);
        onToast({
          title: "Call Status",
          description: `Call status: ${data.data.status || "unknown"}`,
          className: data.data.status === "queued" ? "bg-green-600 text-white" : undefined,
        });

        // --- LOG TO FIRESTORE IF call_sid is returned ---
        if (data.data.call_sid) {
          await logCallToFirestore({
            saas_id: agent.saas_id,
            call_id: data.data.call_sid,
            agent_id: agent.agent_id,
            agent_name: agent.agent_name,
            phone: formattedPhone,
            status: data.data.status || "",
            extra: {
              triggered_at: Date.now(),
              // add more fields as needed
            }
          });
        }

      } else {
        // Try to extract error message if present
        let errorMsg = rawResponse;
        if (data && data.error) {
          errorMsg = data.error;
        } else if (data && typeof data === "object" && data.message) {
          errorMsg = data.message;
        }
        setCallResult("Call failed: " + errorMsg);
        onToast({
          title: "Call Failed",
          description: errorMsg,
          className: "bg-destructive text-white"
        });
        console.error(`[TestCallModal] handleCall: API call failed. Error: ${errorMsg}`);
      }
    } catch (err: any) {
      setCallResult("Call failed: " + err);
      onToast({
        title: "Call Failed",
        description: String(err),
        className: "bg-destructive text-white"
      });

      // Enhanced error logging for debugging "TypeError: Failed to fetch"
      console.error(`[TestCallModal] handleCall: Exception during API call.`);
      console.error(`[TestCallModal] Error object:`, err);
      console.error(`[TestCallModal] Payload:`, payload);
      console.error(`[TestCallModal] Raw payload:`, rawPayload);
      console.error(`[TestCallModal] Request URL: https://voiceai.kingcaller.ai/call`);
      console.error(`[TestCallModal] window.location.origin:`, window.location.origin);

      if (err instanceof TypeError) {
        console.error(
          `[TestCallModal] TypeError detected (e.g., "Failed to fetch"). This may be caused by:\n` +
          `- CORS issues (server not allowing requests from this origin)\n` +
          `- Network connectivity problems\n` +
          `- The endpoint (https://voiceai.kingcaller.ai/call) being unreachable or down\n` +
          `- HTTPS/SSL certificate errors\n` +
          `- Browser extensions or ad blockers interfering with requests`
        );
      }
    }
    setCalling(false);
  }

  // Allow keyboard "Enter" submit
  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !calling && !phoneError && phone && agent) {
      handleCall();
    }
  }

  // Get country label for tooltip
  function getCountryLabel() {
    if (country === "us") return "United States (+1)";
    if (country === "in") return "India (+91)";
    return country.toUpperCase();
  }

  function renderCallingHeader() {
    if (!calling) return null;
    return (
      <div className="flex items-center gap-2 mb-3">
        <span className="text-green-600 font-bold">You’re calling</span>
        <span className="font-mono text-sm">{phone}</span>
      </div>
    );
  }

  const isCallDisabled = calling || !phone || !!phoneError || !agent;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Call</DialogTitle>
          <DialogDescription>
            Enter a phone number to receive a test call from this agent.
          </DialogDescription>
        </DialogHeader>
        {agent && (
          <div className="mb-2 text-xs text-muted-foreground space-y-1">
            <div>
              <strong>Agent ID:</strong>{" "}
              <span className="break-all font-mono">{stripSaasPrefix(agent.agent_id)}</span>
            </div>
            {agent.saas_id && (
              <div>
                <strong>Tenant:</strong>{" "}
                <span className="break-all font-mono">{agent.saas_id}</span>
              </div>
            )}
          </div>
        )}
        {renderCallingHeader()}
        <div className="flex items-center gap-2 relative">
          <PhoneInput
            country={country}
            value={phone}
            enableSearch
            onChange={(value, data: any, event, formattedValue) => {
              // Always normalize and validate
              const { value: norm, error } = normalizeAndValidatePhone(value, data.countryCode || "us");
              setPhone(norm);
              setCountry(data.countryCode || "us");
              setPhoneError(error);
              console.log(`[TestCallModal] Phone input changed: raw="${value}", normalized="${norm}", country="${data.countryCode || "us"}", error="${error}"`);
            }}
            inputProps={{
              autoFocus: true,
              name: "phone",
              autoComplete: "tel",
              disabled: calling,
              onPaste: handlePaste,
              onKeyDown: handleInputKeyDown,
              ref: phoneInputRef,
            }}
            inputStyle={{
              width: "100%",
              height: 38,
              fontSize: 16,
              borderRadius: 8,
              border: phoneError ? "1px solid #f87171" : undefined,
              paddingRight: 36,
            }}
            containerStyle={{ width: "100%" }}
            buttonStyle={{ borderRadius: 8 }}
            dropdownStyle={{ zIndex: 9999 }}
          />
          {/* Copy to clipboard */}
          <button
            type="button"
            aria-label="Copy phone number"
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            onClick={handleCopy}
            disabled={!phone}
            data-tooltip-id="copy-tooltip"
            data-tooltip-content={copyTooltip}
            tabIndex={-1}
            style={{ outline: "none", border: "none", background: "transparent" }}
          >
            <Copy size={16} />
          </button>
          <Tooltip id="copy-tooltip" />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400" data-tooltip-id="country-tooltip" data-tooltip-content={getCountryLabel()}>
            <span role="img" aria-label="flag" style={{ marginRight: 2 }}>
              {country === "us" ? "🇺🇸" : country === "in" ? "🇮🇳" : "🌎"}
            </span>
            {getCountryLabel()}
          </span>
          {phoneError && (
            <span className="text-xs text-red-500" role="alert">{phoneError}</span>
          )}
          <Tooltip id="country-tooltip" />
        </div>
        <div className="text-[11px] mt-1 text-gray-400 italic">
          <span role="img" aria-label="privacy">🔒</span>
          {" We will call this number for demo/testing only. Your number will not be saved."}
        </div>
        {callResult && (
          <div
            className={`text-sm mt-2 flex items-center gap-2 ${
              callResult.startsWith("Call started")
                ? `text-green-600 transition-opacity duration-700 ${successFade ? "opacity-100" : "opacity-0"}`
                : "text-red-600"
            }`}
          >
            {callResult.startsWith("Call started") ? (
              <>
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {callResult}
              </>
            ) : (
              <>
                {callResult}
                <Button size="sm" variant="outline" onClick={handleCall} disabled={calling}>
                  Retry
                </Button>
              </>
            )}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={calling}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleCall}
            disabled={isCallDisabled}
            data-tooltip-id={isCallDisabled ? "call-tooltip" : undefined}
            data-tooltip-content={phoneError || !phone ? "Enter a valid phone number to call" : ""}
          >
            {calling ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Calling...
              </span>
            ) : "Call"}
          </Button>
          <Tooltip id="call-tooltip" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TestCallModal;
