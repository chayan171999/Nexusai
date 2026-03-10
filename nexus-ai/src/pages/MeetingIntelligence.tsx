import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Bot, FileText, CheckCircle2, Sparkles, Share2, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { Ticket } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

const defaultTranscript = `[09:00] Product: Let's plan Sprint 12. First up, the payment gateway API.
[09:01] Raunak: I can take that. I've been working on the PostgreSQL schema for it. It's probably a 5 pointer.
[09:02] Product: Great. Next is the dashboard UI redesign.
[09:03] Chayan: I'll grab that one. I have some React components ready. Let's call it 3 points.
[09:04] Product: We also have that Redis rate limiting bug.
[09:05] Alex: I'll fix it. Should be quick, maybe 2 points.
[09:06] Sara: And I need to write the Cypress test suite for the new auth flow. That's a 3.`;

const defaultActionItems = [
  { id: 1, title: 'Build Payment API Endpoint', owner: 'Raunak', type: 'Feature', sp: 5, ambiguity: 15 },
  { id: 2, title: 'Dashboard UI Redesign', owner: 'Chayan', type: 'Feature', sp: 3, ambiguity: 20 },
  { id: 3, title: 'Fix API Rate Limiting Bug', owner: 'Alex', type: 'Bug', sp: 2, ambiguity: 45 },
  { id: 4, title: 'Write Automated Test Suite', owner: 'Sara', type: 'Task', sp: 3, ambiguity: 10 },
];

interface MeetingIntelligenceProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

export function MeetingIntelligence({ tickets, setTickets }: MeetingIntelligenceProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [generatedTickets, setGeneratedTickets] = useState<Record<number, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [transcriptText, setTranscriptText] = useState(defaultTranscript);
  const [actionItems, setActionItems] = useState<any[]>([]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalyzed(false);

    if (transcriptText.trim() === defaultTranscript.trim()) {
      // Fast path for default transcript to save time and API quota
      setTimeout(() => {
        setActionItems(defaultActionItems);
        setAnalyzed(true);
        setAnalyzing(false);
      }, 1000);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Extract actionable tasks from the following meeting transcript. Return a JSON array of objects. Each object must have: title (string), owner (string, the person assigned or 'Unassigned'), type ('Feature' | 'Bug' | 'Task'), sp (number, story points 1-8), ambiguity (number, 0-100 representing how unclear the task is).\n\nTranscript:\n${transcriptText}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                owner: { type: Type.STRING },
                type: { type: Type.STRING },
                sp: { type: Type.NUMBER },
                ambiguity: { type: Type.NUMBER }
              },
              required: ["title", "owner", "type", "sp", "ambiguity"]
            }
          }
        }
      });

      const jsonStr = response.text?.trim() || '[]';
      const parsed = JSON.parse(jsonStr);
      const itemsWithIds = parsed.map((item: any, index: number) => ({
        ...item,
        id: index + 1
      }));
      setActionItems(itemsWithIds);
      setAnalyzed(true);
    } catch (error) {
      console.error("Error analyzing meeting:", error);
      alert("Failed to analyze meeting. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSyncJira = () => {
    setIsSyncing(true);
    
    setTimeout(() => {
      const newTickets: Ticket[] = actionItems
        .filter(item => generatedTickets[item.id])
        .map(item => {
          let skills: string[] = [];
          if (item.title.includes('Payment')) skills = ['Node.js', 'PostgreSQL', 'Payments'];
          else if (item.title.includes('UI')) skills = ['React', 'TypeScript', 'UI'];
          else if (item.title.includes('Rate Limiting')) skills = ['Node.js', 'Redis'];
          else if (item.title.includes('Test')) skills = ['QA', 'Cypress', 'Testing'];

          return {
            id: `NX-${Math.floor(Math.random() * 1000) + 100}`,
            title: item.title,
            skills,
            priority: item.ambiguity > 30 ? 'HIGH' : 'MED',
            sp: item.sp,
            status: 'TODO'
          };
        });

      if (newTickets.length > 0) {
        setTickets(prev => [...prev, ...newTickets]);
      }

      setIsSyncing(false);
      setSynced(true);
      setTimeout(() => setSynced(false), 3000);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex gap-6"
    >
      {/* Left Panel - Transcript */}
      <div className="flex-1 flex flex-col bg-[#1e2433] border border-white/5 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#111622]">
          <FileText className="w-5 h-5 text-gray-400" />
          <h2 className="font-display font-semibold text-white">Meeting Transcript</h2>
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-500 bg-[#2a3143] px-2 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Recording
          </div>
        </div>
        
        <textarea
          value={transcriptText}
          onChange={(e) => setTranscriptText(e.target.value)}
          className="flex-1 p-6 font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap bg-transparent resize-none focus:outline-none"
          placeholder="Paste meeting transcript here..."
        />

        <div className="p-6 border-t border-white/5 bg-[#111622] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Bot className="w-4 h-4" />
            Powered by Gemini 3.1 Pro
          </div>
          <button
            onClick={handleAnalyze}
            disabled={analyzing || analyzed}
            className={clsx(
              "px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 disabled:active:scale-100",
              analyzed 
                ? "bg-[#2a3143] text-gray-300"
                : "bg-blue-500 text-white hover:bg-blue-600"
            )}
          >
            {analyzing ? (
              <Zap className="w-4 h-4 animate-pulse" />
            ) : analyzed ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {analyzing ? 'Analyzing...' : analyzed ? 'Analysis Complete' : 'Analyze Meeting'}
          </button>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="flex-1 bg-[#1e2433] border border-white/5 rounded-xl p-6 shadow-lg overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Extracted Action Items
          </h2>
          
          {analyzed && Object.keys(generatedTickets).length > 0 && (
            <button 
              onClick={handleSyncJira}
              disabled={isSyncing || synced}
              className="bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:active:scale-100 disabled:opacity-70 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : synced ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {synced ? 'Synced to Jira' : 'Sync to Jira'}
            </button>
          )}
        </div>

        {!analyzing && !analyzed && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 pb-20">
            <Bot className="w-12 h-12 opacity-20" />
            <p>Click analyze to extract tasks and generate tickets.</p>
          </div>
        )}

        {analyzing && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 rounded-xl border border-white/5 bg-[#111622] animate-shimmer" />
            ))}
          </div>
        )}

        {analyzed && (
          <div className="space-y-4">
            {actionItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-5 rounded-xl border border-white/5 bg-[#111622] hover:border-white/10 transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">{item.title}</h3>
                    <div className="flex gap-3 text-xs font-mono text-gray-400">
                      <span className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-[#2a3143] flex items-center justify-center text-[8px] text-white">
                          {item.owner.charAt(0)}
                        </div>
                        {item.owner}
                      </span>
                      <span>•</span>
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.sp} SP</span>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#2a3143] text-gray-400">
                    Ambiguity: {item.ambiguity}%
                  </div>
                </div>

                <button
                  onClick={() => setGeneratedTickets(p => ({ ...p, [item.id]: true }))}
                  disabled={generatedTickets[item.id]}
                  className={clsx(
                    "w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 active:scale-95 disabled:active:scale-100",
                    generatedTickets[item.id]
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-[#2a3143] text-gray-300 hover:bg-[#333a4a]"
                  )}
                >
                  {generatedTickets[item.id] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Ticket Generated
                    </>
                  ) : (
                    'Generate Jira Ticket'
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
