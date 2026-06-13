import React from 'react';
import { TechSuiteTab } from '../types';
import { 
  Radar, 
  Terminal, 
  Cpu, 
  Bug, 
  Workflow, 
  Binary, 
  FileEdit, 
  Settings, 
  HelpCircle, 
  LogOut, 
  UserCheck 
} from 'lucide-react';

interface SidebarProps {
  activeTab: TechSuiteTab;
  setActiveTab: (tab: TechSuiteTab) => void;
  operatorName: string;
  onSignOut: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  operatorName,
  onSignOut,
}: SidebarProps) {
  
  // Icon mapper helper
  const getTabIcon = (tab: TechSuiteTab) => {
    switch (tab) {
      case TechSuiteTab.IP_SCANNER:
        return <Radar className="w-4 h-4" />;
      case TechSuiteTab.FTP_CONNECT:
        return <Terminal className="w-4 h-4" />;
      case TechSuiteTab.HW_TESTING:
        return <Cpu className="w-4 h-4" />;
      case TechSuiteTab.DBG_TESTING:
        return <Bug className="w-4 h-4" />;
      case TechSuiteTab.MQTT_CONNECTION:
        return <Workflow className="w-4 h-4" />;
      case TechSuiteTab.FLASH_PROGRAMMER:
        return <Binary className="w-4 h-4" />;
      case TechSuiteTab.CLAIM_WRITE:
        return <FileEdit className="w-4 h-4" />;
    }
  };

  return (
    <aside className="w-60 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col h-full overflow-hidden select-none">
      {/* Branding Section */}
      <div className="px-6 py-6 border-b border-zinc-100 dark:border-zinc-800/60">
        <h1 className="font-display font-bold text-lg tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
          TechSuite <span className="font-mono text-zinc-400 font-light text-sm">v2.4</span>
        </h1>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
            ADMIN MODE
          </p>
        </div>
      </div>

      {/* Main Navigation with modern minimal design styling */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        {Object.values(TechSuiteTab).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-semibold tracking-wide uppercase transition-all duration-150 relative text-left ${
                isActive
                  ? 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-[0_2px_4px_rgba(0,0,0,0.06)]'
                  : 'text-zinc-505 dark:text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-850 dark:hover:text-zinc-100'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {/* Highlight bar for active */}
              {isActive && (
                <span className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-zinc-400 dark:bg-zinc-500 rounded" />
              )}
              {getTabIcon(tab)}
              <span className="truncate">{tab}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Section */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-805 space-y-1 bg-zinc-50/50 dark:bg-zinc-950/25">
        <button 
          onClick={() => alert("Technical Settings loaded. Diagnostics configuration: Active.")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors uppercase text-left"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <button 
          onClick={() => alert("Support channels active. Hardware diagnostics manual online.")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors uppercase text-left"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Support</span>
        </button>

        {/* User control card */}
        <div className="pt-2.5 mt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-700 dark:text-zinc-300">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[100px]">
                {operatorName.split('@')[0]}
              </p>
              <p className="text-[8px] text-zinc-400 font-mono">OPERATOR</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            title="Disconnect node sessions"
            className="p-1 text-zinc-400 hover:text-red-500 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
