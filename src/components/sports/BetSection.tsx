import { useState } from 'react';

export default function BetSection() {
  const [activeTab, setActiveTab] = useState<'slip' | 'open'>('slip');

  return (
    <section className="w-full overflow-hidden rounded-2xl bg-gradient-to-b from-blue-700 via-blue-900 to-black p-2 text-white mt-1.5" >
      {/* Tab */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('slip')}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition 
                        ${
                          activeTab === 'slip'
                            ? 'bg-blue-600 text-white/90'
                            : 'border bg-[#111111] border-white/20 bg-transparent  text-white/60'
                        }`}
        >
          Bet Slip
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('open')}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
            activeTab === 'open'
              ? 'border-white bg-blue-600 text-white'
              : 'border-white bg-[#111111] text-white/60'
          }`}
        >
          OPEN BETS (0)
        </button>
      </div>

      {/* Table Header */}
      {activeTab !== "slip" ? (
        <div className="grid grid-cols-[minmax(0,1.5fr)_0.7fr_0.7fr] items-center rounded-lg bg-black px-3 py-3 text-xs font-bold sm:text-sm">
        <span className="text-center">Matched Bet</span>
        <span className="text-center">Odds</span>
        <span className="text-center">Stake</span>
      </div>
      ) : (
        <div></div>
      )}



      {/* Empty State */}
      <div className="flex min-h-[180px] items-start justify-center pt-12">
        <p className="text-sm font-semibold text-white/60">
          {activeTab === 'slip' ? 'No Bets Available' : 'No Open Bets'}
        </p>
      </div>
    </section>
  );
}
