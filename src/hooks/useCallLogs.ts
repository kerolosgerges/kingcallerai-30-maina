import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSubAccount } from "@/contexts/SubAccountContext";

export type CallLog = {
  id: string;
  call_id: string;
  agent_id: string;
  agent_name?: string;
  phone?: string;
  status?: string;
  created_at?: number;
  // add more fields as needed, e.g., duration, outcome, direction, etc.
};

export function useCallLogs(searchTerm = "") {
  const location = useLocation();
  const { currentSubAccount } = useSubAccount();
  
  // Only load call logs when on call logs page
  const isCallLogsPage = location.pathname.includes('/call-logs');
  
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(() => {
    if (!isCallLogsPage || !currentSubAccount?.id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const fetchLogs = async () => {
      try {
        const ref = collection(db, `subAccounts/${currentSubAccount.id}/call-logs`);
        let q = query(ref, orderBy("created_at", "desc"), limit(200));
        const snap = await getDocs(q);
        let logs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CallLog[];
        // Simple text search (agent_name, phone, etc)
        if (searchTerm) {
          logs = logs.filter(
            log =>
              log.call_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              log.agent_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              log.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              log.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              log.status?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setCallLogs(logs);
      } catch (e) {
        setCallLogs([]);
      }
      setIsLoading(false);
    };
    fetchLogs();
  }, [searchTerm, refreshFlag, isCallLogsPage, currentSubAccount?.id]);

  const refresh = () => setRefreshFlag(f => f + 1);

  return { callLogs, isLoading, refresh };
}
