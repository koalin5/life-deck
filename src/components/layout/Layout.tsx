import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  hideBottomNavForModal?: boolean;
}

export function Layout({ children, showBottomNav = true, hideBottomNavForModal = false }: LayoutProps) {
  const location = useLocation();
  const hideBottomNav = location.pathname === '/onboarding' || hideBottomNavForModal;

  return (
    <div className="flex flex-col h-full bg-white">
      <Header />
      <main className="flex-1 overflow-y-auto smooth-scroll pb-safe">
        {children}
      </main>
      {showBottomNav && !hideBottomNav && <BottomNav />}
    </div>
  );
}
