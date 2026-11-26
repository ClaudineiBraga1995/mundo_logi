'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useRedirectIfAuthenticated } from '@/hooks/use-auth-guard';

export default function Home() {
  const router = useRouter();
  const checkingAuth = useRedirectIfAuthenticated('/narrativa');

  const handleJogarSemLogin = () => {
    localStorage.clear();
    router.push('/narrativa');
  };

  if (checkingAuth) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#e5e4e4] px-4 py-5 font-sans lg:h-screen lg:overflow-hidden lg:p-0">
      {/* Cabeçalho Superior */}
      <header className="z-10 flex w-full items-center justify-center gap-4 sm:justify-end sm:px-6 lg:absolute lg:top-5 lg:right-7 lg:w-auto lg:gap-5 lg:px-0">
        <Button id="btn-config" className="px-6 py-2.5 text-base">
          Configuração
        </Button>

        <Link href="/login">
          <Button id="btn-entrar" className="px-6 py-2.5 text-base">
            Entrar
          </Button>
        </Link>
      </header>

      {/* Conteúdo Central */}
      <main className="my-auto flex flex-1 flex-col items-center justify-center gap-8 py-6 lg:mt-10 lg:flex-row lg:gap-[15vw] lg:py-0">
        {/* Coluna Esquerda: Logo + Botão Jogar + Aviso de Modo Livre */}
        <div className="flex flex-col items-center gap-6 lg:gap-[44px]">
          <Image
            src="/images/logo.png"
            alt="Mundo Lógi Logo"
            width={300}
            height={180}
            priority
            className="h-auto w-[230px] max-w-full object-contain sm:w-[270px] lg:w-[300px]"
          />

          <div className="flex flex-col items-center gap-2.5">
            <Button
              id="btn-jogar"
              type="button"
              onClick={handleJogarSemLogin}
              className="w-[180px] py-[10px] text-[18px] lg:w-[250px] lg:py-[12px] lg:text-[22px]"
            >
              Jogar
            </Button>

            <p className="max-w-[260px] text-center text-xs leading-relaxed font-semibold text-slate-600">
              Modo livre sem login (seu progresso não ficará salvo). Para salvar, clique em{' '}
              <Link href="/login" className="font-extrabold text-[#6f8dca] underline hover:text-[#5b7ab7]">
                Entrar
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Coluna Direita: Imagem Ilustrativa dos Pilares (oculta no celular) */}
        <div className="coluna-dir hidden justify-center md:flex">
          <Image
            src="/images/img_ilustrativa.png"
            alt="Pilares do Pensamento Computacional"
            width={450}
            height={400}
            priority
            className="h-auto w-[340px] max-w-full object-contain lg:w-[450px]"
          />
        </div>
      </main>
    </div>
  );
}