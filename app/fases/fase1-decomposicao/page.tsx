'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GameHud } from '@/components/game/game-hud';

type ZoneKey = 'estojo' | 'grande' | 'lateral';

interface ZoneState {
  capacity: number;
  remaining: number;
  label: string;
}

interface GameItem {
  id: string;
  name: string;
  emoji: string;
  value: number;
  targetZone: ZoneKey | 'distrator' | 'overflow';
  hint?: string;
  rejectMsg?: string;
}

interface RoutineData {
  title: string;
  instruction: string;
  zones: Record<ZoneKey, ZoneState>;
  items: GameItem[];
}

interface LevelData {
  label: string;
  name: string;
  noFail: boolean;
  routines: RoutineData[];
}

const LEVELS_OPTIONS = [
  { value: 0, label: '0 - APRENDIZAGEM (SEM ERRO)' },
  { value: 1, label: '1 - MUITO FÁCIL' },
  { value: 2, label: '2 - FÁCIL' },
  { value: 3, label: '3 - NORMAL' },
  { value: 4, label: '4 - MÉDIO' },
  { value: 5, label: '5 - DIFÍCIL' },
  { value: 6, label: '6 - MUITO DIFÍCIL' },
  { value: 7, label: '7 - EXTREMO' },
  { value: 8, label: '8 - PESADELO' },
];

const LEVELS_CONFIG: Record<number, LevelData> = {
  0: {
    label: '1 - 0',
    name: 'APRENDIZAGEM (SEM ERRO)',
    noFail: true,
    routines: [
      {
        title: 'ROTINA 1 DE 2: PRIMEIRO DIA DE AULA',
        instruction: 'SIGA AS DICAS LARANJAS! ARRASTE CADA MATERIAL PARA O COMPARTIMENTO INDICADO.',
        zones: {
          estojo: { capacity: 4, remaining: 4, label: 'ESTOJO' },
          grande: { capacity: 4, remaining: 4, label: 'BOLSO GRANDE' },
          lateral: { capacity: 2, remaining: 2, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r01_1', name: 'LÁPIS', emoji: '✏️', value: 2, targetZone: 'estojo', hint: 'ESTOJO' },
          { id: 'r01_2', name: 'BORRACHA', emoji: '🧽', value: 2, targetZone: 'estojo', hint: 'ESTOJO' },
          { id: 'r01_3', name: 'CADERNO', emoji: '📓', value: 4, targetZone: 'grande', hint: 'BOLSO GRANDE' },
          { id: 'r01_4', name: 'GARRAFA', emoji: '🧴', value: 2, targetZone: 'lateral', hint: 'LATERAL' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: AULA DE LEITURA E DESENHO',
        instruction: 'MUITO BEM! AGORA ORGANIZE OS MATERIAIS DA AULA DE LEITURA SEGUINDO AS DICAS.',
        zones: {
          estojo: { capacity: 3, remaining: 3, label: 'ESTOJO' },
          grande: { capacity: 5, remaining: 5, label: 'BOLSO GRANDE' },
          lateral: { capacity: 2, remaining: 2, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r02_1', name: 'GIZ DE CERA', emoji: '🖍️', value: 2, targetZone: 'estojo', hint: 'ESTOJO' },
          { id: 'r02_2', name: 'APONTADOR', emoji: '🪒', value: 1, targetZone: 'estojo', hint: 'ESTOJO' },
          { id: 'r02_3', name: 'LIVRO', emoji: '📘', value: 5, targetZone: 'grande', hint: 'BOLSO GRANDE' },
          { id: 'r02_4', name: 'SQUEEZE', emoji: '🥤', value: 2, targetZone: 'lateral', hint: 'LATERAL' },
        ],
      },
    ],
  },
  1: {
    label: '1 - 1',
    name: 'MUITO FÁCIL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: MANHÃ DE ESTUDOS',
        instruction: 'AGORA SEM DICAS! DECOMPONHA OS MATERIAIS NOS BOLSOS CERTOS (SEM DISTRATORES).',
        zones: {
          estojo: { capacity: 4, remaining: 4, label: 'ESTOJO' },
          grande: { capacity: 6, remaining: 6, label: 'BOLSO GRANDE' },
          lateral: { capacity: 2, remaining: 2, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r11_1', name: 'LÁPIS', emoji: '✏️', value: 2, targetZone: 'estojo' },
          { id: 'r11_2', name: 'CANETA', emoji: '🖊️', value: 2, targetZone: 'estojo' },
          { id: 'r11_3', name: 'CADERNO', emoji: '📓', value: 6, targetZone: 'grande' },
          { id: 'r11_4', name: 'GARRAFA', emoji: '🧴', value: 2, targetZone: 'lateral' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: AULA DE ARTES',
        instruction: 'SEPARE OS MATERIAIS DE ARTES NOS COMPARTIMENTOS DA MOCHILA.',
        zones: {
          estojo: { capacity: 5, remaining: 5, label: 'ESTOJO' },
          grande: { capacity: 8, remaining: 8, label: 'BOLSO GRANDE' },
          lateral: { capacity: 2, remaining: 2, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r12_1', name: 'PINCEL', emoji: '🖌️', value: 3, targetZone: 'estojo' },
          { id: 'r12_2', name: 'TESOURA', emoji: '✂️', value: 2, targetZone: 'estojo' },
          { id: 'r12_3', name: 'BLOCO DESENHO', emoji: '🗒️', value: 4, targetZone: 'grande' },
          { id: 'r12_4', name: 'PASTA', emoji: '📁', value: 4, targetZone: 'grande' },
          { id: 'r12_5', name: 'GARRAFA', emoji: '🧴', value: 2, targetZone: 'lateral' },
        ],
      },
    ],
  },
  2: {
    label: '1 - 2',
    name: 'FÁCIL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: DIA DE PORTUGUÊS E MATEMÁTICA',
        instruction: 'CUIDADO! HÁ UM BRINQUEDO MISTURADO. GUARDE APENAS O MATERIAL ESCOLAR.',
        zones: {
          estojo: { capacity: 4, remaining: 4, label: 'ESTOJO' },
          grande: { capacity: 10, remaining: 10, label: 'BOLSO GRANDE' },
          lateral: { capacity: 2, remaining: 2, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r21_1', name: 'LÁPIS', emoji: '✏️', value: 2, targetZone: 'estojo' },
          { id: 'r21_2', name: 'CANETA', emoji: '🖊️', value: 2, targetZone: 'estojo' },
          { id: 'r21_3', name: 'CADERNO', emoji: '📓', value: 5, targetZone: 'grande' },
          { id: 'r21_4', name: 'LIVRO', emoji: '📘', value: 5, targetZone: 'grande' },
          { id: 'r21_5', name: 'GARRAFA', emoji: '🧴', value: 2, targetZone: 'lateral' },
          { id: 'r21_6', name: 'URSO', emoji: '🧸', value: 3, targetZone: 'distrator' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: AULA DE CIÊNCIAS',
        instruction: 'DECOMPONHA OS MATERIAIS DE CIÊNCIAS E DEIXE O QUE NÃO É DA ESCOLA DE FORA.',
        zones: {
          estojo: { capacity: 5, remaining: 5, label: 'ESTOJO' },
          grande: { capacity: 9, remaining: 9, label: 'BOLSO GRANDE' },
          lateral: { capacity: 3, remaining: 3, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r22_1', name: 'LUPA', emoji: '🔍', value: 3, targetZone: 'estojo' },
          { id: 'r22_2', name: 'LÁPIS', emoji: '✏️', value: 2, targetZone: 'estojo' },
          { id: 'r22_3', name: 'LIVRO CIÊNCIAS', emoji: '📗', value: 5, targetZone: 'grande' },
          { id: 'r22_4', name: 'CADERNO', emoji: '📓', value: 4, targetZone: 'grande' },
          { id: 'r22_5', name: 'GARRAFA GRANDE', emoji: '🧴', value: 3, targetZone: 'lateral' },
          { id: 'r22_6', name: 'CARRINHO', emoji: '🚗', value: 2, targetZone: 'distrator' },
        ],
      },
    ],
  },
  3: {
    label: '1 - 3',
    name: 'NORMAL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: AULA DE GEOGRAFIA',
        instruction: 'SOME OS VALORES COM ATENÇÃO PARA PREENCHER EXATAMENTE CADA COMPARTIMENTO.',
        zones: {
          estojo: { capacity: 6, remaining: 6, label: 'ESTOJO' },
          grande: { capacity: 11, remaining: 11, label: 'BOLSO GRANDE' },
          lateral: { capacity: 3, remaining: 3, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r31_1', name: 'LÁPIS DE COR', emoji: '🖍️', value: 3, targetZone: 'estojo' },
          { id: 'r31_2', name: 'RÉGUA', emoji: '📏', value: 2, targetZone: 'estojo' },
          { id: 'r31_3', name: 'BORRACHA', emoji: '🧽', value: 1, targetZone: 'estojo' },
          { id: 'r31_4', name: 'ATLAS', emoji: '🗺️', value: 6, targetZone: 'grande' },
          { id: 'r31_5', name: 'CADERNO', emoji: '📓', value: 5, targetZone: 'grande' },
          { id: 'r31_6', name: 'GARRAFA', emoji: '🧴', value: 3, targetZone: 'lateral' },
          { id: 'r31_7', name: 'BOLA', emoji: '⚽', value: 4, targetZone: 'distrator' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: REFORÇO ESCOLAR',
        instruction: 'ORGANIZE OS MATERIAIS DO REFORÇO IGNORANDO OS BRINQUEDOS.',
        zones: {
          estojo: { capacity: 5, remaining: 5, label: 'ESTOJO' },
          grande: { capacity: 10, remaining: 10, label: 'BOLSO GRANDE' },
          lateral: { capacity: 4, remaining: 4, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r32_1', name: 'CANETINHA', emoji: '🖊️', value: 3, targetZone: 'estojo' },
          { id: 'r32_2', name: 'LÁPIS', emoji: '✏️', value: 2, targetZone: 'estojo' },
          { id: 'r32_3', name: 'APOSTILA', emoji: '📙', value: 6, targetZone: 'grande' },
          { id: 'r32_4', name: 'AGENDA', emoji: '📒', value: 4, targetZone: 'grande' },
          { id: 'r32_5', name: 'GARRAFA TÉRMICA', emoji: '🍶', value: 4, targetZone: 'lateral' },
          { id: 'r32_6', name: 'PIÃO', emoji: '🪀', value: 2, targetZone: 'distrator' },
        ],
      },
    ],
  },
  4: {
    label: '1 - 4',
    name: 'MÉDIO',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: DIA DE PROVA',
        instruction: 'DECOMPONHA TODOS OS MATERIAIS DA PROVA NOS TRÊS COMPARTIMENTOS.',
        zones: {
          estojo: { capacity: 5, remaining: 5, label: 'ESTOJO' },
          grande: { capacity: 12, remaining: 12, label: 'BOLSO GRANDE' },
          lateral: { capacity: 3, remaining: 3, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r41_1', name: 'LÁPIS', emoji: '✏️', value: 2, targetZone: 'estojo' },
          { id: 'r41_2', name: 'BORRACHA', emoji: '🧽', value: 1, targetZone: 'estojo' },
          { id: 'r41_3', name: 'RÉGUA', emoji: '📏', value: 2, targetZone: 'estojo' },
          { id: 'r41_4', name: 'CADERNO', emoji: '📓', value: 5, targetZone: 'grande' },
          { id: 'r41_5', name: 'LIVRO', emoji: '📘', value: 5, targetZone: 'grande' },
          { id: 'r41_6', name: 'AGENDA', emoji: '📒', value: 2, targetZone: 'grande' },
          { id: 'r41_7', name: 'GARRAFA', emoji: '🧴', value: 3, targetZone: 'lateral' },
          { id: 'r41_8', name: 'CONTROLE', emoji: '🎮', value: 4, targetZone: 'distrator' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: FEIRA DE CIÊNCIAS',
        instruction: 'PREPARE A MOCHILA PARA A FEIRA DE CIÊNCIAS COM PRECISÃO!',
        zones: {
          estojo: { capacity: 7, remaining: 7, label: 'ESTOJO' },
          grande: { capacity: 13, remaining: 13, label: 'BOLSO GRANDE' },
          lateral: { capacity: 4, remaining: 4, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r42_1', name: 'TESOURA', emoji: '✂️', value: 3, targetZone: 'estojo' },
          { id: 'r42_2', name: 'COLA', emoji: '🧴', value: 2, targetZone: 'estojo' },
          { id: 'r42_3', name: 'MARCADOR', emoji: '🖍️', value: 2, targetZone: 'estojo' },
          { id: 'r42_4', name: 'PASTA PROJETO', emoji: '📂', value: 6, targetZone: 'grande' },
          { id: 'r42_5', name: 'LIVRO PESQUISA', emoji: '📕', value: 7, targetZone: 'grande' },
          { id: 'r42_6', name: 'SQUEEZE', emoji: '🥤', value: 4, targetZone: 'lateral' },
          { id: 'r42_7', name: 'ROBÔ BRINQUEDO', emoji: '🤖', value: 5, targetZone: 'distrator' },
        ],
      },
    ],
  },
  5: {
    label: '1 - 5',
    name: 'DIFÍCIL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: AULA DE GEOMETRIA',
        instruction: 'ATENÇÃO! HÁ ITENS EXTRAS QUE NÃO CABEM NA SOMA. ESCOLHA APENAS OS QUE ZERAM OS BOLSOS.',
        zones: {
          estojo: { capacity: 8, remaining: 8, label: 'ESTOJO' },
          grande: { capacity: 14, remaining: 14, label: 'BOLSO GRANDE' },
          lateral: { capacity: 5, remaining: 5, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r51_1', name: 'COMPASSO', emoji: '📐', value: 3, targetZone: 'estojo' },
          { id: 'r51_2', name: 'ESQUADRO', emoji: '📏', value: 3, targetZone: 'estojo' },
          { id: 'r51_3', name: 'LÁPIS TÉCNICO', emoji: '✏️', value: 2, targetZone: 'estojo' },
          { id: 'r51_4', name: 'ESTOJO GIGANTE', emoji: '🧰', value: 6, targetZone: 'overflow', rejectMsg: 'SE COLOCAR ESSE, NÃO FECHA A SOMA EXATA DO ESTOJO!' },
          { id: 'r51_5', name: 'LIVRO MATEMÁTICA', emoji: '📘', value: 8, targetZone: 'grande' },
          { id: 'r51_6', name: 'CADERNO QUADRIC.', emoji: '📓', value: 6, targetZone: 'grande' },
          { id: 'r51_7', name: 'GARRAFA TÉRMICA', emoji: '🍶', value: 5, targetZone: 'lateral' },
          { id: 'r51_8', name: 'VIDEOGAME', emoji: '🕹️', value: 4, targetZone: 'distrator' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: AULA DE LÍNGUA ESTRANGEIRA',
        instruction: 'COMBINE OS MATERIAIS CERTOS PARA ATINGIR A CAPACIDADE EXATA DE CADA BOLSO!',
        zones: {
          estojo: { capacity: 7, remaining: 7, label: 'ESTOJO' },
          grande: { capacity: 15, remaining: 15, label: 'BOLSO GRANDE' },
          lateral: { capacity: 4, remaining: 4, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r52_1', name: 'MARCA-TEXTO', emoji: '🖍️', value: 3, targetZone: 'estojo' },
          { id: 'r52_2', name: 'CANETA AZUL', emoji: '🖊️', value: 2, targetZone: 'estojo' },
          { id: 'r52_3', name: 'BORRACHA', emoji: '🧽', value: 2, targetZone: 'estojo' },
          { id: 'r52_4', name: 'DICIONÁRIO', emoji: '📕', value: 9, targetZone: 'grande' },
          { id: 'r52_5', name: 'CADERNO', emoji: '📓', value: 6, targetZone: 'grande' },
          { id: 'r52_6', name: 'ENCICLOPÉDIA', emoji: '📚', value: 11, targetZone: 'overflow', rejectMsg: 'ESSE LIVRO É MUITO GRANDE PARA COMBINAR AQUI!' },
          { id: 'r52_7', name: 'GARRAFA ÁGUA', emoji: '🧴', value: 4, targetZone: 'lateral' },
          { id: 'r52_8', name: 'FONE GAMER', emoji: '🎧', value: 3, targetZone: 'distrator' },
        ],
      },
    ],
  },
  6: {
    label: '1 - 6',
    name: 'MUITO DIFÍCIL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: TURNO INTEGRAL',
        instruction: 'DIA CHEIO! DECOMPONHA 8 MATERIAIS NOS COMPARTIMENTOS SEM CAIR NAS ARMADILHAS DE CAPACIDADE.',
        zones: {
          estojo: { capacity: 9, remaining: 9, label: 'ESTOJO' },
          grande: { capacity: 16, remaining: 16, label: 'BOLSO GRANDE' },
          lateral: { capacity: 6, remaining: 6, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r61_1', name: 'CALCULADORA', emoji: '🧮', value: 4, targetZone: 'estojo' },
          { id: 'r61_2', name: 'RÉGUA 30CM', emoji: '📏', value: 3, targetZone: 'estojo' },
          { id: 'r61_3', name: 'LÁPIS', emoji: '✏️', value: 2, targetZone: 'estojo' },
          { id: 'r61_4', name: 'LIVRO HISTÓRIA', emoji: '📙', value: 7, targetZone: 'grande' },
          { id: 'r61_5', name: 'CADERNO 10 MAT.', emoji: '📓', value: 6, targetZone: 'grande' },
          { id: 'r61_6', name: 'PASTA CATÁLOGO', emoji: '📁', value: 3, targetZone: 'grande' },
          { id: 'r61_7', name: 'GARRAFA 1 LITRO', emoji: '🧴', value: 6, targetZone: 'lateral' },
          { id: 'r61_8', name: 'COPO PEQUENO', emoji: '🥛', value: 2, targetZone: 'overflow', rejectMsg: 'ESSE COPO NÃO COMPLETA A CAPACIDADE 6 DO BOLSO LATERAL!' },
          { id: 'r61_9', name: 'SKATE MINI', emoji: '🛹', value: 5, targetZone: 'distrator' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: LABORATÓRIO DE INFORMÁTICA',
        instruction: 'CALCULE BEM ANTES DE ARRASTAR! ESCOLHA A COMBINAÇÃO EXATA PARA CADA ESPAÇO.',
        zones: {
          estojo: { capacity: 10, remaining: 10, label: 'ESTOJO' },
          grande: { capacity: 18, remaining: 18, label: 'BOLSO GRANDE' },
          lateral: { capacity: 5, remaining: 5, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r62_1', name: 'PENDRIVE', emoji: '💾', value: 3, targetZone: 'estojo' },
          { id: 'r62_2', name: 'CANETA TOUCH', emoji: '🖊️', value: 4, targetZone: 'estojo' },
          { id: 'r62_3', name: 'ADAPTADOR', emoji: '🔌', value: 3, targetZone: 'estojo' },
          { id: 'r62_4', name: 'TABLET ESCOLAR', emoji: '📱', value: 8, targetZone: 'grande' },
          { id: 'r62_5', name: 'APOSTILA LÓGICA', emoji: '📘', value: 6, targetZone: 'grande' },
          { id: 'r62_6', name: 'CADERNO ANOTAÇÕES', emoji: '📒', value: 4, targetZone: 'grande' },
          { id: 'r62_7', name: 'GARRAFA TÉRMICA', emoji: '🍶', value: 5, targetZone: 'lateral' },
          { id: 'r62_8', name: 'NOTEBOOK PESADO', emoji: '💻', value: 13, targetZone: 'overflow', rejectMsg: 'ESSE ITEM QUEBRA A SOMA EXATA DO BOLSO GRANDE!' },
          { id: 'r62_9', name: 'JOYSTICK', emoji: '🎮', value: 4, targetZone: 'distrator' },
        ],
      },
    ],
  },
  7: {
    label: '1 - 7',
    name: 'EXTREMO',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: OLIMPÍADA DE MATEMÁTICA',
        instruction: 'NÍVEL EXTREMO! ANALISE TODOS OS NÚMEROS ANTES DE MOVER PARA NÃO ESTOURAR A SOMA.',
        zones: {
          estojo: { capacity: 11, remaining: 11, label: 'ESTOJO' },
          grande: { capacity: 20, remaining: 20, label: 'BOLSO GRANDE' },
          lateral: { capacity: 7, remaining: 7, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r71_1', name: 'CALCULADORA CIENT.', emoji: '🧮', value: 5, targetZone: 'estojo' },
          { id: 'r71_2', name: 'COMPASSO METAL', emoji: '📐', value: 4, targetZone: 'estojo' },
          { id: 'r71_3', name: 'LAPISEIRA', emoji: '✏️', value: 2, targetZone: 'estojo' },
          { id: 'r71_4', name: 'CONJUNTO CANETAS', emoji: '🖍️', value: 8, targetZone: 'overflow', rejectMsg: 'COM 8 NÃO SOBRA COMBINAÇÃO PARA FECHAR 11!' },
          { id: 'r71_5', name: 'COLETÂNEA PROVAS', emoji: '📚', value: 9, targetZone: 'grande' },
          { id: 'r71_6', name: 'LIVRO ÁLGEBRA', emoji: '📘', value: 7, targetZone: 'grande' },
          { id: 'r71_7', name: 'BLOCO RASCUNHO', emoji: '🗒️', value: 4, targetZone: 'grande' },
          { id: 'r71_8', name: 'GARRAFA ISOTÉRMICA', emoji: '🧴', value: 4, targetZone: 'lateral' },
          { id: 'r71_9', name: 'GARRAFA EXTRA', emoji: '🥤', value: 3, targetZone: 'lateral' },
          { id: 'r71_10', name: 'CONSOLE PORTÁTIL', emoji: '🕹️', value: 6, targetZone: 'distrator' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: EXPEDIÇÃO ECOLÓGICA ESCOLAR',
        instruction: 'DECOMPONHA 9 ITENS CORRETOS ENTRE OS BOLSOS IGNORANDO OS ITENS INCOMPATÍVEIS!',
        zones: {
          estojo: { capacity: 12, remaining: 12, label: 'ESTOJO' },
          grande: { capacity: 21, remaining: 21, label: 'BOLSO GRANDE' },
          lateral: { capacity: 6, remaining: 6, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r72_1', name: 'LUPA DE CAMPO', emoji: '🔍', value: 5, targetZone: 'estojo' },
          { id: 'r72_2', name: 'BÚSSOLA', emoji: '🧭', value: 4, targetZone: 'estojo' },
          { id: 'r72_3', name: 'LÁPIS ANOTAÇÃO', emoji: '✏️', value: 3, targetZone: 'estojo' },
          { id: 'r72_4', name: 'GUIA DE PLANTAS', emoji: '📗', value: 8, targetZone: 'grande' },
          { id: 'r72_5', name: 'DIÁRIO DE BORDO', emoji: '📓', value: 7, targetZone: 'grande' },
          { id: 'r72_6', name: 'PASTA AMOSTRAS', emoji: '📂', value: 6, targetZone: 'grande' },
          { id: 'r72_7', name: 'LIVRO GIGANTE', emoji: '📕', value: 12, targetZone: 'overflow', rejectMsg: 'ESSE VOLUME IMPEDE A SOMA EXATA DE 21!' },
          { id: 'r72_8', name: 'CANTIL ESCOLAR', emoji: '🍶', value: 4, targetZone: 'lateral' },
          { id: 'r72_9', name: 'GARRAFINHA SUCO', emoji: '🧃', value: 2, targetZone: 'lateral' },
          { id: 'r72_10', name: 'BONÉ DE PASSEIO', emoji: '🧢', value: 3, targetZone: 'distrator' },
        ],
      },
    ],
  },
  8: {
    label: '1 - 8',
    name: 'PESADELO',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: MARATONA ACADÊMICA',
        instruction: 'DESAFIO PESADELO! 10 ITENS CORRETOS E MÚLTIPLOS DISTRATORES DE SOMA. DECOMPONHA COM MESTRIA!',
        zones: {
          estojo: { capacity: 14, remaining: 14, label: 'ESTOJO' },
          grande: { capacity: 25, remaining: 25, label: 'BOLSO GRANDE' },
          lateral: { capacity: 8, remaining: 8, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r81_1', name: 'CALCULADORA', emoji: '🧮', value: 5, targetZone: 'estojo' },
          { id: 'r81_2', name: 'KIT GEOMETRIA', emoji: '📐', value: 4, targetZone: 'estojo' },
          { id: 'r81_3', name: 'CANETAS COR', emoji: '🖍️', value: 3, targetZone: 'estojo' },
          { id: 'r81_4', name: 'BORRACHA DUPLA', emoji: '🧽', value: 2, targetZone: 'estojo' },
          { id: 'r81_5', name: 'ESTOJO METÁLICO', emoji: '🧰', value: 9, targetZone: 'overflow', rejectMsg: 'COMBINAÇÃO INVÁLIDA PARA FECHAR 14!' },
          { id: 'r81_6', name: 'VADE MECUM JR', emoji: '📚', value: 9, targetZone: 'grande' },
          { id: 'r81_7', name: 'ATLAS MUNDIAL', emoji: '🗺️', value: 7, targetZone: 'grande' },
          { id: 'r81_8', name: 'CADERNO UNIVERS.', emoji: '📓', value: 5, targetZone: 'grande' },
          { id: 'r81_9', name: 'PASTA SANFONADA', emoji: '🗂️', value: 4, targetZone: 'grande' },
          { id: 'r81_10', name: 'DICIONÁRIO PESADO', emoji: '📕', value: 11, targetZone: 'overflow', rejectMsg: 'ESSE PESO DESBALANCEIA A SOMA 25!' },
          { id: 'r81_11', name: 'GARRAFA TÉRMICA', emoji: '🍶', value: 5, targetZone: 'lateral' },
          { id: 'r81_12', name: 'SQUEEZE EXTRA', emoji: '🥤', value: 3, targetZone: 'lateral' },
          { id: 'r81_13', name: 'DRONE BRINQUEDO', emoji: '🛸', value: 6, targetZone: 'distrator' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: O GRANDE DESAFIO FINAL DA MOCHILA',
        instruction: 'ÚLTIMA ROTINA DO MODO PESADELO! ZERE TODOS OS COMPARTIMENTOS PARA VENCER A FASE 1!',
        zones: {
          estojo: { capacity: 15, remaining: 15, label: 'ESTOJO' },
          grande: { capacity: 28, remaining: 28, label: 'BOLSO GRANDE' },
          lateral: { capacity: 9, remaining: 9, label: 'BOLSO LATERAL' },
        },
        items: [
          { id: 'r82_1', name: 'LUPA PRECISÃO', emoji: '🔍', value: 5, targetZone: 'estojo' },
          { id: 'r82_2', name: 'COMPASSO', emoji: '📐', value: 4, targetZone: 'estojo' },
          { id: 'r82_3', name: 'RÉGUA ACRÍLICA', emoji: '📏', value: 4, targetZone: 'estojo' },
          { id: 'r82_4', name: 'LÁPIS GRAFITE', emoji: '✏️', value: 2, targetZone: 'estojo' },
          { id: 'r82_5', name: 'KIT PINCÉIS', emoji: '🖌️', value: 7, targetZone: 'overflow', rejectMsg: 'NÃO FECHA A CONTA EXATA DO ESTOJO (15)!' },
          { id: 'r82_6', name: 'ENCICLOPÉDIA', emoji: '📚', value: 10, targetZone: 'grande' },
          { id: 'r82_7', name: 'LIVRO CIÊNCIAS', emoji: '📗', value: 8, targetZone: 'grande' },
          { id: 'r82_8', name: 'CADERNO PROJETOS', emoji: '📓', value: 6, targetZone: 'grande' },
          { id: 'r82_9', name: 'PASTA DOCUMENTOS', emoji: '📁', value: 4, targetZone: 'grande' },
          { id: 'r82_10', name: 'FICHÁRIO GRANDE', emoji: '📒', value: 13, targetZone: 'overflow', rejectMsg: 'ESSE FICHÁRIO IMPEDE ZERAR O BOLSO GRANDE (28)!' },
          { id: 'r82_11', name: 'GARRAFA 1.5L', emoji: '🧴', value: 6, targetZone: 'lateral' },
          { id: 'r82_12', name: 'SUCO NATURAL', emoji: '🧃', value: 3, targetZone: 'lateral' },
          { id: 'r82_13', name: 'GARRAFA 5L', emoji: '🪣', value: 7, targetZone: 'overflow', rejectMsg: 'NÃO CABE NA SOMA DO BOLSO LATERAL (9)!' },
          { id: 'r82_14', name: 'CONTROLE REMOTO', emoji: '🎮', value: 5, targetZone: 'distrator' },
        ],
      },
    ],
  },
};

export default function Fase1DecomposicaoPage() {
  const router = useRouter();

  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [currentRoutineIndex, setCurrentRoutineIndex] = useState<number>(0);
  const [zones, setZones] = useState<Record<ZoneKey, ZoneState>>(() =>
    structuredClone(LEVELS_CONFIG[0].routines[0].zones)
  );
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [lives, setLives] = useState<number>(3);

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = useState<ZoneKey | null>(null);

  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [endModalState, setEndModalState] = useState<{ open: boolean; victory: boolean }>({
    open: false,
    victory: false,
  });

  const levelData = LEVELS_CONFIG[currentLevel];
  const routineData = levelData.routines[currentRoutineIndex];
  const validZones: ZoneKey[] = ['estojo', 'grande', 'lateral'];
  const totalRequired = routineData.items.filter((i) =>
    validZones.includes(i.targetZone as ZoneKey)
  ).length;

  const playFeedbackSound = (isSuccess: boolean) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Ignora bloqueio de áudio
    }
  };

  const showFeedback = (message: string, isSuccess: boolean) => {
    setFeedback({ message, isSuccess });
    playFeedbackSound(isSuccess);

    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setFeedback(null);
    }, 2000);
  };

  const initLevel = (lvlIndex: number, routineIdx = 0) => {
    const nextLvl = LEVELS_CONFIG[lvlIndex];
    const nextRoutine = nextLvl.routines[routineIdx];

    setCurrentLevel(lvlIndex);
    setCurrentRoutineIndex(routineIdx);
    setZones(structuredClone(nextRoutine.zones));
    setPlacedIds([]);
    setLives(3);
    setFeedback(null);
    setEndModalState({ open: false, victory: false });
  };

  const registerMistake = (reason: string) => {
    showFeedback(reason, false);

    if (!levelData.noFail) {
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setTimeout(() => setEndModalState({ open: true, victory: false }), 700);
        }
        return nextLives;
      });
    }
  };

  const handleDrop = (zoneKey: ZoneKey) => {
    if (!draggedItemId) return;
    const item = routineData.items.find((i) => i.id === draggedItemId);
    if (!item || placedIds.includes(item.id)) return;

    const targetZoneData = zones[zoneKey];

    // Regra 1: Item distrator
    if (item.targetZone === 'distrator') {
      registerMistake('ESSE ITEM NÃO VAI PARA A ESCOLA!');
      return;
    }

    // Regra 2: Overflow / combinação inválida
    if (item.targetZone === 'overflow') {
      registerMistake(item.rejectMsg || 'ESSE ITEM NÃO CABE NA SOMA EXATA!');
      return;
    }

    // Regra 3: Compartimento errado
    if (item.targetZone !== zoneKey) {
      registerMistake(`ESSE ITEM NÃO PERTENCE AO ${targetZoneData.label}!`);
      return;
    }

    // Regra 4: Capacidade insuficiente
    if (targetZoneData.remaining - item.value < 0) {
      registerMistake('ESPAÇO INSUFICIENTE NESSE BOLSO!');
      return;
    }

    // Acerto
    const previousRemaining = targetZoneData.remaining;
    const newRemaining = previousRemaining - item.value;

    setZones((prev) => ({
      ...prev,
      [zoneKey]: { ...prev[zoneKey], remaining: newRemaining },
    }));

    const updatedPlaced = [...placedIds, item.id];
    setPlacedIds(updatedPlaced);

    showFeedback(`ISSO AÍ! (${previousRemaining} - ${item.value} = ${newRemaining})`, true);

    if (updatedPlaced.length === totalRequired) {
      setTimeout(() => setEndModalState({ open: true, victory: true }), 700);
    }
  };

  const hasNextRoutine = currentRoutineIndex + 1 < levelData.routines.length;
  const hasNextLevel = Boolean(LEVELS_CONFIG[currentLevel + 1]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#e5e4e4] p-4 font-sans text-gray-800 select-none">
      <main className="relative flex w-full max-w-[1120px] flex-col gap-4 rounded-[20px] border-[3px] border-[#c8d1d9] bg-[#e5e4e4] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
        {/* BARRA SUPERIOR PADRONIZADA */}
        <GameHud
          levels={LEVELS_OPTIONS}
          currentLevel={currentLevel}
          onSelectLevel={(lvl) => initLevel(lvl, 0)}
          faseNivelLabel={levelData.label}
          rotinaAtual={currentRoutineIndex + 1}
          totalRotinas={levelData.routines.length}
          acertosAtuais={placedIds.length}
          totalAcertos={totalRequired}
          vidas={lives}
          noFail={levelData.noFail}
          onOpenHelp={() => setShowHelpModal(true)}
          onCloseGame={() => router.push('/narrativa')}
        />

        {/* BLOCO DE INSTRUÇÃO NARRATIVA */}
        <section className="flex flex-col items-center gap-1.5 rounded-[14px] border-l-[6px] border-[#6f8dca] bg-[#c8d1d9] px-[18px] py-3 text-center text-[0.96rem] font-bold text-slate-800">
          <div className="rounded-[20px] bg-[#6f8dca] px-3 py-1 text-[0.8rem] font-extrabold tracking-wide text-white">
            {routineData.title}
          </div>
          <p>{routineData.instruction}</p>
        </section>

        {/* FEEDBACK LÚDICO FLUTUANTE */}
        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={`absolute top-[86px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-[16px] border-[3px] bg-white px-[22px] py-2.5 text-[1.15rem] font-extrabold shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-opacity ${
              feedback.isSuccess
                ? 'border-[#4caf50] text-[#2e7d32]'
                : 'border-[#e05252] text-[#c62828]'
            }`}
          >
            <span>{feedback.isSuccess ? '😄👍' : '🤔✋'}</span>
            <span>{feedback.message}</span>
          </div>
        )}

        {/* ÁREA CENTRAL: OS 3 COMPARTIMENTOS DA MOCHILA */}
        <section
          className="grid min-h-[250px] grid-cols-1 gap-4 md:grid-cols-[1fr_1.5fr_1fr]"
          aria-label="Compartimentos da Mochila"
        >
          {(['estojo', 'grande', 'lateral'] as ZoneKey[]).map((zoneKey) => {
            const z = zones[zoneKey];
            const isCompleted = z.remaining === 0;
            const isOver = dragOverZone === zoneKey;
            const placedItems = routineData.items.filter(
              (item) => placedIds.includes(item.id) && item.targetZone === zoneKey
            );

            return (
              <div
                key={zoneKey}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverZone(zoneKey);
                }}
                onDragLeave={() => setDragOverZone(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverZone(null);
                  handleDrop(zoneKey);
                  setDraggedItemId(null);
                }}
                className={`flex flex-col justify-between rounded-[18px] border-[3px] p-3.5 transition-all duration-150 ${
                  isCompleted
                    ? 'border-solid border-[#4caf50] bg-[#f0fdf4]'
                    : isOver
                      ? 'scale-[1.02] border-solid border-[#6f8dca] bg-[#dbeafe]'
                      : 'border-dashed border-[#6f8dca] bg-[#f8fafc]'
                }`}
              >
                <div className="flex items-center justify-between rounded-[10px] bg-[#6f8dca] px-3 py-2 text-[0.9rem] font-extrabold text-white">
                  <span>{z.label}</span>
                  <span>CAPACIDADE: {z.capacity}</span>
                </div>

                <div className="my-2 rounded-[8px] bg-[#e5e4e4] px-2 py-1 text-center text-[1rem] font-extrabold text-slate-700">
                  {isCompleted
                    ? `COMPLETO! (${z.capacity} - ${z.capacity} = 0)`
                    : `RESTANTE: ${z.remaining}`}
                </div>

                <div className="flex min-h-[130px] flex-1 flex-wrap items-center justify-center gap-2.5 p-2">
                  {placedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex w-[96px] cursor-default flex-col items-center justify-between gap-1.5 rounded-[14px] border-[3px] border-[#4caf50] bg-white px-2 py-2.5 shadow-xs"
                    >
                      <span className="text-[2.3rem] leading-none">{item.emoji}</span>
                      <span className="text-center text-[0.78rem] font-extrabold text-gray-800">
                        {item.name}
                      </span>
                      <span className="flex h-[26px] w-[32px] items-center justify-center rounded-[8px] bg-[#6f8dca] text-[0.95rem] font-extrabold text-white">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* BARRA INFERIOR: ITENS DISPONÍVEIS */}
        <section className="flex flex-col gap-2.5 rounded-[18px] bg-[#c8d1d9] p-3.5">
          <div className="text-center text-[0.85rem] font-extrabold text-slate-700">
            MATERIAIS DISPONÍVEIS (ARRASTE PARA GUARDAR)
          </div>

          <div className="flex min-h-[120px] flex-wrap justify-center gap-3.5">
            {routineData.items
              .filter((item) => !placedIds.includes(item.id))
              .map((item) => {
                const showHint = levelData.noFail && item.hint;
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedItemId(item.id);
                      e.dataTransfer.setData('text/plain', item.id);
                    }}
                    onDragEnd={() => setDraggedItemId(null)}
                    className={`relative flex w-[112px] cursor-grab flex-col items-center justify-between gap-1.5 rounded-[14px] border-[3px] bg-white px-2 py-2.5 transition-all hover:-translate-y-0.5 active:cursor-grabbing ${
                      showHint
                        ? 'border-[#f59e0b] shadow-[0_0_0_4px_rgba(245,158,11,0.35)]'
                        : 'border-[#6f8dca] shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {showHint && (
                      <span className="absolute -top-2.5 rounded-[6px] bg-[#f59e0b] px-1.5 py-0.5 text-[0.65rem] font-extrabold text-white">
                        ➔ {item.hint}
                      </span>
                    )}
                    <span className="text-[2.3rem] leading-none">{item.emoji}</span>
                    <span className="text-center text-[0.78rem] font-extrabold text-gray-800">
                      {item.name}
                    </span>
                    <span className="flex h-[26px] w-[32px] items-center justify-center rounded-[8px] bg-[#6f8dca] text-[0.95rem] font-extrabold text-white">
                      {item.value}
                    </span>
                  </div>
                );
              })}
          </div>
        </section>
      </main>

      {/* MODAL DE AJUDA */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
          <div className="flex w-full max-w-[520px] flex-col gap-4 rounded-[20px] border-4 border-[#6f8dca] bg-white p-6 text-center">
            <h2 className="text-[1.5rem] font-black text-[#6f8dca]">
              COMO JOGAR - DECOMPOSIÇÃO
            </h2>
            <p className="font-bold text-slate-700">
              PARA ARRUMAR A MOCHILA, DIVIDIMOS OS MATERIAIS EM PARTES MENORES:
            </p>
            <ul className="flex flex-col gap-2 pl-5 text-left text-[0.92rem] list-disc">
              <li>
                <strong>2 ROTINAS POR NÍVEL:</strong> COMPLETE A ROTINA 1 E A ROTINA 2 PARA AVANÇAR DE NÍVEL.
              </li>
              <li>
                <strong>ESTOJO:</strong> ITENS PEQUENOS DE ESCREVER E MEDIR (LÁPIS, BORRACHA, RÉGUA, COMPASSO).
              </li>
              <li>
                <strong>BOLSO GRANDE:</strong> CADERNOS, LIVROS, PASTAS E DICIONÁRIOS.
              </li>
              <li>
                <strong>BOLSO LATERAL:</strong> GARRAFA DE ÁGUA OU GARRAFA TÉRMICA.
              </li>
              <li>
                <strong>ATENÇÃO À CAPACIDADE EXATA:</strong> NOS NÍVEIS AVANÇADOS, ALGUNS MATERIAIS NÃO CABEM NA SOMA! ESCOLHA A COMBINAÇÃO QUE ZERA CADA COMPARTIMENTO.
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="cursor-pointer rounded-[12px] bg-[#6f8dca] px-5 py-3 text-base font-extrabold text-white hover:bg-[#5b7ab7]"
            >
              ENTENDI!
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE FIM DE ROTINA / NÍVEL */}
      {endModalState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
          <div className="flex w-full max-w-[520px] flex-col gap-4 rounded-[20px] border-4 border-[#6f8dca] bg-white p-6 text-center">
            <h2 className="text-[1.5rem] font-black text-[#6f8dca]">
              {endModalState.victory
                ? hasNextRoutine
                  ? 'ROTINA 1 CONCLUÍDA!'
                  : hasNextLevel
                    ? `NÍVEL ${levelData.name} CONCLUÍDO!`
                    : 'PARABÉNS! MESTRE DA DECOMPOSIÇÃO!'
                : 'VAMOS TENTAR DE NOVO?'}
            </h2>
            <p className="font-bold text-slate-700">
              {endModalState.victory
                ? hasNextRoutine
                  ? `EXCELENTE! AGORA COMPLETE A ROTINA 2 DO NÍVEL ${levelData.name}.`
                  : hasNextLevel
                    ? 'VOCÊ COMPLETOU AS 2 ROTINAS! PRONTO PARA O PRÓXIMO DESAFIO?'
                    : 'VOCÊ VENCEU TODAS AS ROTINAS ATÉ O NÍVEL PESADELO!'
                : 'OBSERVE A CAPACIDADE DE CADA BOLSO E FAÇA A SOMA COM CALMA!'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => initLevel(currentLevel, currentRoutineIndex)}
                className="cursor-pointer rounded-[12px] bg-[#6f8dca] px-5 py-3 text-base font-extrabold text-white hover:bg-[#5b7ab7]"
              >
                {endModalState.victory
                  ? hasNextRoutine
                    ? 'REPETIR ROTINA'
                    : 'JOGAR NOVAMENTE'
                  : 'TENTAR NOVAMENTE'}
              </button>

              {endModalState.victory && (hasNextRoutine || hasNextLevel) && (
                <button
                  type="button"
                  onClick={() => {
                    if (hasNextRoutine) {
                      initLevel(currentLevel, currentRoutineIndex + 1);
                    } else if (hasNextLevel) {
                      initLevel(currentLevel + 1, 0);
                    }
                  }}
                  className="cursor-pointer rounded-[12px] bg-[#4caf50] px-5 py-3 text-base font-extrabold text-white hover:bg-[#43a047]"
                >
                  {hasNextRoutine ? 'ROTINA 2 ➔' : 'PRÓXIMO NÍVEL ➔'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}