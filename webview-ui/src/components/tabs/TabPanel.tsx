import React from 'react';

interface TabPanelProps {
  active: boolean;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ active, children }) => (
  <div className={`tab-panel ${active ? 'active' : ''}`} role="tabpanel">
    {children}
  </div>
);