import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoSettingsOutline,
  IoMegaphoneOutline,
  IoDocumentTextOutline,
  IoTrendingUpOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { RiBankLine } from 'react-icons/ri';
import { sportsCategories } from '../../data/home-page/sport';
import { useLogoutMutation } from '@/store/api/authApi';
import { logout } from '@/store/slices/authSlice';
import { useGetMyProfileQuery } from '@/store/api/userApi';
import type { RootState } from '@/store';

type SportCategory = {
  id: string;
  name: string;
  path: string;
  icon: string;
};

type SidebarProps = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isDemoUser = useSelector((state: RootState) => state.auth.isDemoUser);
  const { data: user } = useGetMyProfileQuery(undefined, { skip: !isAuthenticated });
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const categories = sportsCategories as SportCategory[];

  const displayName = isDemoUser
    ? 'Demo User'
    : user?.firstname
    ? `${user.firstname} ${user.lastname ?? ''}`.trim()
    : user?.username ?? 'User';

  const avatarInitial = (displayName?.[0] || 'U').toUpperCase();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(logout());
      onNavigate?.();
      navigate('/login');
    }
  };

  return (
    <aside className="flex h-full w-full min-w-0 flex-col overflow-hidden bg-[#0d1b36] text-white">
      {/* Logged-in User Profile Banner (matches reference design) */}
      {isAuthenticated && (
        <NavLink
          to="/profile"
          onClick={() => onNavigate?.()}
          className="group flex w-full shrink-0 items-center gap-3 bg-gradient-to-r from-[#1746a2] via-[#1c55bd] to-[#0c1a36] px-3.5 py-3 border-b border-white/10 shadow-sm transition hover:brightness-110"
          title="View Profile"
        >
          {/* Black Circular Avatar with Initial */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-sm ring-1 ring-white/10">
            <span className="text-base sm:text-lg font-bold uppercase leading-none">
              {avatarInitial}
            </span>
          </div>

          {/* User Display Name */}
          <div className="min-w-0 flex-1">
            <span className="block truncate text-sm sm:text-[15px] font-semibold text-white tracking-wide">
              {displayName}
            </span>
          </div>
        </NavLink>
      )}

      {/* Only this section scrolls */}
      <nav
        aria-label="Sports categories"
        className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain px-1.5 py-1.5"
      >
        <div className="w-full min-w-0 space-y-[3px]">
          {categories.map((sport) => (
            <NavLink
              key={sport.id}
              to={sport.path}
              onClick={() => onNavigate?.()}
              className={({ isActive }) =>
                `group relative flex h-[42px] w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-[3px] border px-2.5 text-white transition-all duration-150 ${
                  isActive
                    ? 'border-white bg-gradient-to-r from-[#255eb3] via-[#163c75] to-[#0d2242] shadow-sm'
                    : 'border-white/85 bg-gradient-to-r from-[#1c4582] via-[#102a54] to-[#081529] hover:border-white hover:from-[#245399] hover:via-[#143569] hover:to-[#0c1f3d]'
                }`
              }
            >
              {() => (
                <>
                  {/* Sport icon */}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-sky-600">
                    <img
                      src={sport.icon}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="h-5 w-5 max-w-full object-contain"
                    />
                  </span>

                  {/* Sport name */}
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold leading-none text-white">
                    {sport.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* OTHER MENU Header Banner (Exact replica of Image 2 in Blue style) */}
          <div className="-mx-1.5 mt-3 mb-1 flex h-8 w-[calc(100%+12px)] items-center bg-gradient-to-r from-[#1746a2] via-[#1c55bd] to-[#0c1a36] px-3.5 shadow-sm">
            <span className="text-[12px] font-bold uppercase tracking-wider text-white">
              OTHER MENU
            </span>
          </div>

          {/* 1. Promotions */}
          <NavLink
            to="/promotions"
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600/25 text-white font-semibold'
                  : 'text-gray-200 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-500 bg-transparent text-white">
              <IoMegaphoneOutline className="text-sm" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-white">
              Promotions
            </span>
          </NavLink>

          {/* 2. Bet History */}
          <NavLink
            to="/my-bets"
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600/25 text-white font-semibold'
                  : 'text-gray-200 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-500 bg-transparent text-white">
              <IoDocumentTextOutline className="text-sm" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-white">
              Bet History
            </span>
          </NavLink>

          {/* 3. Betting Profit & Loss */}
          <NavLink
            to="/my-bets"
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600/25 text-white font-semibold'
                  : 'text-gray-200 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-500 bg-transparent text-white">
              <IoTrendingUpOutline className="text-sm" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-white">
              Betting Profit & Loss
            </span>
          </NavLink>

          {/* 4. Account Statement */}
          <NavLink
            to="/account-statement"
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600/25 text-white font-semibold'
                  : 'text-gray-200 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-500 bg-transparent text-white">
              <RiBankLine className="text-sm" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-white">
              Account Statement
            </span>
          </NavLink>

          {/* 5. Stake Settings */}
          <NavLink
            to="/stake-settings"
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600/25 text-white font-semibold'
                  : 'text-gray-200 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-500 bg-transparent text-white">
              <IoSettingsOutline className="text-sm" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-white">
              Stake Settings
            </span>
          </NavLink>

          {/* LOGOUT Section Title */}
          <div className="mt-5 mb-1.5 px-3.5 text-[11px] font-bold uppercase tracking-[1.5px] text-gray-400">
            LOGOUT
          </div>

          {/* Logout Button */}
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 px-3 py-2 rounded-md text-left transition-colors hover:bg-white/5 text-gray-200 hover:text-white disabled:opacity-50"
            title="Log out from application"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-500 bg-transparent text-white">
              <IoShieldCheckmarkOutline className="text-sm" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-white">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </nav>

      {/* Telegram stays outside the scrollable area */}
      <div className="w-full min-w-0 shrink-0 overflow-hidden border-t border-white/10 bg-[#0d1b36] p-1.5">
        <a
          href="https://t.me/your_channel"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-md bg-[#1478c9] px-2 text-xs font-semibold text-white transition-colors hover:bg-[#1688df] active:scale-[0.98]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M21.8 3.2 18.5 20c-.25 1.18-.94 1.47-1.9.92l-5.25-3.87-2.53 2.44c-.28.28-.52.52-1.07.52l.38-5.34L17.85 6.8c.38-.34-.08-.53-.59-.2L5.42 14.1.3 12.5c-1.1-.34-1.12-1.1.23-1.63L20.55 3.1c.94-.34 1.76.23 1.25.1Z" />
          </svg>

          <span className="truncate">Follow on Telegram</span>
        </a>
      </div>
    </aside>
  );
}
