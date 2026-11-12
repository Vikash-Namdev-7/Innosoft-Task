import { NavLink } from 'react-router-dom';
import { FaGift } from 'react-icons/fa';
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

          {/* Other menu */}
          <div className="mb-1 mt-3 px-1 text-[11px] font-bold uppercase tracking-[1.5px] text-slate-300">
            Other Menu
          </div>

          <NavLink
            to="/promotions"
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `group relative flex h-[42px] w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-[3px] border px-2.5 text-white transition-all duration-150 ${
                isActive
                  ? 'border-white bg-gradient-to-r from-[#255eb3] via-[#163c75] to-[#0d2242] shadow-sm'
                  : 'border-white/85 bg-gradient-to-r from-[#1c4582] via-[#102a54] to-[#081529] hover:border-white hover:from-[#245399] hover:via-[#143569] hover:to-[#0c1f3d]'
              }`
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-sky-600">
              <FaGift className="h-4 w-4 text-white" />
            </span>

            <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold leading-none text-white">
              Promotions
            </span>
          </NavLink>
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
