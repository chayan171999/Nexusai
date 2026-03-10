import React from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

import { Ticket, Developer } from '../types';

interface SprintDashboardProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  devs: Developer[];
  onAssignClick: () => void;
}

export function SprintDashboard({ tickets, setTickets, devs, onAssignClick }: SprintDashboardProps) {
  const handleStatusChange = (id: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const columns = [
    {
      id: 'todo',
      title: 'Todo',
      dotColor: 'bg-gray-500',
      items: tickets.filter(t => t.status === 'TODO')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      dotColor: 'bg-blue-500',
      items: tickets.filter(t => t.status === 'IN_PROGRESS')
    },
    {
      id: 'done',
      title: 'Done',
      dotColor: 'bg-emerald-500',
      items: tickets.filter(t => t.status === 'DONE')
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 h-[calc(100vh-4rem)] flex flex-col max-w-[1600px] mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Sprint Dashboard</h1>
          <p className="text-gray-400 text-lg">Track your team's progress in real-time</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-600 rounded-xl p-6 flex flex-col justify-center shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
            <span className="text-white/90 font-medium">Sprint Success Rate</span>
          </div>
          <div className="text-5xl font-bold text-white">
            {tickets.length > 0 
              ? Math.round((tickets.filter(t => t.status === 'DONE').length / tickets.length) * 100)
              : 0}%
          </div>
        </div>
        
        <div className="bg-[#1e2433] border border-white/5 rounded-xl p-6 flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 rounded-xl bg-[#2a3143] flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <div className="text-gray-400 font-medium mb-1">Total Tickets</div>
            <div className="text-4xl font-bold text-white">{tickets.length}</div>
          </div>
        </div>
        
        <div className="bg-[#1e2433] border border-white/5 rounded-xl p-6 flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 rounded-xl bg-[#2a3143] flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <div className="text-gray-400 font-medium mb-1">Story Points</div>
            <div className="text-4xl font-bold text-white">
              {tickets.filter(t => t.status === 'DONE').reduce((acc, t) => acc + t.sp, 0)}/
              {tickets.reduce((acc, t) => acc + t.sp, 0)}
            </div>
          </div>
        </div>
        
        <div className="bg-[#1e2433] border border-white/5 rounded-xl p-6 flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 rounded-xl bg-[#2a3143] flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <div className="text-gray-400 font-medium mb-1">High Risk</div>
            <div className="text-4xl font-bold text-white">
              {tickets.filter(t => t.priority === 'HIGH').length}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-3 gap-6 min-h-0">
        {columns.map((col, i) => (
          <motion.div 
            key={col.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#1e2433] rounded-xl border border-white/5 flex flex-col overflow-hidden"
          >
            <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className={clsx("w-3 h-3 rounded-full", col.dotColor)} />
                <h3 className="text-lg font-bold text-white">{col.title}</h3>
              </div>
              <span className="text-gray-400 text-sm">{col.items.length} tickets</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {col.items.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No tickets
                </div>
              ) : (
                col.items.map((item, j) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (i * 0.1) + (j * 0.1) }}
                    className="bg-[#111622] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
                  >
                    <h4 className="text-white font-medium text-lg mb-4 leading-snug">{item.title}</h4>
                    
                    <div className="flex items-center gap-3 mb-5">
                      <span className={clsx(
                        "text-xs font-medium px-2.5 py-1 rounded",
                        item.priority === 'LOW' ? "bg-emerald-500/10 text-emerald-400" : 
                        item.priority === 'MED' ? "bg-amber-500/10 text-amber-400" : 
                        "bg-red-500/10 text-red-400"
                      )}>
                        {item.priority === 'HIGH' ? 'High' : item.priority === 'MED' ? 'Medium' : 'Low'}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-1 rounded bg-blue-500/10 text-blue-400">
                        {item.sp} pts
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-5">
                      {item.assigneeId ? (() => {
                        const dev = devs.find(d => d.id === item.assigneeId);
                        return dev ? (
                          <>
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
                              {dev.name.charAt(0)}
                            </div>
                            <span className="text-gray-300">{dev.name}</span>
                          </>
                        ) : null;
                      })() : (
                        <button 
                          onClick={onAssignClick}
                          className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-sm font-medium transition-colors"
                        >
                          Assign
                        </button>
                      )}
                    </div>

                    <div className="flex bg-[#1e2433] rounded-lg p-1 gap-1">
                      {['TODO', 'IN_PROGRESS', 'DONE'].map(status => {
                        const isActive = item.status === status;
                        let activeBg = 'bg-[#333a4a] text-white';
                        if (isActive && status === 'DONE') activeBg = 'bg-emerald-500 text-white';
                        
                        const displayStatus = status === 'TODO' ? 'Todo' : status === 'IN_PROGRESS' ? 'Progress' : 'Done';

                        return (
                          <button 
                            key={status} 
                            onClick={() => handleStatusChange(item.id, status as any)}
                            className={clsx(
                              "flex-1 text-center py-1.5 rounded-md text-xs font-medium transition-all active:scale-95",
                              isActive ? activeBg : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                            )}
                          >
                            {displayStatus}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
