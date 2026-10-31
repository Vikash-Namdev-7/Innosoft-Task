import { NavLink } from 'react-router-dom';
import { sportsCategories } from '../../data/home-page/sport';

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
  const categories = sportsCategories as SportCategory[];

  return (
    <aside className="flex h-full w-full min-w-0 flex-col overflow-hidden bg-[#0d1b36] text-white">
      {/* Only this section scrolls */}
      <nav
        aria-label="Sports categories"
        className="
    min-h-0 min-w-0 flex-1
    overflow-y-auto overflow-x-hidden
    overscroll-y-contain
    
  "
      >
        <div className="w-full min-w-0 space-y-1 px-1.5 py-1">
          {categories.map((sport) => (
            <NavLink
              key={sport.id}
              to={sport.path}
              onClick={() => onNavigate?.()}
              className={({ isActive }) =>
                `group relative flex min-h-[48px] w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-md px-2.5 py-2 transition-colors duration-200 ${
                  isActive
                    ? 'bg-sky-500/15 text-white'
                    : 'text-slate-200 hover:bg-white/[0.06] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-cyan-400" />
                  )}

                  {/* Sport icon */}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isActive
                        ? 'bg-gradient-to-br from-teal-400 to-blue-600'
                        : 'bg-gradient-to-br from-teal-500 to-sky-600'
                    }`}
                  >
                    <img
                      src={sport.icon}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="h-6 w-6 max-w-full object-contain"
                    />
                  </span>

                  {/* Sport name */}
                  <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-5">
                    {sport.name}
                  </span>

                  {isActive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />}
                </>
              )}
            </NavLink>
          ))}

          {/* Other menu */}
          <div className="mb-2 mt-5 px-2.5 pt-1 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
            Other Menu
          </div>

          <NavLink
            to="/promotions"
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `flex min-h-[48px] w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-md px-2.5 py-2 transition-colors duration-200 ${
                isActive
                  ? 'bg-sky-500/15 text-white'
                  : 'text-slate-200 hover:bg-white/[0.06] hover:text-white'
              }`
            }
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-sky-600">
              <img
                src="/sidebar/promotions.svg"
                alt=""
                aria-hidden="true"
                className="h-6 w-6 object-contain"
              />
            </span>

            <span className="min-w-0 flex-1 truncate text-[14px] font-medium">Promotions</span>
          </NavLink>
        </div>
      </nav>

      {/* Telegram stays outside the scrollable area */}
      <div className="w-full min-w-0 shrink-0 overflow-hidden border-t border-white/10 bg-[#0d1b36] p-2">
        <a
          href="https://t.me/your_channel"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-10 w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#1478c9] px-2 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1688df] active:scale-[0.98]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0"
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
