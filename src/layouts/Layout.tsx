import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from '@/components/common/Navbar';
import Sidebar from '@/components/common/Sidebar';
import TrendingGamesSidebar from '@/components/sports/TrendingGamesSidebar';
import BetSection from '@/components/sports/BetSection';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const hideRightSidebar =
    pathname === '/home' || pathname === '/casino' || pathname === '/about' || pathname === '/rejection-and-decline' || pathname === '/responsible-gaming'  || pathname === '/terms-and-conditions'  || pathname.startsWith('/casino/');

  // Reset mobile menu state when switching to desktop width.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const handleResize = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  // For Bet Section
  const isMatchFetailsPage = pathname.startsWith('/match/');

  return (
    <div className="h-dvh w-full overflow-hidden bg-black text-white">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 h-14 bg-[#0d1b36]">
        <Navbar onMenuClick={() => setSidebarOpen((open) => !open)} />
      </header>

      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close sidebar"
        tabIndex={sidebarOpen ? 0 : -1}
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 xl:hidden ${
          sidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Responsive Sidebar */}
      <div
        id="responsive-sidebar"
        className={`fixed bottom-0 left-0 top-14 z-[60] w-[220px] overflow-hidden border-r border-white/10 bg-[#0d1b36] transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } xl:translate-x-0`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Horizontal line below navbar */}
      <div className="pointer-events-none fixed left-0 right-0 top-14 z-40 hidden h-px bg-white/70 lg:left-[220px] lg:block" />

      {/* Page Content */}
      <main className="ml-0 h-dvh min-w-0 overflow-x-hidden overflow-y-auto pt-14 xl:ml-[220px]">
        <div className="flex min-w-0 items-start gap-2 p-2 sm:p-2 lg:p-2">
          {/* Main route content */}
          <section className="min-w-0 flex-1">
            <Outlet />
          </section>

          {/* Right sidebar */}
          {!hideRightSidebar && (
            <aside className="hidden w-80 shrink-0 lg:block">
              {/* Bet Section: only on Match Details page */}
              {isMatchFetailsPage && <BetSection />}

              <TrendingGamesSidebar />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
