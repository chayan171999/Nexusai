import React from 'react';
import { ChevronRight, Zap, Calendar as CalendarIcon, Users, Link as LinkIcon } from 'lucide-react';
import { Developer } from '../types';

interface TopBarProps {
  activePage: string;
  onAutoAssign?: () => void;
  devs: Developer[];
}

export function TopBar({ activePage, onAutoAssign, devs }: TopBarProps) {
  const getPageTitle = () => {
    switch (activePage) {
      case 'assignment': return 'Smart Assignment Engine';
      case 'meeting': return 'Meeting Intelligence';
      case 'dashboard': return 'Sprint Dashboard';
      case 'capacity': return 'Team Capacity Planner';
      default: return 'Nexus AI';
    }
  };

  return (
    <div className="h-16 border-b border-white/5 bg-navy-900/50 backdrop-blur-xl fixed top-0 right-0 left-[280px] z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Nexus AI</span>
        <ChevronRight className="w-4 h-4 text-gray-600" />
        <span className="text-gray-200 font-medium">{getPageTitle()}</span>
      </div>

      <div className="flex items-center gap-6">
        {activePage === 'capacity' && (
          <div className="flex items-center gap-3 mr-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium tracking-wide">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <CalendarIcon className="w-3 h-3" />
              Google Calendar · Synced
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium tracking-wide">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Users className="w-3 h-3" />
              Workday HRIS · Synced
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium tracking-wide">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <LinkIcon className="w-3 h-3" />
              Jira · Connected
            </div>
          </div>
        )}

        <div className="flex -space-x-2">
          {devs.map((dev) => (
            <div key={dev.id} className="w-8 h-8 rounded-full border-2 border-navy-900 overflow-hidden relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${dev.color} opacity-80`} />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                {dev.name.charAt(0)}
              </div>
            </div>
          ))}
        </div>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          {activePage === 'assignment' && (
            <button 
              onClick={onAutoAssign}
              className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Auto-Assign All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


