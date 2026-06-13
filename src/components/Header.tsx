import React from 'react';
import { Search, Bell, Radio, User, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  systemReady: boolean;
  onSignOut: () => void;
  operatorName: string;
  operatorId: string;
}

export default function Header({
  currentTab,
  searchQuery,
  setSearchQuery,
  systemReady,
  onSignOut,
  operatorName,
  operatorId,
}: HeaderProps) {
  const [alertsCount, setAlertsCount] = React.useState(1);
  const [isLinked, setIsLinked] = React.useState(true);

  return (
    <header className="sticky top-0 right-0 h-14 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center px-4 w-full">
      {/* Left items - Breadcrumbs and search bar */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold font-sans text-zinc-950 dark:text-zinc-50 uppercase tracking-tight">
          System Diagnostics
        </span>
        <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
        
        {/* Breadcrumb path for selected state */}
        <div className="hidden lg:flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
          <span>ROOT</span>
          <span>/</span>
          <span>NET</span>
          <span>/</span>
          <span className="text-zinc-700 dark:text-zinc-300 font-bold">{currentTab}</span>
        </div>

        <div className="h-4 w-[1px] hidden lg:block bg-zinc-200 dark:bg-zinc-800" />

        {/* Global Search box with elegant minimal borders */}
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            className="pl-8 pr-3 py-1 text-xs font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 w-44 md:w-56 rounded transition-all placeholder:text-zinc-400"
            placeholder="Global Search..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-4">
        {/* Status dot */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 rounded">
          <span className={`w-1.5 h-1.5 rounded-full ${systemReady ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-[9px] font-mono font-bold uppercase text-zinc-500 tracking-wider">
            {systemReady ? 'STABLE' : 'UNSTABLE'}
          </span>
        </div>

        {/* Active Alert button */}
        <button 
          className="relative text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors flex items-center gap-1.5 py-1 px-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded text-[11px] font-bold uppercase tracking-wider font-sans active:scale-95"
          onClick={() => setAlertsCount(0)}
        >
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">ALERT</span>
          {alertsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          )}
        </button>

        {/* Active Link button */}
        <button 
          className={`transition-colors flex items-center gap-1.5 py-1 px-2 rounded text-[11px] font-bold uppercase tracking-wider font-sans active:scale-95 ${
            isLinked 
              ? 'text-zinc-950 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800' 
              : 'text-zinc-400 dark:text-zinc-600'
          }`}
          onClick={() => setIsLinked(!isLinked)}
        >
          <Radio className={`w-4 h-4 ${isLinked ? 'animate-pulse text-zinc-900 dark:text-zinc-100' : ''}`} />
          <span className="hidden sm:inline">LINK</span>
        </button>

        {/* User context & avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-200 dark:border-zinc-805">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold tracking-wider text-zinc-900 dark:text-zinc-100 font-mono uppercase">
              {operatorName}
            </p>
            <p className="text-[9px] text-zinc-400 font-bold tracking-widest font-mono">
              ID: {operatorId}
            </p>
          </div>
          <button 
            onClick={onSignOut}
            title="Sign Out"
            className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-950 transition-all active:scale-90"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
