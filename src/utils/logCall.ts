import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust path if your db export is elsewhere

/**
 * Log a call to Firestore at `/subAccounts/{saas_id}/call-logs/{call_id}`
 *
 * @param params - Data about the call to log
 */
export async function logCallToFirestore(params: {
  saas_id: string;
  call_id: string;
  agent_id: string;
  agent_name: string;
  phone: string;
  status: string;
  extra?: Record<string, any>;
}) {
  const { saas_id, call_id, agent_id, agent_name, phone, status, extra } = params;
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
    // Optional: you may toast or handle the error elsewhere if you wish
    console.error("Failed to log call to Firestore:", e);
  }
}
