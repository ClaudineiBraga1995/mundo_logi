'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/ui/navbar'; // <-- Importação do novo componente

export default function NarrativaPage() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-between bg-[#9eb9cc] p-6 font-sans overflow-hidden">
      {/* Navbar Global reutilizável */}
      <Navbar textoBotao="Sair" hrefBotao="/login" />

      {/* Conteúdo Central: Card de Narrativa */}
      <main className="flex flex-1 w-full items-center justify-center py-6">
        <Card className="w-full max-w-4xl h-[65vh]">
          <div className="space-y-4 text-black">
            <h2 className="text-2xl font-bold">Capítulo 1: A Jornada Começa</h2>
            <p className="text-lg leading-relaxed text-[#333]">
              Bem-vindo ao Mundo Lógi! Aqui você irá explorar os pilares do pensamento computacional. 
              Leia com atenção as instruções da fase antes de avançar para os desafios.
            </p>
          </div>
        </Card>
      </main>

      {/* Footer: Botão Iniciar Fase */}
      <footer className="mb-4 z-10 flex items-center justify-center">
        <Link href="/jogar">
          <Button id="btn-iniciar" className="w-[180px] py-[10px] text-[18px]">
            Iniciar Fase
          </Button>
        </Link>
      </footer>
    </div>
  );
}