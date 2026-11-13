import { useNavigate } from "react-router-dom";

export interface RunnerOdds {
  handicap?: number;
  selectionId: number;
  sortPriority?: number;
  runnerName: string;
  status: string;

  back?: {
    price: number;
    size: number;
  }[];

  lay?: {
    price: number;
    size: number;
  }[];

  backPrice1?: number;
  backPrice2?: number;
  backPrice3?: number;

  layPrice1?: number;
  layPrice2?: number;
  layPrice3?: number;

  backSize1?: number;
  backSize2?: number;
  backSize3?: number;

  laySize1?: number;
  laySize2?: number;
  laySize3?: number;
}

export interface FixtureData {
  id: number;
  name: string;
  sport: string;
  startTime: string;
  inplay: boolean;
  status: string;
  isBookmaker: boolean;
  isFancy: boolean;
  runners: RunnerOdds[];
}

interface MatchOddsRowProps {
  match: FixtureData;
}

const MatchOddsRow = ({ match }: MatchOddsRowProps) => {
  const navigate = useNavigate();

  const openMatchDetails = () => {
    navigate(`/match/${match.id}`);
  };

  const runners = [...(match.runners ?? [])].sort(
    (a, b) => (a.sortPriority ?? 0) - (b.sortPriority ?? 0)
  );

  const getOdds = (runner: RunnerOdds, type: "back" | "lay") => {
    const prices = runner[type];

    return {
      price:
        runner[`${type}Price1`] ??
        prices?.[0]?.price,

      size:
        runner[`${type}Size1`] ??
        prices?.[0]?.size,
    };
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
          {match.inplay && (
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
          {new Date(match.startTime).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>

        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {match.isBookmaker && (
            <span className="rounded bg-white/5 px-2 py-1 text-slate-300">
              BM
            </span>
          )}

          {match.isFancy && (
            <span className="rounded bg-white/5 px-2 py-1 text-slate-300">
              F
            </span>
          )}
        </div>
      </div>

      {/* Three runner odds */}
      {[0, 1, 2].map((runnerIndex) => {
        const runner = runners[runnerIndex];

        if (!runner) {
          return (
            <div
              key={runnerIndex}
              className="grid grid-cols-2 gap-2"
            >
              <div className="rounded bg-sky-300/90 px-2 py-2 text-center text-slate-950">
                —
              </div>
              <div className="rounded bg-pink-300/90 px-2 py-2 text-center text-slate-950">
                —
              </div>
            </div>
          );
        }

        const back = getOdds(runner, "back");
        const lay = getOdds(runner, "lay");

        const locked = runner.status !== "ACTIVE";

        return (
          <div
            key={runner.selectionId}
            className="grid grid-cols-2 gap-2"
          >
            {/* Back */}
            <div className="rounded bg-sky-300/90 px-2 py-2 text-center text-slate-950">
              <p className="font-semibold">
                {locked ? "—" : back.price ?? "—"}
              </p>

              <p className="text-xs">
                {locked ? "" : back.size ?? ""}
              </p>
            </div>

            {/* Lay */}
            <div className="rounded bg-pink-300/90 px-2 py-2 text-center text-slate-950">
              <p className="font-semibold">
                {locked ? "—" : lay.price ?? "—"}
              </p>

              <p className="text-xs">
                {locked ? "" : lay.size ?? ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchOddsRow;