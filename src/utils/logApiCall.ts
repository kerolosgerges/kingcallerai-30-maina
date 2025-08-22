import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Log an OpenAI API call into Firestore at `/subAccounts/{saas_id}/api-logs/{auto-id}`
 * @param params
 */
export async function logOpenAiApiCall(params: {
  saas_id: string;
  usage: string; // e.g. "prompt_generation", "chat_completion", etc
  cost: number;
  tokens: { prompt: number; completion: number; total: number };
  response: any;
  prompt?: string;
  model?: string;
  error?: string;
}) {
  const {
    saas_id,
    usage,
    cost,
    tokens,
    response,
    prompt,
    model,
    error,
  } = params;

  const logData = {
    usage,
    cost,
    tokens,
    response,
    prompt,
    model,
    error: error || null,
    created_at: Date.now(),
  };

  // Firestore will create an auto-ID for you
  try {
    await setDoc(
      doc(db, `subAccounts/${saas_id}/api-logs`, `log_${Date.now()}`),
      logData
    );
  } catch (err) {
    // Optionally log error somewhere
    console.error("API log to Firestore failed:", err);
  }
}
