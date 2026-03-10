import React from 'react';
import { Zap, Brain, LayoutDashboard, Target, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const navItems = [
    { id: 'assignment', label: 'Smart Assignment', desc: 'AI-driven ticket routing', icon: Target },
    { id: 'meeting', label: 'Meeting Intelligence', desc: 'Extract tasks from calls', icon: Brain },
    { id: 'dashboard', label: 'Sprint Dashboard', desc: 'Real-time sprint tracking', icon: LayoutDashboard },
    { id: 'capacity', label: 'Team Capacity Planner', desc: 'Manage workload & PTO', icon: Calendar },
  ];

  return (
    <div className="w-[280px] h-screen fixed left-0 top-0 border-r border-white/5 bg-[#0b0f19] flex flex-col z-40">
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight text-white">Nexus AI</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={clsx(
                'w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all duration-200 group',
                isActive
                  ? 'bg-blue-500/10 border border-blue-500/20 shadow-sm'
                  : 'border border-transparent hover:bg-[#1e2433] hover:border-white/5'
              )}
            >
              <div className={clsx(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                isActive ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-[#1e2433] text-gray-400 group-hover:text-gray-200 group-hover:bg-[#2a3143]'
              )}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <div>
                <div className={clsx(
                  'text-base font-semibold mb-0.5 transition-colors',
                  isActive ? 'text-blue-400' : 'text-gray-300 group-hover:text-white'
                )}>
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-5 m-5 rounded-2xl bg-[#1e2433] border border-white/5 shadow-lg">
        <div className="text-xs font-mono text-gray-500 mb-2 tracking-wider">ACTIVE SPRINT</div>
        <div className="font-display font-bold text-xl text-white mb-4">Sprint #12</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-400">Progress</span>
            <span className="font-mono text-blue-400">68%</span>
          </div>
          <div className="h-2 w-full bg-[#0b0f19] rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-blue-500 rounded-full w-[68%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
