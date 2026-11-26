'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function BotaoSom() {
  const pathname = usePathname();
  const [somAtivo, setSomAtivo] = useState(true);

  // Não exibe o botão nas telas de login, cadastro e alterar senha
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/recuperar-senha'
  ) {
    return null;
  }

  const toggleSom = () => {
    setSomAtivo((prev) => !prev);
  };

  return (
    <footer className="fixed bottom-4 right-4 z-50 sm:bottom-7 sm:right-7">
      <button
        type="button"
        onClick={toggleSom}
        className="flex h-[54px] w-[54px] cursor-pointer items-center justify-center rounded-[16px] bg-[#6f8dca] shadow-md transition-transform hover:bg-[#5b7ab7] active:scale-95 sm:h-[65px] sm:w-[65px]"
        title={somAtivo ? 'Desativar Som' : 'Ativar Som'}
      >
        <Image
          src="/icons/som.svg"
          alt="Ativar/Desativar Som"
          width={45}
          height={45}
          priority
          className={`h-[36px] w-[36px] object-contain transition-opacity sm:h-[45px] sm:w-[45px] ${
            somAtivo ? 'opacity-100' : 'opacity-40'
          }`}
        />
      </button>
    </footer>
  );
}