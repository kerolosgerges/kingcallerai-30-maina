
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAgentNavigation = (hasUnsavedChanges: boolean) => {
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle browser back/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowLeaveConfirmation(true);
    } else {
      localStorage.removeItem('currentAgentData');
      localStorage.removeItem('editingMode');
      navigate(path);
    }
  };

  const confirmLeave = () => {
    setShowLeaveConfirmation(false);
    localStorage.removeItem('currentAgentData');
    localStorage.removeItem('editingMode');
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const cancelLeave = () => {
    setShowLeaveConfirmation(false);
    setPendingNavigation(null);
  };

  return {
    showLeaveConfirmation,
    setShowLeaveConfirmation,
    handleNavigation,
    confirmLeave,
    cancelLeave,
  };
};
