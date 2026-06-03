import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Toasts from '../../../shared/components/Toasts';
import { Toast } from '../../../types';

interface AdminLayoutProps {
  activeTab: 'dashboard' | 'users' | 'providers' | 'feed' | 'ai' | 'packages' | 'passport' | 'editorial' | 'payouts' | 'incentives';
  setActiveTab: (tab: 'dashboard' | 'users' | 'providers' | 'feed' | 'ai' | 'packages' | 'passport' | 'editorial' | 'payouts' | 'incentives') => void;
  usersCount: number;
  pendingProvidersCount: number;
  pendingPostsCount: number;
  usingLocalFallback: boolean;
  onLogout: () => void;
  firebaseEnabled: boolean;
  currentTime: string;
  toasts: Toast[];
  children: React.ReactNode;
}

export default function AdminLayout({
  activeTab,
  setActiveTab,
  usersCount,
  pendingProvidersCount,
  pendingPostsCount,
  usingLocalFallback,
  onLogout,
  firebaseEnabled,
  currentTime,
  toasts,
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Toast Alert stack absolute layout */}
      <Toasts toasts={toasts} />

      {/* STICKY SIDEBAR NAVIGATION */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        usersCount={usersCount}
        pendingProvidersCount={pendingProvidersCount}
        pendingPostsCount={pendingPostsCount}
        usingLocalFallback={usingLocalFallback}
        onLogout={onLogout}
      />

      {/* CORE WORKPLACE WRAPPER */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto block max-w-[1600px] mx-auto w-full">
        <Header
          activeTab={activeTab}
          usingLocalFallback={usingLocalFallback}
          firebaseEnabled={firebaseEnabled}
          currentTime={currentTime}
        />

        {/* Active Tab Screen Area */}
        {children}
      </main>
    </div>
  );
}
