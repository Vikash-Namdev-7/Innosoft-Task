import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useGetMyProfileQuery, useGetMyWalletsQuery } from '@/store/api/userApi';

type NavbarProps = {
  onMenuClick: () => void;
};

const categories = [
  { name: 'Home', path: '/home' },
  { name: 'Inplay', path: '/sport/inplay' },
  { name: 'Cricket', path: '/sport/cricket' },
  { name: 'Football', path: '/sport/football' },
  { name: 'Tennis', path: '/sport/tennis' },
  { name: 'Kabaddi', path: '/sport/kabaddi' },
  { name: 'Casino', path: '/casino' },
];

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Only fetch when logged in
  const { data: user } = useGetMyProfileQuery(undefined, { skip: !isAuthenticated });
  const { data: wallets } = useGetMyWalletsQuery(undefined, { skip: !isAuthenticated });

  // Pick the main wallet (first item or the one with type 'main')
  const mainWallet = wallets?.find((w) => w.type === 'main') ?? wallets?.[0];

  const displayName = user?.username ?? 'User';
  const balance = (mainWallet?.balance ?? 0).toFixed(2);
  const exposure = (mainWallet?.exposure ?? 0).toFixed(2);
  // API may return bonusBalance (camelCase) or bonus_balance (snake_case)
  const bonusBalanceRaw = mainWallet?.bonusBalance ?? mainWallet?.bonus_balance ?? 0;
  const bonusBalance = Number(bonusBalanceRaw).toFixed(2);

  return (
    <div className="flex h-full w-full items-center justify-between gap-2 bg-[#0c1a37] px-3">
      {/* Logo and navigation */}
      <div className="flex min-w-0 items-center gap-2">
        {/* Hamburger: visible whenever sidebar is collapsed (< xl) */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          aria-controls="responsive-sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 xl:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <a href="/" className="flex h-9 shrink-0 items-center">
          <img
            src="https://kailash.insoftdemo.site/images/logo.png"
            alt="KailashBook"
            className="h-full max-w-[clamp(120px,18vw,260px)] object-contain"
          />
        </a>

        {/* Navigation: desktop only */}
        <nav className="hidden items-center gap-2 whitespace-nowrap px-2 lg:flex">
          {categories.map((category) => (
            <NavLink
              key={category.name}
              to={category.path}
              end={category.path === '/'}
              className={({ isActive }) =>
                `shrink-0 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#087BC1] text-white shadow-[inset_0_3px_0_#00D5B0]'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {category.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Login and Signup */}

      {isAuthenticated ? (
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="grid shrink-0 cursor-pointer grid-cols-[auto_auto] items-center gap-x-3 gap-y-0.5 rounded-md px-2 py-1 text-left text-xs leading-tight whitespace-nowrap text-white transition hover:bg-white/10 sm:px-3 sm:text-sm"
          title="Go to Profile"
        >
          <span>Bal: {balance}</span>
          <span className="font-semibold text-sky-400">{displayName}</span>
          <span className="text-gray-300">Exp: {exposure}</span>
          <span className="text-gray-300">Bonus Bal: {bonusBalance}</span>
        </button>
      ) : (
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-gray-200 sm:px-5"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="rounded-full bg-gradient-to-r from-[#00c6ad] to-[#006b9f] px-3 py-1.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-95 sm:px-5"
          >
            Signup
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
