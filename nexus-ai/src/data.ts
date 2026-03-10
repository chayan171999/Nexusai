import { Developer, Ticket } from './types';

export const developers: Developer[] = [
  {
    id: 'dev-1',
    name: 'Raunak',
    role: 'Senior Backend Engineer',
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'Payments', 'API'],
    load: 60,
    prs: 12,
    color: 'from-blue-500 to-cyan-400',
    avatarUrl: 'https://i.pravatar.cc/150?u=raunak',
    totalHours: 80,
    meetings: 14,
    pto: 0,
    overhead: 8,
    assignedCoding: 35,
    availableCoding: 58,
  },
  {
    id: 'dev-2',
    name: 'Chayan',
    role: 'Frontend Engineer',
    skills: ['React', 'TypeScript', 'Frontend', 'UI', 'CSS'],
    load: 45,
    prs: 8,
    color: 'from-purple-500 to-pink-400',
    avatarUrl: 'https://i.pravatar.cc/150?u=chayan',
    totalHours: 80,
    meetings: 18,
    pto: 8,
    overhead: 6,
    assignedCoding: 22,
    availableCoding: 48,
  },
  {
    id: 'dev-3',
    name: 'Alex',
    role: 'Backend Engineer',
    skills: ['Python', 'ML', 'FastAPI', 'Redis', 'Data'],
    load: 90,
    prs: 4,
    color: 'from-emerald-500 to-teal-400',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    totalHours: 80,
    meetings: 22,
    pto: 0,
    overhead: 10,
    assignedCoding: 43,
    availableCoding: 48,
  },
  {
    id: 'dev-4',
    name: 'Sara',
    role: 'QA Engineer',
    skills: ['QA', 'Testing', 'Cypress', 'Automation', 'Jest'],
    load: 30,
    prs: 15,
    color: 'from-amber-500 to-orange-400',
    avatarUrl: 'https://i.pravatar.cc/150?u=sara',
    totalHours: 80,
    meetings: 8,
    pto: 0,
    overhead: 4,
    assignedCoding: 20,
    availableCoding: 68,
  },
];

export const initialTickets: Ticket[] = [
  {
    id: 'NX-101',
    title: 'Build Payment API Endpoint',
    skills: ['Node.js', 'PostgreSQL', 'Payments'],
    priority: 'HIGH',
    sp: 5,
    status: 'TODO',
  },
  {
    id: 'NX-102',
    title: 'Dashboard UI Redesign',
    skills: ['React', 'TypeScript', 'UI'],
    priority: 'MED',
    sp: 3,
    status: 'TODO',
  },
  {
    id: 'NX-103',
    title: 'Fix API Rate Limiting Bug',
    skills: ['Node.js', 'Redis'],
    priority: 'HIGH',
    sp: 2,
    status: 'TODO',
  },
  {
    id: 'NX-104',
    title: 'Write Automated Test Suite',
    skills: ['QA', 'Cypress', 'Testing'],
    priority: 'MED',
    sp: 3,
    status: 'TODO',
  },
];

export const calculateMatchScore = (ticket: Ticket, dev: Developer) => {
  const skillsMatched = ticket.skills.filter((s) => dev.skills.includes(s));
  const skillsMissing = ticket.skills.filter((s) => !dev.skills.includes(s));
  
  const hours = ticket.sp * 4;
  const projectedCoding = dev.assignedCoding + hours;
  const projectedLoad = Math.round((projectedCoding / dev.availableCoding) * 100);

  const skillScore = (skillsMatched.length / ticket.skills.length) * 40;
  
  // Base load score on current load
  let loadScore = ((100 - dev.load) / 100) * 30;
  
  const prScore = Math.min(dev.prs * 2.5, 30);
  
  let totalScore = Math.round(skillScore + loadScore + prScore);

  // Heavy penalty if assigning this ticket pushes them over 100% capacity
  if (projectedLoad > 100) {
    totalScore -= 50; // Significant penalty to remove them from top priority
  }
  
  // Ensure score doesn't go below 0
  totalScore = Math.max(0, totalScore);
  
  return {
    devId: dev.id,
    score: totalScore,
    skillsMatched,
    skillsMissing,
  };
};
