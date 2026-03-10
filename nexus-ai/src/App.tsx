import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SmartAssignment } from './pages/SmartAssignment';
import { MeetingIntelligence } from './pages/MeetingIntelligence';
import { SprintDashboard } from './pages/SprintDashboard';
import { TeamCapacityPlanner } from './pages/TeamCapacityPlanner';
import { developers, calculateMatchScore } from './data';
import { Ticket, Developer } from './types';

export default function App() {
  const [activePage, setActivePage] = useState('assignment');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [devs, setDevs] = useState<Developer[]>(developers);

  const handleAutoAssign = () => {
    let currentDevs = [...devs];
    
    setTickets(prev => prev.map(ticket => {
      // Skip if already assigned
      if (ticket.assigneeId) return ticket;
      
      const matches = currentDevs.map(dev => calculateMatchScore(ticket, dev)).sort((a, b) => b.score - a.score);
      const bestDevId = matches[0].devId;
      
      // Update capacity for the next iteration
      const hours = ticket.sp * 4;
      currentDevs = currentDevs.map(dev => {
        if (dev.id === bestDevId) {
          const newCoding = dev.assignedCoding + hours;
          const newLoad = Math.round((newCoding / dev.availableCoding) * 100);
          return { ...dev, assignedCoding: newCoding, load: newLoad };
        }
        return dev;
      });
      
      return { ...ticket, assigneeId: bestDevId, status: 'IN_PROGRESS' };
    }));
    
    setDevs(currentDevs);
    setActivePage('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans selection:bg-blue-500/30">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <TopBar 
        activePage={activePage} 
        onAutoAssign={handleAutoAssign}
        devs={devs}
      />

      <main className="pl-[280px] pt-16 relative z-10 min-h-screen">
        {activePage === 'assignment' && (
          <SmartAssignment 
            tickets={tickets} 
            setTickets={setTickets} 
            devs={devs}
            setDevs={setDevs}
            onAssignmentComplete={() => setActivePage('dashboard')} 
          />
        )}
        {activePage === 'meeting' && (
          <MeetingIntelligence 
            tickets={tickets} 
            setTickets={setTickets} 
          />
        )}
        {activePage === 'dashboard' && (
          <SprintDashboard 
            tickets={tickets} 
            setTickets={setTickets} 
            devs={devs}
            onAssignClick={() => setActivePage('assignment')}
          />
        )}
        {activePage === 'capacity' && (
          <TeamCapacityPlanner devs={devs} setDevs={setDevs} />
        )}
      </main>
    </div>
  );
}

