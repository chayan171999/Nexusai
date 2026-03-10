import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckCircle2, AlertTriangle, Lightbulb, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { Developer } from '../types';

interface TeamCapacityPlannerProps {
  devs: Developer[];
  setDevs: React.Dispatch<React.SetStateAction<Developer[]>>;
}

export function TeamCapacityPlanner({ devs, setDevs }: TeamCapacityPlannerProps) {
  const [isFixApplied, setIsFixApplied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [dismissedRecs, setDismissedRecs] = useState<Record<number, boolean>>({});

  const handleApplyFix = () => {
    setIsFixApplied(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    setDevs(prev => prev.map(dev => {
      if (dev.id === 'dev-3') {
        const newCoding = dev.assignedCoding - 8;
        return { ...dev, assignedCoding: newCoding, load: Math.round((newCoding / dev.availableCoding) * 100) };
      }
      if (dev.id === 'dev-1') {
        const newCoding = dev.assignedCoding + 8;
        return { ...dev, assignedCoding: newCoding, load: Math.round((newCoding / dev.availableCoding) * 100) };
      }
      return dev;
    }));
  };

  const dismissRec = (id: number) => {
    setDismissedRecs(prev => ({ ...prev, [id]: true }));
  };

  const getDevStatus = (dev: Developer) => {
    if (dev.load < 40) return { text: 'Underutilized', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    if (dev.load > 89) return { text: 'Overloaded ⚠', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
    if (dev.load > 74) return { text: 'At Risk', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { text: 'Optimal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  };

  const getDevTip = (dev: Developer) => {
    if (dev.id === 'dev-1') return 'Raunak has buffer. Ideal candidate for the payment gateway spike task.';
    if (dev.id === 'dev-2') return 'Chayan has PTO on Mar 18-19. Schedule dashboard review before end of week 1.';
    if (dev.id === 'dev-3') return isFixApplied ? 'Alex is back to optimal capacity.' : 'Alex is overloaded. Rate limiting bug (2SP) can be reassigned to Raunak who has matching Redis skills.';
    if (dev.id === 'dev-4') return 'Sara has significant capacity. Consider pulling in the regression test suite from backlog to this sprint.';
    return '';
  };

  const recommendations = [
    {
      id: 1,
      priority: 'High',
      color: 'text-red-400',
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      text: "Alex is overloaded (90% load, 28 coding hrs). Reassign 'Fix API Rate Limiting Bug' to Raunak — 98% skill match, 22hr buffer.",
      actionText: "Apply Fix",
      onAction: handleApplyFix,
      hideIfApplied: true
    },
    {
      id: 2,
      priority: 'Medium',
      color: 'text-amber-400',
      icon: <Info className="w-5 h-5 text-amber-400" />,
      text: "Chayan has 2 PTO days (Mar 18-19). Dashboard review meeting should be scheduled before Mar 17 to avoid blocking the frontend delivery.",
      actionText: "Schedule Review",
      onAction: () => dismissRec(2)
    },
    {
      id: 3,
      priority: 'Optimization',
      color: 'text-emerald-400',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      text: "Sara is underutilized at 30% load (68 coding hrs available). Pull in 'Regression Test Suite' (3SP) from backlog to increase sprint velocity.",
      actionText: "Add to Sprint",
      onAction: () => dismissRec(3)
    }
  ];

  // Calendar generation
  const week1 = ['10', '11', '12', '13', '14'];
  const week2 = ['17', '18', '19', '20', '21'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const getDayDots = (day: string, devId: string) => {
    if (devId === 'dev-2' && (day === '18' || day === '19')) return 'bg-amber-500'; // PTO
    if (devId === 'dev-3' && !isFixApplied && (day === '11' || day === '12' || day === '13')) return 'bg-red-500'; // Overloaded
    if (devId === 'dev-3' && day === '10') return 'bg-purple-500'; // Heavy meetings
    if (devId === 'dev-1' && day === '14') return 'bg-purple-500';
    return 'bg-blue-500'; // Coding
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-[1600px] mx-auto pb-24"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className="fixed top-20 right-8 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 font-medium"
          >
            <CheckCircle2 className="w-5 h-5" />
            ✓ Ticket reassigned to Raunak
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h1 className="text-3xl font-display font-bold text-white">Team Capacity Planner</h1>
        </div>
        <p className="text-gray-400 text-lg">Sprint #12 · Mar 10 – Mar 24, 2026 (14 days / 10 working days)</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-[#1e2433] border border-white/5 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-gray-400 mb-2 font-medium">Total Team Hours</div>
          <div className="text-3xl font-bold text-white font-mono mb-1">{devs.reduce((acc, dev) => acc + dev.totalHours, 0)} hrs</div>
          <div className="text-sm text-gray-500">Across {devs.length} developers</div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-[#1e2433] border border-white/5 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-gray-400 font-medium">Effective Coding Hours</div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-500/10 text-gray-400">
              {Math.round(100 - (devs.reduce((acc, dev) => acc + dev.availableCoding, 0) / devs.reduce((acc, dev) => acc + dev.totalHours, 0)) * 100)}% overhead
            </span>
          </div>
          <div className="text-3xl font-bold text-white font-mono mb-1">{devs.reduce((acc, dev) => acc + dev.availableCoding, 0)} hrs</div>
          <div className="text-sm text-gray-500">After meetings & overhead</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-[#1e2433] border border-white/5 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-gray-400 font-medium">Story Points Capacity</div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Healthy ✓</span>
          </div>
          <div className="text-3xl font-bold text-white font-mono mb-1">{Math.floor(devs.reduce((acc, dev) => acc + dev.availableCoding, 0) / 4)} SP</div>
          <div className="text-sm text-gray-500">Based on team velocity</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-[#1e2433] border border-white/5 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm text-gray-400 font-medium">Burnout Risk</div>
            <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded", devs.some(d => d.load >= 90) ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400")}>
              {devs.some(d => d.load >= 90) ? "⚠ Monitor" : "Healthy ✓"}
            </span>
          </div>
          <div className="text-3xl font-bold text-white font-mono mb-1">{devs.filter(d => d.load >= 90).length} Devs</div>
          <div className="text-sm text-gray-500">{devs.some(d => d.load >= 90) ? `${devs.find(d => d.load >= 90)?.name} at ${devs.find(d => d.load >= 90)?.load}% load` : 'All loads optimal'}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-8 mb-8">
        {/* Left Column - Developer Cards */}
        <div className="col-span-8 space-y-6">
          <h2 className="text-xl font-display font-semibold text-white mb-4">Developer Capacity</h2>
          
          {devs.map((dev, i) => {
            const status = getDevStatus(dev);
            const tip = getDevTip(dev);
            
            return (
              <motion.div 
                key={dev.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1e2433] border border-white/5 rounded-xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br", dev.color)}>
                        {dev.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{dev.name}</h3>
                      <div className="text-sm text-gray-400">{dev.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-3 justify-end mb-1">
                      <span className={clsx("text-xs font-bold px-2.5 py-1 rounded-md border", status.color)}>
                        {status.text}
                      </span>
                      <span className="text-3xl font-bold text-white font-mono">{dev.load}%</span>
                    </div>
                    <div className="text-xs text-gray-500">Overall Capacity</div>
                  </div>
                </div>

                {/* Stacked Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                    <span>Capacity Breakdown (80 hrs total)</span>
                  </div>
                  <div className="h-3 w-full bg-[#0b0f19] rounded-full overflow-hidden flex">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${(dev.assignedCoding / 80) * 100}%` }} transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-blue-500 border-r border-[#1e2433]" title={`Assigned Coding: ${dev.assignedCoding}h`} 
                    />
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${((dev.availableCoding - dev.assignedCoding) / 80) * 100}%` }} transition={{ duration: 1, delay: 0.25 }}
                      className="h-full bg-gray-500/20 border-r border-[#1e2433]" title={`Buffer: ${dev.availableCoding - dev.assignedCoding}h`} 
                    />
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${(dev.meetings / 80) * 100}%` }} transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-purple-500 border-r border-[#1e2433]" title={`Meetings: ${dev.meetings}h`} 
                    />
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${(dev.pto / 80) * 100}%` }} transition={{ duration: 1, delay: 0.4 }}
                      className="h-full bg-amber-500 border-r border-[#1e2433]" title={`PTO: ${dev.pto}h`} 
                    />
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${(dev.overhead / 80) * 100}%` }} transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gray-500" title={`Overhead: ${dev.overhead}h`} 
                    />
                  </div>
                  <div className="flex gap-4 mt-2 text-[10px] font-mono text-gray-400">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"/> Coding: {dev.assignedCoding}h</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"/> Meetings: {dev.meetings}h</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"/> PTO: {dev.pto}h</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-500"/> Overhead: {dev.overhead}h</div>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-[#111622] rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total Hours</div>
                    <div className="font-mono text-sm text-white">{dev.totalHours} hrs / 80 hrs</div>
                  </div>
                  <div className="bg-[#111622] rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Meeting Hours</div>
                    <div className="font-mono text-sm text-white">{dev.meetings} hrs</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                    <div className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">Coding Hours</div>
                    <div className="font-mono text-sm text-white font-bold">{dev.assignedCoding} hrs</div>
                  </div>
                  <div className="bg-[#111622] rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Available Buffer</div>
                    <div className="font-mono text-sm text-white">{dev.availableCoding - dev.assignedCoding} hrs</div>
                  </div>
                </div>

                {/* AI Suggestion Box */}
                <div className="bg-[#2a3143]/50 rounded-lg p-3 flex gap-3 items-start border border-white/5">
                  <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-300 leading-relaxed">{tip}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column - Calendar */}
        <div className="col-span-4">
          <h2 className="text-xl font-display font-semibold text-white mb-4">Sprint Calendar</h2>
          <div className="bg-[#1e2433] border border-white/5 rounded-xl p-6 shadow-sm sticky top-24">
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Week 1 (Mar 10 - Mar 14)</h4>
              <div className="grid grid-cols-5 gap-2">
                {days.map((day, i) => (
                  <div key={day} className={clsx(
                    "flex flex-col items-center p-2 rounded-lg border",
                    week1[i] === '14' ? "border-blue-500/30 bg-blue-500/5" : "border-white/5 bg-[#111622]"
                  )}>
                    <span className="text-[10px] text-gray-500 mb-1">{day}</span>
                    <span className="text-sm font-mono text-white mb-2">{week1[i]}</span>
                    <div className="flex flex-wrap justify-center gap-1 w-full px-1">
                      {devs.map(dev => (
                        <div key={dev.id} className={clsx("w-2 h-2 rounded-full", getDayDots(week1[i], dev.id))} title={dev.name} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Week 2 (Mar 17 - Mar 21)</h4>
              <div className="grid grid-cols-5 gap-2">
                {days.map((day, i) => (
                  <div key={day} className={clsx(
                    "flex flex-col items-center p-2 rounded-lg border",
                    week2[i] === '21' ? "border-amber-500/30 bg-amber-500/5" : "border-white/5 bg-[#111622]"
                  )}>
                    <span className="text-[10px] text-gray-500 mb-1">{day}</span>
                    <span className="text-sm font-mono text-white mb-2">{week2[i]}</span>
                    <div className="flex flex-wrap justify-center gap-1 w-full px-1">
                      {devs.map(dev => (
                        <div key={dev.id} className={clsx("w-2 h-2 rounded-full", getDayDots(week2[i], dev.id))} title={dev.name} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 border border-red-500/30 bg-red-500/5 rounded-lg flex items-center justify-between">
              <div>
                <div className="text-xs text-red-400 font-bold mb-0.5">Mar 24 (Mon)</div>
                <div className="text-sm text-white font-medium">Sprint Demo Day</div>
              </div>
              <Calendar className="w-5 h-5 text-red-400" />
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Legend</h4>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"/> Coding Day</div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"/> Heavy Meetings</div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"/> PTO / Leave</div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/> Overloaded</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* AI Optimization Section */}
      <div className="bg-[#1e2433] border border-white/5 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-display font-semibold text-white">⚡ AI Capacity Recommendations</h2>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {recommendations.map((rec, i) => {
              if (dismissedRecs[rec.id] || (rec.hideIfApplied && isFixApplied)) return null;
              
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#111622] border border-white/5 rounded-xl p-5 flex items-start gap-4 hover:border-white/10 transition-colors"
                >
                  <div className="mt-1 bg-[#1e2433] p-2 rounded-lg border border-white/5">
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={clsx("text-xs font-bold uppercase tracking-wider", rec.color)}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                      {rec.text}
                    </p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={rec.onAction}
                        className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all active:scale-95"
                      >
                        {rec.actionText}
                      </button>
                      <button 
                        onClick={() => dismissRec(rec.id)}
                        className="px-4 py-1.5 rounded-lg text-gray-400 text-sm font-medium hover:text-white hover:bg-white/5 transition-all active:scale-95"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {Object.keys(dismissedRecs).length === recommendations.length && !(!isFixApplied && recommendations[0].hideIfApplied) && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-8 text-gray-500 text-sm"
             >
               All recommendations reviewed. Team capacity is optimized.
             </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
