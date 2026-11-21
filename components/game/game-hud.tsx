'use client';

interface LevelOption {
  value: number;
  label: string;
}

interface GameHudProps {
  levels: LevelOption[];
  currentLevel: number;
  onSelectLevel: (level: number) => void;
  faseNivelLabel: string;
  rotinaAtual: number;
  totalRotinas: number;
  acertosAtuais: number;
  totalAcertos: number;
  vidas: number;
  noFail: boolean;
  onOpenHelp: () => void;
  onCloseGame: () => void;
}

export function GameHud({
  levels,
  currentLevel,
  onSelectLevel,
  faseNivelLabel,
  rotinaAtual,
  totalRotinas,
  acertosAtuais,
  totalAcertos,
  vidas,
  noFail,
  onOpenHelp,
  onCloseGame,
}: GameHudProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      {/* Controles Esquerdos: Ajuda e Seletor de Nível */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenHelp}
          aria-label="Ajuda"
          title="Como jogar"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-[12px] bg-[#e05252] text-[1.4rem] font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.18)] transition-transform active:translate-y-0.5 hover:bg-[#d04242]"
        >
          ?
        </button>

        <div className="flex items-center gap-2 rounded-[12px] bg-[#c8d1d9] px-3.5 py-2 text-[0.9rem] font-bold text-slate-800">
          <label htmlFor="select-nivel">NÍVEL:</label>
          <select
            id="select-nivel"
            value={currentLevel}
            onChange={(e) => onSelectLevel(Number(e.target.value))}
            className="cursor-pointer rounded-[8px] border-2 border-[#6f8dca] bg-white px-2 py-1 font-bold text-gray-800 outline-none"
          >
            {levels.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>
                {lvl.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* HUD Superior Direito */}
      <div className="flex flex-wrap items-center gap-3.5 rounded-[14px] border-2 border-[#6f8dca] bg-white px-3.5 py-2">
        <div className="flex flex-col items-center">
          <span className="text-[0.72rem] font-extrabold tracking-wider text-[#6f8dca]">
            FASE - NÍVEL
          </span>
          <span className="text-[1.1rem] font-extrabold text-gray-800">
            {faseNivelLabel}
          </span>
        </div>

        <div className="h-[30px] w-[2px] bg-[#c8d1d9]" />

        <div className="flex flex-col items-center">
          <span className="text-[0.72rem] font-extrabold tracking-wider text-[#6f8dca]">
            ROTINA
          </span>
          <span className="text-[1.1rem] font-extrabold text-gray-800">
            {rotinaAtual} / {totalRotinas}
          </span>
        </div>

        <div className="h-[30px] w-[2px] bg-[#c8d1d9]" />

        <div className="flex flex-col items-center">
          <span className="text-[0.72rem] font-extrabold tracking-wider text-[#6f8dca]">
            ACERTO
          </span>
          <div className="mt-[3px] flex gap-1">
            {Array.from({ length: totalAcertos }).map((_, idx) => (
              <span
                key={idx}
                className={`h-3.5 w-3.5 rounded-full border ${
                  idx < acertosAtuais
                    ? 'border-[#2e7d32] bg-[#4caf50]'
                    : 'border-gray-400 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {!noFail && (
          <>
            <div className="h-[30px] w-[2px] bg-[#c8d1d9]" />
            <div className="flex flex-col items-center">
              <span className="text-[0.72rem] font-extrabold tracking-wider text-[#6f8dca]">
                VIDA
              </span>
              <div className="text-[1rem] tracking-widest">
                {'❤️'.repeat(Math.max(0, vidas))}
                {'🤍'.repeat(Math.max(0, 3 - vidas))}
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onCloseGame}
          aria-label="Voltar ao menu"
          title="Menu de Fases"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[12px] bg-[#6f8dca] text-[1.1rem] font-extrabold text-white shadow-[0_4px_0_rgba(0,0,0,0.18)] transition-transform active:translate-y-0.5 hover:bg-[#5b7ab7]"
        >
          X
        </button>
      </div>
    </header>
  );
}