// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { ModalPilar, PillarData } from '@/components/ui/modal';
// import Image from 'next/image';

// const PILLARS_INFO: PillarData[] = [
//   {
//     id: 'decomposicao',
//     faseTag: 'FASE 1',
//     emoji: '🎒',
//     titulo: 'DECOMPOSIÇÃO',
//     subtitulo: 'ARRUMAR A MOCHILA ESCOLAR',
//     explicacao:
//       'DECOMPOR É QUEBRAR UM PROBLEMA GRANDE EM PARTES MENORES E MAIS FÁCEIS DE RESOLVER!',
//     missao:
//       'NA FASE 1, VOCÊ VAI DIVIDIR OS MATERIAIS ESCOLARES NOS COMPARTIMENTOS CERTOS DA MOCHILA RESPEITANDO O ESPAÇO DE CADA BOLSO.',
//     targetUrl: '/fases/fase1-decomposicao',
//   },
//   {
//     id: 'abstracao',
//     faseTag: 'FASE 2',
//     emoji: '🥪',
//     titulo: 'ABSTRAÇÃO',
//     subtitulo: 'LANCHEIRA NA MEDIDA CERTA',
//     explicacao:
//       'ABSTRAIR É FOCAR APENAS NO QUE É IMPORTANTE PARA O PROBLEMA E DEIXAR DE LADO O QUE NÃO PRECISA!',
//     missao:
//       'NA FASE 2, OBSERVE O CLIMA NA JANELA E ESCOLHA APENAS OS LANCHES IDEAIS PARA O PASSEIO, IGNORANDO BRINQUEDOS E OBJETOS DISTRATORES.',
//     targetUrl: '/fases/fase2-abstracao',
//   },
//   {
//     id: 'padroes',
//     faseTag: 'FASE 3',
//     emoji: '🍽️',
//     titulo: 'RECONHECIMENTO DE PADRÕES',
//     subtitulo: 'GUARDANDO A LOUÇA LIMPA',
//     explicacao:
//       'RECONHECER PADRÕES É ENCONTRAR CARACTERÍSTICAS PARECIDAS, COMO FORMA, COR OU ESTADO, PARA AGRUPAR OBJETOS!',
//     missao:
//       'NA FASE 3, SEPARE AS LOUÇAS LIMPAS DAS SUJAS E ORGANIZE PRATOS, COPOS E TALHERES NAS BANDEJAS CERTAS.',
//     targetUrl: '/fases/fase3-padroes',
//   },
//   {
//     id: 'algoritmo',
//     faseTag: 'FASE 4',
//     emoji: '🧼',
//     titulo: 'ALGORITMO',
//     subtitulo: 'LAVAR AS MÃOS E FAZER SUCO',
//     explicacao:
//       'ALGORITMO É UM PASSO A PASSO ORDENADO DE INSTRUÇÕES QUE SEGUIMOS DO COMEÇO AO FIM PARA COMPLETAR UMA TAREFA!',
//     missao:
//       'NA FASE 4, COLOQUE AS AÇÕES NA ORDEM CERTA (1, 2, 3...) PARA LAVAR AS MÃOS OU PREPARAR UM SUCO E CLIQUE EM EXECUTAR.',
//     targetUrl: '/fases/fase4-algoritmo',
//   },
// ];

// export default function NarrativaPage() {
//   const router = useRouter();
//   const [selectedPillar, setSelectedPillar] = useState<PillarData | null>(null);

//   const playClickSound = () => {
//     try {
//       const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
//       const ctx = new AudioCtx();
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.connect(gain);
//       gain.connect(ctx.destination);
//       osc.type = 'sine';
//       osc.frequency.setValueAtTime(587.33, ctx.currentTime); // Nota Ré
//       gain.gain.setValueAtTime(0.12, ctx.currentTime);
//       gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
//       osc.start();
//       osc.stop(ctx.currentTime + 0.18);
//     } catch {
//       // Ignora caso o navegador bloqueie áudio antes de interação
//     }
//   };

//   const handleSelectPillar = (pillar: PillarData) => {
//     playClickSound();
//     setSelectedPillar(pillar);
//   };

//   const handleCloseModal = () => {
//     playClickSound();
//     setSelectedPillar(null);
//   };

//   const handleStartPhase = (url: string) => {
//     playClickSound();
//     setTimeout(() => {
//       router.push(url);
//     }, 150);
//   };

//   return (
//     <div className="flex min-h-screen w-full items-center justify-center bg-[#e5e4e4] p-5 font-sans text-gray-800 select-none">
//       <main className="flex w-full max-w-[1080px] flex-col gap-5 rounded-[24px] border-[3px] border-[#c8d1d9] bg-[#e5e4e4] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.08)]">
//         {/* CABEÇALHO SUPERIOR */}
//         <header className="flex flex-wrap items-center justify-between gap-3.5">
//           <div className="flex items-center gap-2">
//             {/* Contêiner com tamanho fixo que recorta a área transparente excedente */}
//             <div className="relative flex h-[65px] w-[65px] items-center justify-center overflow-hidden">
//               <Image
//                 src="/images/logo_2.svg"
//                 alt="Mundo Lógi Logo"
//                 width={120}
//                 height={120}
//                 priority
//                 /* scale-[1.8] aumenta o desenho interno sem expandir a caixa do cabeçalho */
//                 className="h-full w-full scale-[1.8] object-contain"
//               />
//             </div>

//             <div>
//               <h1 className="text-[1.9rem] font-black leading-tight tracking-wide text-[#6f8dca]">
//                 MUNDO LÓGI
//               </h1>
//               <p className="text-[0.85rem] font-extrabold text-slate-600">
//                 PENSAMENTO COMPUTACIONAL NO DIA A DIA
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <Link href="/login">
//               <Button className="rounded-[14px] px-5 py-3 text-[0.95rem] font-extrabold shadow-[0_4px_0_#4f6ca8]">
//                 SAIR
//               </Button>
//             </Link>
//           </div>
//         </header>

//         {/* BLOCO DE BOAS-VINDAS (#c8d1d9) */}
//         <section className="flex flex-col gap-1.5 rounded-[18px] border-l-[8px] border-[#6f8dca] bg-[#c8d1d9] px-[22px] py-[18px] text-center">
//           <h2 className="text-[1.3rem] font-black text-slate-800">
//             OLÁ, EXPLORADOR! 👋
//           </h2>
//           <p className="text-[0.98rem] font-bold text-slate-700">
//             ESCOLHA UM DOS QUATRO PILARES DO PENSAMENTO COMPUTACIONAL ABAIXO PARA APRENDER BRINCANDO COM TAREFAS DO DIA A DIA.
//           </p>
//         </section>

//         {/* GRADE COM OS 4 BOTÕES DOS PILARES */}
//         <section
//           className="grid grid-cols-1 gap-[18px] md:grid-cols-2"
//           aria-label="Pilares do Pensamento Computacional"
//         >
//           {PILLARS_INFO.map((pilar) => (
//             <button
//               key={pilar.id}
//               type="button"
//               onClick={() => handleSelectPillar(pilar)}
//               className="relative flex cursor-pointer flex-col items-center justify-between gap-2.5 rounded-[20px] border-4 border-[#6f8dca] bg-white px-[18px] py-[22px] text-center shadow-[0_6px_0_#6f8dca] transition-all duration-150 hover:-translate-y-1 hover:bg-slate-50 active:translate-y-0.5 active:shadow-[0_2px_0_#6f8dca]"
//             >
//               <span className="rounded-[20px] bg-[#c8d1d9] px-3 py-1 text-[0.78rem] font-black text-slate-800">
//                 {pilar.faseTag}
//               </span>

//               <span className="text-[3.4rem] leading-none">{pilar.emoji}</span>

//               <h3 className="text-[1.25rem] font-black text-slate-800">
//                 {pilar.titulo}
//               </h3>

//               <span className="text-[0.85rem] font-bold text-slate-500">
//                 {pilar.subtitulo}
//               </span>

//               <span className="mt-1.5 w-[85%] rounded-[12px] bg-[#6f8dca] px-5 py-2.5 text-[0.9rem] font-extrabold text-white">
//                 ESCOLHER PILAR
//               </span>
//             </button>
//           ))}
//         </section>
//       </main>

//       {/* MODAL EXPLICATIVO DO PILAR SELECIONADO */}
//       <ModalPilar
//         pilar={selectedPillar}
//         onClose={handleCloseModal}
//         onStart={handleStartPhase}
//       />
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModalPilar, PillarData } from '@/components/ui/modal';
import Image from 'next/image';

const PILLARS_INFO: PillarData[] = [
  {
    id: 'decomposicao',
    faseTag: 'FASE 1',
    emoji: '🎒',
    titulo: 'DECOMPOSIÇÃO',
    subtitulo: 'ARRUMAR A MOCHILA ESCOLAR',
    explicacao:
      'DECOMPOR É QUEBRAR UM PROBLEMA GRANDE EM PARTES MENORES E MAIS FÁCEIS DE RESOLVER!',
    missao:
      'NA FASE 1, VOCÊ VAI DIVIDIR OS MATERIAIS ESCOLARES NOS COMPARTIMENTOS CERTOS DA MOCHILA RESPEITANDO O ESPAÇO DE CADA BOLSO.',
    targetUrl: '/fases/fase1-decomposicao',
  },
  {
    id: 'abstracao',
    faseTag: 'FASE 2',
    emoji: '🥪',
    titulo: 'ABSTRAÇÃO',
    subtitulo: 'LANCHEIRA NA MEDIDA CERTA',
    explicacao:
      'ABSTRAIR É FOCAR APENAS NO QUE É IMPORTANTE PARA O PROBLEMA E DEIXAR DE LADO O QUE NÃO PRECISA!',
    missao:
      'NA FASE 2, OBSERVE O CLIMA NA JANELA E ESCOLHA APENAS OS LANCHES IDEAIS PARA O PASSEIO, IGNORANDO BRINQUEDOS E OBJETOS DISTRATORES.',
    targetUrl: '/fases/fase2-abstracao',
  },
  {
    id: 'padroes',
    faseTag: 'FASE 3',
    emoji: '🍽️',
    titulo: 'RECONHECIMENTO DE PADRÕES',
    subtitulo: 'GUARDANDO A LOUÇA LIMPA',
    explicacao:
      'RECONHECER PADRÕES É ENCONTRAR CARACTERÍSTICAS PARECIDAS, COMO FORMA, COR OU ESTADO, PARA AGRUPAR OBJETOS!',
    missao:
      'NA FASE 3, SEPARE AS LOUÇAS LIMPAS DAS SUJAS E ORGANIZE PRATOS, COPOS E TALHERES NAS BANDEJAS CERTAS.',
    targetUrl: '/fases/fase3-padroes',
  },
  {
    id: 'algoritmo',
    faseTag: 'FASE 4',
    emoji: '🧼',
    titulo: 'ALGORITMO',
    subtitulo: 'LAVAR AS MÃOS E FAZER SUCO',
    explicacao:
      'ALGORITMO É UM PASSO A PASSO ORDENADO DE INSTRUÇÕES QUE SEGUIMOS DO COMEÇO AO FIM PARA COMPLETAR UMA TAREFA!',
    missao:
      'NA FASE 4, COLOQUE AS AÇÕES NA ORDEM CERTA (1, 2, 3...) PARA LAVAR AS MÃOS OU PREPARAR UM SUCO E CLIQUE EM EXECUTAR.',
    targetUrl: '/fases/fase4-algoritmo',
  },
];

export default function NarrativaPage() {
  const router = useRouter();
  const [selectedPillar, setSelectedPillar] = useState<PillarData | null>(null);
  const [showLogoPopover, setShowLogoPopover] = useState<boolean>(false);

  const playClickSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // Nota Ré
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignora caso o navegador bloqueie áudio antes de interação
    }
  };

  const handleSelectPillar = (pillar: PillarData) => {
    playClickSound();
    setSelectedPillar(pillar);
  };

  const handleCloseModal = () => {
    playClickSound();
    setSelectedPillar(null);
  };

  const handleStartPhase = (url: string) => {
    playClickSound();
    setTimeout(() => {
      router.push(url);
    }, 150);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#e5e4e4] p-4 font-sans text-gray-800 select-none sm:p-5">
      <main className="flex w-full max-w-[1080px] flex-col gap-5 rounded-[24px] border-[3px] border-[#c8d1d9] bg-[#e5e4e4] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.08)] sm:p-6">
        {/* CABEÇALHO SUPERIOR */}
        <header className="flex flex-wrap items-center justify-between gap-3.5">
          <div className="flex items-center gap-3">
            {/* WRAPPER DA LOGO COM HOVER E POPOVER DOS 4 PILARES */}
            <div
              className="group relative"
              onMouseEnter={() => setShowLogoPopover(true)}
              onMouseLeave={() => setShowLogoPopover(false)}
              onClick={() => setShowLogoPopover((prev) => !prev)}
            >
              {/* Contêiner da Logo com destaque visual sutil no hover */}
              <div
                className="relative flex h-[65px] w-[65px] cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border-2 border-transparent transition-all duration-200 group-hover:border-[#6f8dca] group-hover:bg-[#7d99d1]/20"
                title="Passe o mouse para ver o significado das letras D P A A"
              >
                <Image
                  src="/images/logo_2.svg"
                  alt="Mundo Lógi Logo"
                  width={120}
                  height={120}
                  priority
                  className="h-full w-full scale-[1.8] object-contain"
                />
              </div>

              {/* CARD FLUTUANTE COM O SIGNIFICADO DE CADA LETRA */}
              <div
                className={`absolute top-[74px] left-0 z-40 w-[270px] flex-col items-center gap-3 rounded-[20px] border-[3px] border-[#6f8dca] bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-all duration-200 sm:w-[290px] ${
                  showLogoPopover
                    ? 'pointer-events-auto translate-y-0 opacity-100 flex'
                    : 'pointer-events-none -translate-y-2 opacity-0 hidden group-hover:flex group-hover:translate-y-0 group-hover:opacity-100'
                }`}
              >
                {/* Tag Superior */}
                <span className="rounded-[20px] bg-[#c8d1d9] px-3.5 py-1 text-[0.76rem] font-black tracking-wide text-slate-800">
                  OS 4 PILARES DO MUNDO LÓGI
                </span>

                {/* Imagem Ilustrativa com o significado de D, P, A, A */}
                <div className="flex w-full items-center justify-center py-1">
                  <Image
                    src="/images/img_ilustrativa.png"
                    alt="Significado das letras: Decomposição, Reconhecimento de Padrões, Abstração e Algoritmo"
                    width={240}
                    height={210}
                    className="h-auto w-[210px] object-contain sm:w-[230px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-[1.5rem] font-black leading-tight tracking-wide text-[#6f8dca] sm:text-[1.9rem]">
                MUNDO LÓGI
              </h1>
              <p className="text-[0.78rem] font-extrabold text-slate-600 sm:text-[0.85rem]">
                PENSAMENTO COMPUTACIONAL NO DIA A DIA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button className="rounded-[14px] px-5 py-3 text-[0.95rem] font-extrabold shadow-[0_4px_0_#4f6ca8]">
                SAIR
              </Button>
            </Link>
          </div>
        </header>

        {/* BLOCO DE BOAS-VINDAS (#c8d1d9) */}
        <section className="flex flex-col gap-1.5 rounded-[18px] border-l-[8px] border-[#6f8dca] bg-[#c8d1d9] px-[18px] py-[16px] text-center sm:px-[22px] sm:py-[18px]">
          <h2 className="text-[1.15rem] font-black text-slate-800 sm:text-[1.3rem]">
            OLÁ, EXPLORADOR! 👋
          </h2>
          <p className="text-[0.9rem] font-bold text-slate-700 sm:text-[0.98rem]">
            ESCOLHA UM DOS QUATRO PILARES DO PENSAMENTO COMPUTACIONAL ABAIXO PARA APRENDER BRINCANDO COM TAREFAS DO DIA A DIA.
          </p>
        </section>

        {/* GRADE COM OS 4 BOTÕES DOS PILARES */}
        <section
          className="grid grid-cols-1 gap-[18px] md:grid-cols-2"
          aria-label="Pilares do Pensamento Computacional"
        >
          {PILLARS_INFO.map((pilar) => (
            <button
              key={pilar.id}
              type="button"
              onClick={() => handleSelectPillar(pilar)}
              className="relative flex cursor-pointer flex-col items-center justify-between gap-2.5 rounded-[20px] border-4 border-[#6f8dca] bg-white px-[18px] py-[22px] text-center shadow-[0_6px_0_#6f8dca] transition-all duration-150 hover:-translate-y-1 hover:bg-slate-50 active:translate-y-0.5 active:shadow-[0_2px_0_#6f8dca]"
            >
              <span className="rounded-[20px] bg-[#c8d1d9] px-3 py-1 text-[0.78rem] font-black text-slate-800">
                {pilar.faseTag}
              </span>

              <span className="text-[3.4rem] leading-none">{pilar.emoji}</span>

              <h3 className="text-[1.25rem] font-black text-slate-800">
                {pilar.titulo}
              </h3>

              <span className="text-[0.85rem] font-bold text-slate-500">
                {pilar.subtitulo}
              </span>

              <span className="mt-1.5 w-[85%] rounded-[12px] bg-[#6f8dca] px-5 py-2.5 text-[0.9rem] font-extrabold text-white">
                ESCOLHER PILAR
              </span>
            </button>
          ))}
        </section>
      </main>

      {/* MODAL EXPLICATIVO DO PILAR SELECIONADO */}
      <ModalPilar
        pilar={selectedPillar}
        onClose={handleCloseModal}
        onStart={handleStartPhase}
      />
    </div>
  );
}