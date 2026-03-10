import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateMatchScore } from '../data';
import { Ticket, Developer } from '../types';
import { clsx } from 'clsx';
import { Check, Sparkles } from 'lucide-react';

interface SmartAssignmentProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  devs: Developer[];
  setDevs: React.Dispatch<React.SetStateAction<Developer[]>>;
  onAssignmentComplete: () => void;
}

export function SmartAssignment({ tickets, setTickets, devs, setDevs, onAssignmentComplete }: SmartAssignmentProps) {
  const [assignedCount, setAssignedCount] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    const assigned = tickets.filter(t => t.assigneeId);
    setAssignedCount(assigned.length);
    
    if (assigned.length > 0) {
      const totalScore = assigned.reduce((acc, t) => {
        const dev = devs.find(d => d.id === t.assigneeId);
        if (dev) {
          const { score } = calculateMatchScore(t, dev);
          return acc + score;
        }
        return acc;
      }, 0);
      setAvgScore(Math.round(totalScore / assigned.length));
    } else {
      setAvgScore(0);
    }
  }, [tickets]);

  const handleAssign = (ticketId: string, devId: string, sp: number) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assigneeId: devId, status: 'IN_PROGRESS' } : t));
    
    const hours = sp * 4; // 1 SP = 4 hours
    setDevs(prev => prev.map(dev => {
      if (dev.id === devId) {
        const newCoding = dev.assignedCoding + hours;
        const newLoad = Math.round((newCoding / dev.availableCoding) * 100);
        return { ...dev, assignedCoding: newCoding, load: newLoad };
      }
      return dev;
    }));

    onAssignmentComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-[1600px] mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Smart Assignment</h1>
        <p className="text-gray-400">AI-driven ticket distribution based on developer skills and capacity.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Tickets', value: tickets.length, suffix: '' },
          { label: 'Assigned', value: assignedCount, suffix: '' },
          { label: 'Avg Match Score', value: avgScore || '—', suffix: avgScore ? '%' : '' },
          { label: 'Team Capacity', value: 56, suffix: '%' },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#1e2433] border border-white/5 rounded-xl p-6 shadow-sm"
          >
            <div className="text-sm text-gray-400 mb-2 font-medium">{kpi.label}</div>
            <div className="text-3xl font-bold text-white flex items-baseline gap-1">
              <span>{kpi.value}</span>
              <span className="text-lg text-gray-500 font-normal">{kpi.suffix}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-2 gap-6">
        {tickets.map((ticket, i) => {
          const matches = devs.map(dev => calculateMatchScore(ticket, dev)).sort((a, b) => b.score - a.score).slice(0, 3);
          const isAssigned = !!ticket.assigneeId;

          return (
            <motion.div 
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={clsx(
                "bg-[#1e2433] border rounded-xl p-6 transition-all duration-200",
                isAssigned ? "border-blue-500/30 bg-[#1e2433]/80" : "border-white/5 hover:border-white/10"
              )}
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs text-gray-400 bg-[#2a3143] px-2 py-1 rounded-md">
                      {ticket.id}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-[#2a3143] text-gray-300">
                      {ticket.priority} Priority
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{ticket.sp} SP</span>
                  </div>
                  <h3 className="text-lg font-medium text-white leading-snug">{ticket.title}</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {ticket.skills.map(skill => (
                  <span key={skill} className="text-[11px] font-medium text-gray-400 bg-[#2a3143] px-2.5 py-1 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="space-y-2">
                {matches.map((match, rank) => {
                  const dev = devs.find(d => d.id === match.devId)!;
                  const isTopMatch = rank === 0;
                  const isThisAssigned = ticket.assigneeId === dev.id;
                  
                  const hours = ticket.sp * 4;
                  const projectedCoding = dev.assignedCoding + hours;
                  const projectedLoad = Math.round((projectedCoding / dev.availableCoding) * 100);
                  
                  return (
                    <div key={dev.id} className={clsx(
                      "flex flex-col p-3 rounded-lg border transition-all",
                      isThisAssigned ? "bg-blue-500/10 border-blue-500/20" : "bg-[#111622] border-white/5"
                    )}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-[#2a3143] flex items-center justify-center text-sm font-medium text-white border border-white/5">
                              {dev.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-200 flex items-center gap-2">
                              {dev.name}
                              {isTopMatch && !isAssigned && (
                                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">TOP MATCH</span>
                              )}
                            </div>
                            <div className="flex gap-1.5 mt-1">
                              {match.skillsMatched.map(s => <span key={s} className="text-[10px] text-gray-400">{s}</span>)}
                              {match.skillsMissing.map(s => <span key={s} className="text-[10px] text-gray-600 line-through">{s}</span>)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-5">
                          <div className="text-right w-16">
                            <div className="text-sm font-medium text-white mb-1">
                              {match.score}%
                            </div>
                            <div className="w-full h-1 bg-[#2a3143] rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-blue-500"
                                style={{ width: `${match.score}%` }}
                              />
                            </div>
                          </div>

                          {isThisAssigned ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-blue-400 text-xs font-medium">
                              <Check className="w-4 h-4" />
                              Assigned
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAssign(ticket.id, dev.id, ticket.sp)}
                              disabled={isAssigned}
                              className={clsx(
                                "px-4 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 disabled:active:scale-100",
                                isAssigned ? "opacity-0 pointer-events-none" :
                                isTopMatch 
                                  ? "bg-blue-500 text-white hover:bg-blue-600" 
                                  : "bg-[#2a3143] text-gray-300 hover:bg-[#333a4a]"
                              )}
                            >
                              Assign
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {!isAssigned && (
                        <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/5">
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Capacity Impact</span>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500 line-through">{dev.load}%</span>
                            <span className="text-gray-600">→</span>
                            <span className={clsx("font-mono font-bold", projectedLoad > 80 ? "text-red-400" : projectedLoad > 60 ? "text-amber-400" : "text-emerald-400")}>
                              {projectedLoad}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
