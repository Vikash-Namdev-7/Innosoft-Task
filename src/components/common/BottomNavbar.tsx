import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CirclePlay,
  Trophy,
  House,
  Clock,
  CircleUser,
  LucideProps,
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  path?: string;
  icon: React.ComponentType<LucideProps>;
}

const navItems: NavItem[] = [
  { id: 'inplay', name: 'In-play', path: '/sport/inplay', icon: CirclePlay },
  { id: 'casino', name: 'Casino', path: '/casino', icon: Trophy },
  { id: 'home', name: 'Home', path: '/home', icon: House },
  { id: 'mybets', name: 'My Bets', path: '/my-bets', icon: Clock },
  { id: 'profile', name: 'Profile', path: '/profile', icon: CircleUser },
];

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const getIsActive = (item: NavItem) => {
    if (selectedTab && !item.path) {
      return selectedTab === item.name;
    }
    if (item.path) {
      if (item.path === '/sport/inplay') {
        return location.pathname === '/sport/inplay';
      }
      if (item.path === '/home') {
        return location.pathname === '/home' || location.pathname === '/';
      }
      if (item.path === '/casino') {
        return location.pathname.startsWith('/casino');
      }
      if (item.path === '/my-bets') {
        return location.pathname === '/my-bets';
      }
      if (item.path === '/profile') {
        return location.pathname === '/profile';
      }
    }
    return selectedTab === item.name;
  };

  const handleTabClick = (item: NavItem) => {
    setSelectedTab(item.name);
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-50 h-[60px] overflow-hidden rounded-t-2xl bg-[#071426] shadow-[0_-4px_25px_rgba(0,0,0,0.6)] sm:rounded-t-3xl xl:hidden"
    >
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = getIsActive(item);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item)}
              className={`relative flex h-full flex-col items-center justify-center pt-0.5 pb-1 transition-all ${
                isActive
                  ? 'border-t-2 border-white bg-[#0c2340]'
                  : 'border-t-2 border-transparent bg-[#071426] hover:bg-[#091a33]'
              }`}
            >
              <Icon
                className={`h-6 w-6 transition-colors sm:h-[26px] sm:w-[26px] ${
                  isActive ? 'text-[#00c4f4]' : 'text-[#5a7692]'
                }`}
                strokeWidth={isActive ? 2.2 : 2}
              />
              <span
                className={`mt-1 text-[11px] leading-tight tracking-tight transition-colors ${
                  isActive
                    ? 'font-bold text-white'
                    : 'font-semibold text-[#5a7692]'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
