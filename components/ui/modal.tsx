'use client';

import { Button } from '@/components/ui/button';

export interface PillarData {
  id: string;
  faseTag: string;
  emoji: string;
  titulo: string;
  subtitulo: string;
  explicacao: string;
  missao: string;
  targetUrl: string;
}

interface ModalPilarProps {
  pilar: PillarData | null;
  onClose: () => void;
  onStart: (url: string) => void;
}

export function ModalPilar({ pilar, onClose, onStart }: ModalPilarProps) {
  if (!pilar) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
    >
      <div className="flex w-full max-w-[540px] flex-col items-center gap-3.5 rounded-[24px] border-4 border-[#6f8dca] bg-white px-6 py-7 text-center shadow-2xl">
        {/* Tag da Fase */}
        <span className="rounded-[20px] bg-[#6f8dca] px-4 py-1 text-[0.85rem] font-black text-white">
          {pilar.faseTag}
        </span>

        {/* Emoji */}
        <div className="text-[3.8rem] leading-none">{pilar.emoji}</div>

        {/* Título */}
        <h2 id="modal-titulo" className="text-[1.65rem] font-black text-slate-800">
          {pilar.titulo}
        </h2>

        {/* Caixa de Explicação (#c8d1d9) */}
        <div className="flex w-full flex-col gap-1.5 rounded-[16px] border-l-[6px] border-[#6f8dca] bg-[#c8d1d9] p-4">
          <span className="text-[0.78rem] font-black tracking-wide text-slate-600">
            O QUE É ESSE PILAR?
          </span>
          <p className="text-[1.02rem] font-extrabold leading-snug text-slate-900">
            {pilar.explicacao}
          </p>
        </div>

        {/* Texto da Missão */}
        <p className="text-[0.92rem] font-bold leading-snug text-slate-600">
          {pilar.missao}
        </p>

        {/* Botões de Ação */}
        <div className="mt-1.5 flex w-full justify-center gap-3.5">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-[14px] py-3.5 text-base font-extrabold shadow-[0_4px_0_#4f6ca8]"
          >
            VOLTAR
          </Button>

          <button
            type="button"
            onClick={() => onStart(pilar.targetUrl)}
            className="flex-1 rounded-[14px] bg-[#4caf50] px-5 py-3.5 text-base font-extrabold text-white shadow-[0_4px_0_#2e7d32] transition-transform active:translate-y-0.5 hover:bg-[#43a047]"
          >
            JOGAR FASE ➔
          </button>
        </div>
      </div>
    </div>
  );
}