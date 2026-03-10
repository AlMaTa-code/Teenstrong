import { useState } from 'react';

const tabs = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'program', label: 'Program', icon: ProgramIcon },
  { id: 'progress', label: 'Progress', icon: ProgressIcon },
];

function HomeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--accent)' : 'var(--text-dim)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ProgramIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--accent)' : 'var(--text-dim)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ProgressIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--accent)' : 'var(--text-dim)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="app-container fixed bottom-0 left-0 right-0 flex justify-around items-center py-2 px-4 z-50"
      style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
            className="flex flex-col items-center gap-1 py-1 px-4 bg-transparent min-w-[60px] min-h-[44px]"
          >
            <Icon active={active} />
            <span className="text-xs" style={{ color: active ? 'var(--accent)' : 'var(--text-dim)' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
