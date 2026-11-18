/**
 * AppShell.tsx
 * Persistent layout: sticky Navbar + max-w-[1440px] main content landmark.
 * Wraps all authenticated page views.
 */

import type { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      <main
        className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6"
        id="main-content"
      >
        {children}
      </main>
    </div>
  );
}
