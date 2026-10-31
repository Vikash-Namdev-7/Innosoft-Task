
import { useNavigate } from "react-router-dom";

export interface OddsCellData {
  price: string;
  size: string;
  locked?: boolean;
}

export interface MatchRowData {
  id: string;
  sport: string;
  name: string;
  date: string;
  live: boolean;
  showBM: boolean;
  showF: boolean;
  showTV: boolean;
  odds: OddsCellData[];
}

interface MatchOddsRowProps {
  match: MatchRowData;
}

const MatchOddsRow = ({ match }: MatchOddsRowProps) => {
  const navigate = useNavigate();

  const openMatchDetails = () => {
    navigate(`/sport/match/${match.id}`);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openMatchDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openMatchDetails();
        }
      }}
      className="grid cursor-pointer grid-cols-1 gap-3 border-b border-white/10 bg-slate-900/70 p-3 transition hover:bg-slate-800/90 sm:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(90px,120px))] sm:items-center"
    >
      {/* Match information */}
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {match.live && (
            <span className="rounded bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
              LIVE
            </span>
          )}

          <span className="text-xs capitalize text-slate-400">
            {match.sport}
          </span>
        </div>

        <h3 className="truncate font-semibold text-white">
          {match.name}
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          {match.date}
        </p>

        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {match.showBM && (
            <span className="rounded bg-white/5 px-2 py-1 text-slate-300">
              BM
            </span>
          )}

          {match.showF && (
            <span className="rounded bg-white/5 px-2 py-1 text-slate-300">
              F
            </span>
          )}

          {match.showTV && (
            <span className="rounded bg-white/5 px-2 py-1 text-slate-300">
              TV
            </span>
          )}
        </div>
      </div>

      {/* Three runner odds */}
      {[0, 1, 2].map((runnerIndex) => {
        const back = match.odds[runnerIndex * 2];
        const lay = match.odds[runnerIndex * 2 + 1];

        return (
          <div
            key={runnerIndex}
            className="grid grid-cols-2 gap-2"
          >
            <div className="rounded bg-sky-300/90 px-2 py-2 text-center text-slate-950">
              <p className="font-semibold">
                {back?.locked ? "—" : back?.price || "—"}
              </p>
              <p className="text-xs">
                {back?.locked ? "" : back?.size || ""}
              </p>
            </div>

            <div className="rounded bg-pink-300/90 px-2 py-2 text-center text-slate-950">
              <p className="font-semibold">
                {lay?.locked ? "—" : lay?.price || "—"}
              </p>
              <p className="text-xs">
                {lay?.locked ? "" : lay?.size || ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchOddsRow;
