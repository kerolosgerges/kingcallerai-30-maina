
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SettingsSidebar } from "./settings/SettingsSidebar";
import { TopBar } from "./layout/TopBar";
import { ErrorBoundary } from "./ErrorBoundary";
import { useLocation, useParams } from "react-router-dom";
import { useSubAccount } from "@/contexts/SubAccountContext";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { subAccountId } = useParams();
  const { currentSubAccount } = useSubAccount();
  
  const isSettingsPage = location.pathname.includes('/settings');

  // Fast redirect without causing re-renders - only for default subAccountId
  useEffect(() => {
    if (currentSubAccount && subAccountId === 'default' && currentSubAccount.id !== 'default') {
      const newPath = location.pathname.replace('/default/', `/${currentSubAccount.id}/`);
      // Only redirect if we're actually on a default path
      if (location.pathname.includes('/default/')) {
        window.history.replaceState(null, '', newPath);
      }
    }
  }, [currentSubAccount?.id, subAccountId, location.pathname]);

  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <ErrorBoundary>
            {isSettingsPage ? <SettingsSidebar /> : <AppSidebar />}
          </ErrorBoundary>
          <div className="flex-1 flex flex-col">
            <ErrorBoundary>
              <TopBar />
            </ErrorBoundary>
            <main className="flex-1">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};
