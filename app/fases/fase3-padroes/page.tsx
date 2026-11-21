'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GameHud } from '@/components/game/game-hud';

type DishStatus = 'clean' | 'dirty' | 'broken';
type BinThemeClass = 'bin-pratos' | 'bin-copos' | 'bin-talheres' | 'bin-panelas';

interface BinConfig {
  id: string;
  label: string;
  shadowEmoji?: string;
  expectedCount: number;
  themeClass: BinThemeClass;
}

interface DishItem {
  id: string;
  name: string;
  tag?: string;
  emoji: string;
  status: DishStatus;
  targetBin: string;
}

interface PatternRoutine {
  title: string;
  instruction: string;
  bins: BinConfig[];
  items: DishItem[];
}

interface PatternLevelData {
  label: string;
  name: string;
  noFail: boolean;
  isShadowMode: boolean;
  routines: PatternRoutine[];
}

const LEVELS_OPTIONS = [
  { value: 0, label: '0 - APRENDIZAGEM (SOMBRAS - SEM ERRO)' },
  { value: 1, label: '1 - MUITO FÁCIL' },
  { value: 2, label: '2 - FÁCIL (LIMPOS VS SUJOS)' },
  { value: 3, label: '3 - NORMAL (2 BANDEJAS: PRATOS E COPOS)' },
  { value: 4, label: '4 - MÉDIO' },
  { value: 5, label: '5 - DIFÍCIL (3 BANDEJAS + SUJOS)' },
  { value: 6, label: '6 - MUITO DIFÍCIL' },
  { value: 7, label: '7 - EXTREMO' },
  { value: 8, label: '8 - PESADELO' },
];

const PATTERNS_LEVELS: Record<number, PatternLevelData> = {
  0: {
    label: '3 - 0',
    name: 'APRENDIZAGEM (SOMBRAS - SEM ERRO)',
    noFail: true,
    isShadowMode: true,
    routines: [
      {
        title: 'ROTINA 1 DE 2: CAFÉ DA MANHÃ (SOMBRAS)',
        instruction: 'OBSERVE AS FORMAS E OS PADRÕES! ENCAIXE CADA LOUÇA LIMPA NA SUA SOMBRA CORRESPONDENTE.',
        bins: [
          { id: 'sombra-prato', label: 'PRATO', shadowEmoji: '🍽️', expectedCount: 1, themeClass: 'bin-pratos' },
          { id: 'sombra-copo', label: 'COPO', shadowEmoji: '🥛', expectedCount: 1, themeClass: 'bin-copos' },
          { id: 'sombra-colher', label: 'COLHER', shadowEmoji: '🥄', expectedCount: 1, themeClass: 'bin-talheres' },
        ],
        items: [
          { id: 'r01_1', name: 'PRATO', emoji: '🍽️', status: 'clean', targetBin: 'sombra-prato' },
          { id: 'r01_2', name: 'COPO', emoji: '🥛', status: 'clean', targetBin: 'sombra-copo' },
          { id: 'r01_3', name: 'COLHER', emoji: '🥄', status: 'clean', targetBin: 'sombra-colher' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: LANCHE DA TARDE (SOMBRAS)',
        instruction: 'MUITO BEM! AGORA COMBINE AS NOVAS FORMAS COM SUAS SOMBRAS CORRESPONDENTES.',
        bins: [
          { id: 'sombra-tigela', label: 'TIGELA', shadowEmoji: '🥣', expectedCount: 1, themeClass: 'bin-pratos' },
          { id: 'sombra-xicara', label: 'XÍCARA', shadowEmoji: '☕', expectedCount: 1, themeClass: 'bin-copos' },
          { id: 'sombra-garfo', label: 'GARFO E FACA', shadowEmoji: '🍴', expectedCount: 1, themeClass: 'bin-talheres' },
        ],
        items: [
          { id: 'r02_1', name: 'TIGELA', emoji: '🥣', status: 'clean', targetBin: 'sombra-tigela' },
          { id: 'r02_2', name: 'XÍCARA', emoji: '☕', status: 'clean', targetBin: 'sombra-xicara' },
          { id: 'r02_3', name: 'GARFO E FACA', emoji: '🍴', status: 'clean', targetBin: 'sombra-garfo' },
        ],
      },
    ],
  },
  1: {
    label: '3 - 1',
    name: 'MUITO FÁCIL',
    noFail: false,
    isShadowMode: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: TUDO LIMPO PARA O ARMÁRIO',
        instruction: 'TODAS AS LOUÇAS ESTÃO LIMPAS! GUARDE TODAS NA BANDEJA DO ARMÁRIO.',
        bins: [{ id: 'armario', label: 'ARMÁRIO DA COZINHA', expectedCount: 4, themeClass: 'bin-pratos' }],
        items: [
          { id: 'r11_1', name: 'PRATO', emoji: '🍽️', status: 'clean', targetBin: 'armario' },
          { id: 'r11_2', name: 'COPO', emoji: '🥛', status: 'clean', targetBin: 'armario' },
          { id: 'r11_3', name: 'XÍCARA', emoji: '☕', status: 'clean', targetBin: 'armario' },
          { id: 'r11_4', name: 'COLHER', emoji: '🥄', status: 'clean', targetBin: 'armario' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: UM ITEM SUJO NO ESCORREDOR',
        instruction: 'FIQUE ATENTO! AGORA HÁ 1 PRATO SUJO MISTURADO. GUARDE APENAS AS 4 LOUÇAS LIMPAS.',
        bins: [{ id: 'armario', label: 'LOUÇAS LIMPAS', expectedCount: 4, themeClass: 'bin-pratos' }],
        items: [
          { id: 'r12_1', name: 'TIGELA', emoji: '🥣', status: 'clean', targetBin: 'armario' },
          { id: 'r12_2', name: 'CANECA', emoji: '☕', status: 'clean', targetBin: 'armario' },
          { id: 'r12_3', name: 'GARFO E FACA', emoji: '🍴', status: 'clean', targetBin: 'armario' },
          { id: 'r12_4', name: 'PRATO RASO', emoji: '🍽️', status: 'clean', targetBin: 'armario' },
          { id: 'r12_5', name: 'PRATO SUJO', emoji: '🍽️', status: 'dirty', targetBin: 'none' },
        ],
      },
    ],
  },
  2: {
    label: '3 - 2',
    name: 'FÁCIL (LIMPOS VS SUJOS)',
    noFail: false,
    isShadowMode: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: LIMPOS VS SUJOS (ALMOÇO)',
        instruction: 'SEPARE POR ESTADO! GUARDE NA BANDEJA APENAS AS LOUÇAS LIMPAS E DEIXE AS SUJAS NO ESCORREDOR.',
        bins: [{ id: 'limpas', label: 'LOUÇAS LIMPAS', expectedCount: 4, themeClass: 'bin-pratos' }],
        items: [
          { id: 'r21_1', name: 'PRATO', emoji: '🍽️', status: 'clean', targetBin: 'limpas' },
          { id: 'r21_2', name: 'COPO', emoji: '🥛', status: 'clean', targetBin: 'limpas' },
          { id: 'r21_3', name: 'TIGELA', emoji: '🥣', status: 'clean', targetBin: 'limpas' },
          { id: 'r21_4', name: 'COLHER', emoji: '🥄', status: 'clean', targetBin: 'limpas' },
          { id: 'r21_5', name: 'PRATO SUJO', emoji: '🍽️', status: 'dirty', targetBin: 'none' },
          { id: 'r21_6', name: 'COPO SUJO', emoji: '🥛', status: 'dirty', targetBin: 'none' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: LIMPOS VS SUJOS (JANTAR)',
        instruction: 'IDENTIFIQUE O PADRÃO DE LIMPEZA! GUARDE AS 5 PEÇAS BRILHANDO E IGNORE AS SUJAS.',
        bins: [{ id: 'limpas', label: 'LOUÇAS LIMPAS', expectedCount: 5, themeClass: 'bin-copos' }],
        items: [
          { id: 'r22_1', name: 'XÍCARA', emoji: '☕', status: 'clean', targetBin: 'limpas' },
          { id: 'r22_2', name: 'PANELA', emoji: '🍲', status: 'clean', targetBin: 'limpas' },
          { id: 'r22_3', name: 'FRIGIDEIRA', emoji: '🍳', status: 'clean', targetBin: 'limpas' },
          { id: 'r22_4', name: 'GARFO E FACA', emoji: '🍴', status: 'clean', targetBin: 'limpas' },
          { id: 'r22_5', name: 'PRATO', emoji: '🍽️', status: 'clean', targetBin: 'limpas' },
          { id: 'r22_6', name: 'PANELA SUJA', emoji: '🍲', status: 'dirty', targetBin: 'none' },
          { id: 'r22_7', name: 'TIGELA SUJA', emoji: '🥣', status: 'dirty', targetBin: 'none' },
        ],
      },
    ],
  },
  3: {
    label: '3 - 3',
    name: 'NORMAL (2 BANDEJAS: PRATOS E COPOS)',
    noFail: false,
    isShadowMode: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: PRATOS E COPOS',
        instruction: 'AGORA TEMOS DOIS PADRÕES! SEPARE OS PRATOS E OS COPOS LIMPOS NAS BANDEJAS CERTAS.',
        bins: [
          { id: 'pratos', label: 'PRATOS', expectedCount: 2, themeClass: 'bin-pratos' },
          { id: 'copos', label: 'COPOS E XÍCARAS', expectedCount: 2, themeClass: 'bin-copos' },
        ],
        items: [
          { id: 'r31_1', name: 'PRATO FUNDO', emoji: '🥣', status: 'clean', targetBin: 'pratos' },
          { id: 'r31_2', name: 'PRATO RASO', emoji: '🍽️', status: 'clean', targetBin: 'pratos' },
          { id: 'r31_3', name: 'COPO', emoji: '🥛', status: 'clean', targetBin: 'copos' },
          { id: 'r31_4', name: 'XÍCARA', emoji: '☕', status: 'clean', targetBin: 'copos' },
          { id: 'r31_5', name: 'PRATO SUJO', emoji: '🍽️', status: 'dirty', targetBin: 'none' },
          { id: 'r31_6', name: 'COPO SUJO', emoji: '🥛', status: 'dirty', targetBin: 'none' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: TALHERES E PANELAS',
        instruction: 'SEPARE OS UTENSÍLIOS LIMPOS ENTRE TALHERES E PANELAS!',
        bins: [
          { id: 'talheres', label: 'TALHERES', expectedCount: 3, themeClass: 'bin-talheres' },
          { id: 'panelas', label: 'PANELAS', expectedCount: 2, themeClass: 'bin-panelas' },
        ],
        items: [
          { id: 'r32_1', name: 'COLHER', emoji: '🥄', status: 'clean', targetBin: 'talheres' },
          { id: 'r32_2', name: 'GARFO E FACA', emoji: '🍴', status: 'clean', targetBin: 'talheres' },
          { id: 'r32_3', name: 'FACA DE PÃO', emoji: '🔪', status: 'clean', targetBin: 'talheres' },
          { id: 'r32_4', name: 'PANELA FUNDA', emoji: '🍲', status: 'clean', targetBin: 'panelas' },
          { id: 'r32_5', name: 'FRIGIDEIRA', emoji: '🍳', status: 'clean', targetBin: 'panelas' },
          { id: 'r32_6', name: 'COLHER SUJA', emoji: '🥄', status: 'dirty', targetBin: 'none' },
          { id: 'r32_7', name: 'FRIGIDEIRA SUJA', emoji: '🍳', status: 'dirty', targetBin: 'none' },
        ],
      },
    ],
  },
  4: {
    label: '3 - 4',
    name: 'MÉDIO',
    noFail: false,
    isShadowMode: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: ORGANIZANDO A LOUÇA DA FESTA',
        instruction: 'SEPARE AS 6 LOUÇAS LIMPAS ENTRE AS BANDEJAS DE PRATOS E COPOS/TAÇAS.',
        bins: [
          { id: 'pratos', label: 'PRATOS E TIGELAS', expectedCount: 3, themeClass: 'bin-pratos' },
          { id: 'copos', label: 'COPOS E CANECAS', expectedCount: 3, themeClass: 'bin-copos' },
        ],
        items: [
          { id: 'r41_1', name: 'PRATO RASO', emoji: '🍽️', status: 'clean', targetBin: 'pratos' },
          { id: 'r41_2', name: 'TIGELA SOBREMESA', emoji: '🥣', status: 'clean', targetBin: 'pratos' },
          { id: 'r41_3', name: 'PRATO BOLO', emoji: '🍽️', status: 'clean', targetBin: 'pratos' },
          { id: 'r41_4', name: 'COPO SUCO', emoji: '🥛', status: 'clean', targetBin: 'copos' },
          { id: 'r41_5', name: 'XÍCARA CHÁ', emoji: '☕', status: 'clean', targetBin: 'copos' },
          { id: 'r41_6', name: 'TAÇA ÁGUA', emoji: '🍷', status: 'clean', targetBin: 'copos' },
          { id: 'r41_7', name: 'PRATO BOLO SUJO', emoji: '🍽️', status: 'dirty', targetBin: 'none' },
          { id: 'r41_8', name: 'COPO SUJO', emoji: '🥛', status: 'dirty', targetBin: 'none' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: COZINHA DE DOMINGO',
        instruction: 'CLASSIFIQUE OS ITENS LIMPOS ENTRE COPOS E TALHERES IGNORANDO OS SUJOS.',
        bins: [
          { id: 'copos', label: 'COPOS E XÍCARAS', expectedCount: 3, themeClass: 'bin-copos' },
          { id: 'talheres', label: 'TALHERES', expectedCount: 3, themeClass: 'bin-talheres' },
        ],
        items: [
          { id: 'r42_1', name: 'COPO VIDRO', emoji: '🥛', status: 'clean', targetBin: 'copos' },
          { id: 'r42_2', name: 'CANECA', emoji: '☕', status: 'clean', targetBin: 'copos' },
          { id: 'r42_3', name: 'BULE CHÁ', emoji: '🫖', status: 'clean', targetBin: 'copos' },
          { id: 'r42_4', name: 'COLHER SOPA', emoji: '🥄', status: 'clean', targetBin: 'talheres' },
          { id: 'r42_5', name: 'GARFO E FACA', emoji: '🍴', status: 'clean', targetBin: 'talheres' },
          { id: 'r42_6', name: 'PAUZINHOS', emoji: '🥢', status: 'clean', targetBin: 'talheres' },
          { id: 'r42_7', name: 'CANECA SUJA', emoji: '☕', status: 'dirty', targetBin: 'none' },
          { id: 'r42_8', name: 'GARFO SUJO', emoji: '🍴', status: 'dirty', targetBin: 'none' },
        ],
      },
    ],
  },
  5: {
    label: '3 - 5',
    name: 'DIFÍCIL (3 BANDEJAS + SUJOS)',
    noFail: false,
    isShadowMode: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: 3 BANDEJAS + SUJOS (ALMOÇO)',
        instruction: 'DESAFIO COMPLETO! CLASSIFIQUE PRATOS, COPOS E TALHERES LIMPOS NAS TRÊS BANDEJAS.',
        bins: [
          { id: 'pratos', label: 'PRATOS', expectedCount: 2, themeClass: 'bin-pratos' },
          { id: 'copos', label: 'COPOS', expectedCount: 2, themeClass: 'bin-copos' },
          { id: 'talheres', label: 'TALHERES', expectedCount: 2, themeClass: 'bin-talheres' },
        ],
        items: [
          { id: 'r51_1', name: 'PRATO', emoji: '🍽️', status: 'clean', targetBin: 'pratos' },
          { id: 'r51_2', name: 'TIGELA', emoji: '🥣', status: 'clean', targetBin: 'pratos' },
          { id: 'r51_3', name: 'COPO', emoji: '🥛', status: 'clean', targetBin: 'copos' },
          { id: 'r51_4', name: 'CANECA', emoji: '☕', status: 'clean', targetBin: 'copos' },
          { id: 'r51_5', name: 'COLHER', emoji: '🥄', status: 'clean', targetBin: 'talheres' },
          { id: 'r51_6', name: 'GARFO E FACA', emoji: '🍴', status: 'clean', targetBin: 'talheres' },
          { id: 'r51_7', name: 'PRATO SUJO', emoji: '🍽️', status: 'dirty', targetBin: 'none' },
          { id: 'r51_8', name: 'COLHER SUJA', emoji: '🥄', status: 'dirty', targetBin: 'none' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: 3 BANDEJAS + SUJOS (JANTAR)',
        instruction: 'SEPARE PRATOS, COPOS E PANELAS LIMPOS NAS TRÊS BANDEJAS CERTAS!',
        bins: [
          { id: 'pratos', label: 'PRATOS', expectedCount: 2, themeClass: 'bin-pratos' },
          { id: 'copos', label: 'COPOS', expectedCount: 2, themeClass: 'bin-copos' },
          { id: 'panelas', label: 'PANELAS', expectedCount: 2, themeClass: 'bin-panelas' },
        ],
        items: [
          { id: 'r52_1', name: 'PRATO FUNDO', emoji: '🥣', status: 'clean', targetBin: 'pratos' },
          { id: 'r52_2', name: 'PRATO RASO', emoji: '🍽️', status: 'clean', targetBin: 'pratos' },
          { id: 'r52_3', name: 'COPO', emoji: '🥛', status: 'clean', targetBin: 'copos' },
          { id: 'r52_4', name: 'XÍCARA', emoji: '☕', status: 'clean', targetBin: 'copos' },
          { id: 'r52_5', name: 'PANELA', emoji: '🍲', status: 'clean', targetBin: 'panelas' },
          { id: 'r52_6', name: 'FRIGIDEIRA', emoji: '🍳', status: 'clean', targetBin: 'panelas' },
          { id: 'r52_7', name: 'XÍCARA SUJA', emoji: '☕', status: 'dirty', targetBin: 'none' },
          { id: 'r52_8', name: 'PANELA SUJA', emoji: '🍲', status: 'dirty', targetBin: 'none' },
        ],
      },
    ],
  },
  6: {
    label: '3 - 6',
    name: 'MUITO DIFÍCIL',
    noFail: false,
    isShadowMode: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: 4 CATEGORIAS DE LOUÇAS',
        instruction: 'AGORA SÃO 4 PADRÕES! SEPARE PRATOS, COPOS, TALHERES E PANELAS LIMPOS.',
        bins: [
          { id: 'pratos', label: 'PRATOS', expectedCount: 2, themeClass: 'bin-pratos' },
          { id: 'copos', label: 'COPOS', expectedCount: 2, themeClass: 'bin-copos' },
          { id: 'talheres', label: 'TALHERES', expectedCount: 2, themeClass: 'bin-talheres' },
          { id: 'panelas', label: 'PANELAS', expectedCount: 2, themeClass: 'bin-panelas' },
        ],
        items: [
          { id: 'r61_1', name: 'PRATO', emoji: '🍽️', status: 'clean', targetBin: 'pratos' },
          { id: 'r61_2', name: 'TIGELA', emoji: '🥣', status: 'clean', targetBin: 'pratos' },
          { id: 'r61_3', name: 'COPO', emoji: '🥛', status: 'clean', targetBin: 'copos' },
          { id: 'r61_4', name: 'XÍCARA', emoji: '☕', status: 'clean', targetBin: 'copos' },
          { id: 'r61_5', name: 'COLHER', emoji: '🥄', status: 'clean', targetBin: 'talheres' },
          { id: 'r61_6', name: 'GARFO E FACA', emoji: '🍴', status: 'clean', targetBin: 'talheres' },
          { id: 'r61_7', name: 'PANELA', emoji: '🍲', status: 'clean', targetBin: 'panelas' },
          { id: 'r61_8', name: 'FRIGIDEIRA', emoji: '🍳', status: 'clean', targetBin: 'panelas' },
          { id: 'r61_9', name: 'PRATO SUJO', emoji: '🍽️', status: 'dirty', targetBin: 'none' },
          { id: 'r61_10', name: 'COPO SUJO', emoji: '🥛', status: 'dirty', targetBin: 'none' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: LOUÇAS TRINCADAS NÃO VÃO PARA O ARMÁRIO!',
        instruction: 'CUIDADO! ALÉM DAS SUJAS, HÁ LOUÇAS RACHADAS (💥). GUARDE APENAS AS LIMPAS E INTEIRAS!',
        bins: [
          { id: 'pratos', label: 'PRATOS INTEIROS', expectedCount: 2, themeClass: 'bin-pratos' },
          { id: 'copos', label: 'COPOS INTEIROS', expectedCount: 2, themeClass: 'bin-copos' },
          { id: 'talheres', label: 'TALHERES', expectedCount: 2, themeClass: 'bin-talheres' },
        ],
        items: [
          { id: 'r62_1', name: 'PRATO RASO', emoji: '🍽️', status: 'clean', targetBin: 'pratos' },
          { id: 'r62_2', name: 'TIGELA', emoji: '🥣', status: 'clean', targetBin: 'pratos' },
          { id: 'r62_3', name: 'COPO VIDRO', emoji: '🥛', status: 'clean', targetBin: 'copos' },
          { id: 'r62_4', name: 'CANECA', emoji: '☕', status: 'clean', targetBin: 'copos' },
          { id: 'r62_5', name: 'COLHER', emoji: '🥄', status: 'clean', targetBin: 'talheres' },
          { id: 'r62_6', name: 'PAUZINHOS', emoji: '🥢', status: 'clean', targetBin: 'talheres' },
          { id: 'r62_7', name: 'PRATO RACHADO', emoji: '🍽️', status: 'broken', targetBin: 'none' },
          { id: 'r62_8', name: 'COPO TRINCADO', emoji: '🥛', status: 'broken', targetBin: 'none' },
          { id: 'r62_9', name: 'TIGELA SUJA', emoji: '🥣', status: 'dirty', targetBin: 'none' },
        ],
      },
    ],
  },
  7: {
    label: '3 - 7',
    name: 'EXTREMO',
    noFail: false,
    isShadowMode: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: PADRÃO POR MATERIAL (VIDRO, METAL E MADEIRA)',
        instruction: 'NÍVEL EXTREMO! OBSERVE O MATERIAL NA ETIQUETA E ORGANIZE POR VIDRO, METAL E MADEIRA!',
        bins: [
          { id: 'vidro', label: 'VIDRO / PORCELANA', expectedCount: 3, themeClass: 'bin-pratos' },
          { id: 'metal', label: 'METAL / INOX', expectedCount: 3, themeClass: 'bin-copos' },
          { id: 'madeira', label: 'MADEIRA / BAMBU', expectedCount: 2, themeClass: 'bin-talheres' },
        ],
        items: [
          { id: 'r71_1', name: 'COPO', tag: 'VIDRO', emoji: '🥛', status: 'clean', targetBin: 'vidro' },
          { id: 'r71_2', name: 'PRATO', tag: 'PORCELANA', emoji: '🍽️', status: 'clean', targetBin: 'vidro' },
          { id: 'r71_3', name: 'XÍCARA', tag: 'PORCELANA', emoji: '☕', status: 'clean', targetBin: 'vidro' },
          { id: 'r71_4', name: 'PANELA', tag: 'INOX', emoji: '🍲', status: 'clean', targetBin: 'metal' },
          { id: 'r71_5', name: 'GARFO E FACA', tag: 'INOX', emoji: '🍴', status: 'clean', targetBin: 'metal' },
          { id: 'r71_6', name: 'FRIGIDEIRA', tag: 'METAL', emoji: '🍳', status: 'clean', targetBin: 'metal' },
          { id: 'r71_7', name: 'COLHER PAU', tag: 'MADEIRA', emoji: '🥄', status: 'clean', targetBin: 'madeira' },
          { id: 'r71_8', name: 'HASHI', tag: 'BAMBU', emoji: '🥢', status: 'clean', targetBin: 'madeira' },
          { id: 'r71_9', name: 'COPO TRINCADO', tag: 'VIDRO', emoji: '🥛', status: 'broken', targetBin: 'none' },
          { id: 'r71_10', name: 'PANELA SUJA', tag: 'INOX', emoji: '🍲', status: 'dirty', targetBin: 'none' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: PADRÃO COMPOSTO (TIPO + ESTADO)',
        instruction: 'SEPARE AS 9 PEÇAS LIMPAS ENTRE AS 3 BANDEJAS IGNORANDO AS SUJAS E RACHADAS!',
        bins: [
          { id: 'pratos', label: 'PRATOS E TIGELAS', expectedCount: 3, themeClass: 'bin-pratos' },
          { id: 'copos', label: 'COPOS E BULES', expectedCount: 3, themeClass: 'bin-copos' },
          { id: 'talheres', label: 'TALHERES E FACAS', expectedCount: 3, themeClass: 'bin-talheres' },
        ],
        items: [
          { id: 'r72_1', name: 'PRATO RASO', emoji: '🍽️', status: 'clean', targetBin: 'pratos' },
          { id: 'r72_2', name: 'PRATO FUNDO', emoji: '🥣', status: 'clean', targetBin: 'pratos' },
          { id: 'r72_3', name: 'TIGELA', emoji: '🥗', status: 'clean', targetBin: 'pratos' },
          { id: 'r72_4', name: 'COPO', emoji: '🥛', status: 'clean', targetBin: 'copos' },
          { id: 'r72_5', name: 'XÍCARA', emoji: '☕', status: 'clean', targetBin: 'copos' },
          { id: 'r72_6', name: 'BULE', emoji: '🫖', status: 'clean', targetBin: 'copos' },
          { id: 'r72_7', name: 'COLHER', emoji: '🥄', status: 'clean', targetBin: 'talheres' },
          { id: 'r72_8', name: 'GARFO E FACA', emoji: '🍴', status: 'clean', targetBin: 'talheres' },
          { id: 'r72_9', name: 'FACA CHEF', emoji: '🔪', status: 'clean', targetBin: 'talheres' },
          { id: 'r72_10', name: 'PRATO SUJO', emoji: '🍽️', status: 'dirty', targetBin: 'none' },
          { id: 'r72_11', name: 'BULE TRINCADO', emoji: '🫖', status: 'broken', targetBin: 'none' },
        ],
      },
    ],
  },
  8: {
    label: '3 - 8',
    name: 'PESADELO',
    noFail: false,
    isShadowMode: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: BANQUETE COMPLETO (4 BANDEJAS + SUJOS + QUEBRADOS)',
        instruction: 'MODO PESADELO! 10 LOUÇAS LIMPAS E 4 DISTRATORES. CLASSIFIQUE COM ZERO MARGEM PARA ERRO!',
        bins: [
          { id: 'pratos', label: 'PRATOS', expectedCount: 3, themeClass: 'bin-pratos' },
          { id: 'copos', label: 'COPOS', expectedCount: 3, themeClass: 'bin-copos' },
          { id: 'talheres', label: 'TALHERES', expectedCount: 2, themeClass: 'bin-talheres' },
          { id: 'panelas', label: 'PANELAS', expectedCount: 2, themeClass: 'bin-panelas' },
        ],
        items: [
          { id: 'r81_1', name: 'PRATO RASO', emoji: '🍽️', status: 'clean', targetBin: 'pratos' },
          { id: 'r81_2', name: 'TIGELA', emoji: '🥣', status: 'clean', targetBin: 'pratos' },
          { id: 'r81_3', name: 'SALADEIRA', emoji: '🥗', status: 'clean', targetBin: 'pratos' },
          { id: 'r81_4', name: 'COPO', emoji: '🥛', status: 'clean', targetBin: 'copos' },
          { id: 'r81_5', name: 'XÍCARA', emoji: '☕', status: 'clean', targetBin: 'copos' },
          { id: 'r81_6', name: 'TAÇA', emoji: '🍷', status: 'clean', targetBin: 'copos' },
          { id: 'r81_7', name: 'COLHER', emoji: '🥄', status: 'clean', targetBin: 'talheres' },
          { id: 'r81_8', name: 'GARFO E FACA', emoji: '🍴', status: 'clean', targetBin: 'talheres' },
          { id: 'r81_9', name: 'PANELA', emoji: '🍲', status: 'clean', targetBin: 'panelas' },
          { id: 'r81_10', name: 'FRIGIDEIRA', emoji: '🍳', status: 'clean', targetBin: 'panelas' },
          { id: 'r81_11', name: 'PRATO SUJO', emoji: '🍽️', status: 'dirty', targetBin: 'none' },
          { id: 'r81_12', name: 'TAÇA RACHADA', emoji: '🍷', status: 'broken', targetBin: 'none' },
          { id: 'r81_13', name: 'FRIGIDEIRA SUJA', emoji: '🍳', status: 'dirty', targetBin: 'none' },
          { id: 'r81_14', name: 'TIGELA RACHADA', emoji: '🥣', status: 'broken', targetBin: 'none' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: CLASSIFICAÇÃO MESTRE POR MATERIAL E USO',
        instruction: 'ÚLTIMA ROTINA DO MODO PESADELO! SEPARE POR VIDRO, INOX, MADEIRA E CERÂMICA IGNORANDO OS DANIFICADOS!',
        bins: [
          { id: 'vidro', label: 'VIDRO', expectedCount: 3, themeClass: 'bin-pratos' },
          { id: 'inox', label: 'INOX', expectedCount: 3, themeClass: 'bin-copos' },
          { id: 'madeira', label: 'MADEIRA', expectedCount: 2, themeClass: 'bin-talheres' },
          { id: 'ceramica', label: 'CERÂMICA', expectedCount: 2, themeClass: 'bin-panelas' },
        ],
        items: [
          { id: 'r82_1', name: 'COPO', tag: 'VIDRO', emoji: '🥛', status: 'clean', targetBin: 'vidro' },
          { id: 'r82_2', name: 'TAÇA', tag: 'VIDRO', emoji: '🍷', status: 'clean', targetBin: 'vidro' },
          { id: 'r82_3', name: 'JARRA', tag: 'VIDRO', emoji: '🫗', status: 'clean', targetBin: 'vidro' },
          { id: 'r82_4', name: 'PANELA', tag: 'INOX', emoji: '🍲', status: 'clean', targetBin: 'inox' },
          { id: 'r82_5', name: 'COLHER', tag: 'INOX', emoji: '🥄', status: 'clean', targetBin: 'inox' },
          { id: 'r82_6', name: 'GARFO E FACA', tag: 'INOX', emoji: '🍴', status: 'clean', targetBin: 'inox' },
          { id: 'r82_7', name: 'COLHER PAU', tag: 'MADEIRA', emoji: '🥄', status: 'clean', targetBin: 'madeira' },
          { id: 'r82_8', name: 'HASHI', tag: 'MADEIRA', emoji: '🥢', status: 'clean', targetBin: 'madeira' },
          { id: 'r82_9', name: 'XÍCARA', tag: 'CERÂMICA', emoji: '☕', status: 'clean', targetBin: 'ceramica' },
          { id: 'r82_10', name: 'BULE', tag: 'CERÂMICA', emoji: '🫖', status: 'clean', targetBin: 'ceramica' },
          { id: 'r82_11', name: 'JARRA RACHADA', tag: 'VIDRO', emoji: '🫗', status: 'broken', targetBin: 'none' },
          { id: 'r82_12', name: 'COLHER SUJA', tag: 'INOX', emoji: '🥄', status: 'dirty', targetBin: 'none' },
          { id: 'r82_13', name: 'XÍCARA RACHADA', tag: 'CERÂMICA', emoji: '☕', status: 'broken', targetBin: 'none' },
          { id: 'r82_14', name: 'PANELA SUJA', tag: 'INOX', emoji: '🍲', status: 'dirty', targetBin: 'none' },
        ],
      },
    ],
  },
};

const BIN_LABEL_THEME_STYLES: Record<BinThemeClass, string> = {
  'bin-pratos': 'border-blue-600 text-blue-700',
  'bin-copos': 'border-amber-600 text-amber-700',
  'bin-talheres': 'border-emerald-600 text-emerald-700',
  'bin-panelas': 'border-violet-600 text-violet-700',
};

export default function Fase3PadroesPage() {
  const router = useRouter();

  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [currentRoutineIndex, setCurrentRoutineIndex] = useState<number>(0);
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [lives, setLives] = useState<number>(3);

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverBinId, setDragOverBinId] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [endModalState, setEndModalState] = useState<{ open: boolean; victory: boolean }>({
    open: false,
    victory: false,
  });

  const levelData = PATTERNS_LEVELS[currentLevel];
  const routineData = levelData.routines[currentRoutineIndex];
  const totalRequired = routineData.items.filter((i) => i.status === 'clean').length;

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
    setCurrentLevel(lvlIndex);
    setCurrentRoutineIndex(routineIdx);
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
          setTimeout(() => setEndModalState({ open: true, victory: false }), 750);
        }
        return nextLives;
      });
    }
  };

  const handleBinDrop = (binId: string) => {
    if (!draggedItemId) return;
    const item = routineData.items.find((i) => i.id === draggedItemId);
    if (!item || placedIds.includes(item.id)) return;

    // Regra 1: Não guardar louça suja
    if (item.status === 'dirty') {
      registerMistake('ESSA LOUÇA ESTÁ SUJA! NÃO GUARDE NO ARMÁRIO!');
      return;
    }

    // Regra 2: Não guardar louça rachada/quebrada
    if (item.status === 'broken') {
      registerMistake('ESSA LOUÇA ESTÁ RACHADA! DEIXE FORA DO ARMÁRIO!');
      return;
    }

    // Regra 3: Verificar padrão da bandeja/sombra
    if (item.targetBin !== binId) {
      const targetBinObj = routineData.bins.find((b) => b.id === binId);
      registerMistake(`ESSE ITEM NÃO COMBINA COM ${targetBinObj?.label || 'ESTA BANDEJA'}!`);
      return;
    }

    // Acerto
    const updatedPlaced = [...placedIds, item.id];
    setPlacedIds(updatedPlaced);
    showFeedback(`ISSO AÍ! PADRÃO CORRETO (${item.name})!`, true);

    if (updatedPlaced.length === totalRequired) {
      setTimeout(() => setEndModalState({ open: true, victory: true }), 750);
    }
  };

  const renderDishCard = (item: DishItem, isPlaced: boolean) => {
    const isDirty = item.status === 'dirty';
    const isBroken = item.status === 'broken';

    const statusStyles = isDirty
      ? 'bg-amber-100 border-amber-700'
      : isBroken
        ? 'bg-red-100 border-red-600'
        : isPlaced
          ? 'bg-white border-[#4caf50]'
          : 'bg-white border-[#6f8dca]';

    return (
      <div
        key={item.id}
        draggable={!isPlaced}
        onDragStart={(e) => {
          if (isPlaced) return;
          setDraggedItemId(item.id);
          e.dataTransfer.setData('text/plain', item.id);
        }}
        onDragEnd={() => setDraggedItemId(null)}
        className={`relative flex flex-col items-center justify-center gap-1 rounded-[14px] border-[3px] p-2 transition-all duration-150 ${statusStyles} ${
          isPlaced
            ? 'h-[92px] w-[92px] cursor-default shadow-xs'
            : 'h-[112px] w-[112px] cursor-grab shadow-[0_4px_8px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.14)] active:cursor-grabbing'
        }`}
      >
        {isDirty ? (
          <span
            title="Sujo"
            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-800 text-[0.95rem] text-white"
          >
            💩
          </span>
        ) : isBroken ? (
          <span
            title="Rachado"
            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-[0.9rem] text-white"
          >
            💥
          </span>
        ) : (
          <span title="Limpo" className="absolute top-1.5 right-1.5 text-[0.85rem]">
            ✨
          </span>
        )}

        <span className="text-[2.3rem] leading-none">{item.emoji}</span>
        <span className="text-center text-[0.74rem] font-extrabold text-gray-800">
          {item.name}
        </span>

        {item.tag && (
          <span className="rounded-[6px] bg-slate-200 px-1.5 py-0.5 text-[0.62rem] font-extrabold text-slate-700">
            {item.tag}
          </span>
        )}
      </div>
    );
  };

  const hasNextRoutine = currentRoutineIndex + 1 < levelData.routines.length;
  const hasNextLevel = Boolean(PATTERNS_LEVELS[currentLevel + 1]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#e5e4e4] p-4 font-sans text-gray-800 select-none">
      <main className="relative flex w-full max-w-[1140px] flex-col gap-4 rounded-[20px] border-[3px] border-[#c8d1d9] bg-[#e5e4e4] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
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
            className={`absolute top-[86px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-[16px] border-[3px] bg-white px-[22px] py-2.5 text-[1.1rem] font-extrabold shadow-[0_6px_18px_rgba(0,0,0,0.15)] ${
              feedback.isSuccess
                ? 'border-[#4caf50] text-[#2e7d32]'
                : 'border-[#e05252] text-[#c62828]'
            }`}
          >
            <span>{feedback.isSuccess ? '😄👍' : '🤔✋'}</span>
            <span>{feedback.message}</span>
          </div>
        )}

        {/* ÁREA SUPERIOR: ESCORREDOR DE LOUÇAS (ORIGEM DO DRAG) */}
        <section
          className="flex flex-col gap-3 rounded-[18px] bg-[#c8d1d9] p-3.5"
          aria-label="Escorredor de Louças"
        >
          <div className="text-center text-[0.85rem] font-extrabold text-slate-700">
            ESCORREDOR DE LOUÇAS (ARRASTE OS ITENS LIMPOS PARA O PADRÃO CERTO)
          </div>

          <div className="flex min-h-[118px] flex-wrap items-center justify-center gap-3">
            {routineData.items
              .filter((item) => !placedIds.includes(item.id))
              .map((item) => renderDishCard(item, false))}
          </div>
        </section>

        {/* ÁREA INFERIOR: BANDEJAS / SOMBRAS DE DESTINO */}
        <section
          className="grid min-h-[210px] grid-cols-[repeat(auto-fit,minmax(215px,1fr))] gap-3.5"
          aria-label="Bandejas de Organização"
        >
          {routineData.bins.map((bin) => {
            const placedInThisBin = routineData.items.filter(
              (item) => placedIds.includes(item.id) && item.targetBin === bin.id
            );
            const isCompleted = placedInThisBin.length === bin.expectedCount;
            const isDragOver = dragOverBinId === bin.id;

            return (
              <div
                key={bin.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverBinId(bin.id);
                }}
                onDragLeave={() => setDragOverBinId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverBinId(null);
                  handleBinDrop(bin.id);
                  setDraggedItemId(null);
                }}
                className={`flex flex-col justify-between gap-2.5 rounded-[18px] border-[3px] p-3 transition-all duration-150 ${
                  isCompleted
                    ? 'border-solid border-[#4caf50] bg-[#f0fdf4]'
                    : isDragOver
                      ? 'scale-[1.02] border-solid border-[#6f8dca] bg-[#dbeafe]'
                      : 'border-dashed border-[#6f8dca] bg-[#f8fafc]'
                }`}
              >
                <div className="flex min-h-[115px] flex-1 flex-wrap items-center justify-center gap-2">
                  {levelData.isShadowMode && placedInThisBin.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
                      <span className="text-[1.2rem] font-black text-[#e05252]">⬇</span>
                      <span className="text-[3.4rem] leading-none brightness-0 opacity-30 transition-transform">
                        {bin.shadowEmoji}
                      </span>
                    </div>
                  ) : (
                    placedInThisBin.map((item) => renderDishCard(item, true))
                  )}
                </div>

                <div
                  className={`rounded-[10px] border-2 bg-white px-2.5 py-2 text-center text-[0.88rem] font-extrabold tracking-wide ${
                    BIN_LABEL_THEME_STYLES[bin.themeClass]
                  }`}
                >
                  {bin.label} ({placedInThisBin.length}/{bin.expectedCount})
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* MODAL DE AJUDA */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
          <div className="flex w-full max-w-[520px] flex-col gap-4 rounded-[20px] border-4 border-[#6f8dca] bg-white p-6 text-center">
            <h2 className="text-[1.5rem] font-black text-[#6f8dca]">
              COMO JOGAR - RECONHECIMENTO DE PADRÕES
            </h2>
            <p className="font-bold text-slate-700">
              RECONHECER PADRÕES É ENCONTRAR SEMELHANÇAS DE FORMA, ESTADO, MATERIAL E USO:
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-left text-[0.92rem]">
              <li>
                <strong>2 ROTINAS POR NÍVEL:</strong> COMPLETE AS 2 ROTINAS DA COZINHA PARA AVANÇAR DE NÍVEL.
              </li>
              <li>
                <strong>ESTADO (LIMPO VS SUJO/QUEBRADO):</strong> GUARDE APENAS LOUÇAS LIMPAS E INTEIRAS. DEIXE AS SUJAS (💩) OU TRINCADAS (💥) NO ESCORREDOR!
              </li>
              <li>
                <strong>PADRÕES DE CATEGORIA E MATERIAL:</strong> SEPARE PRATOS, COPOS, TALHERES, PANELAS OU UTENSÍLIOS DE MADEIRA NAS BANDEJAS INDICADAS.
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
                    : 'PARABÉNS! MESTRE DOS PADRÕES!'
                : 'VAMOS TENTAR DE NOVO?'}
            </h2>
            <p className="font-bold text-slate-700">
              {endModalState.victory
                ? hasNextRoutine
                  ? `EXCELENTE! AGORA COMPLETE A ROTINA 2 DO NÍVEL ${levelData.name}.`
                  : hasNextLevel
                    ? 'VOCÊ IDENTIFICOU TODOS OS PADRÕES NAS 2 ROTINAS! AVANÇAR?'
                    : 'VOCÊ VENCEU TODAS AS ROTINAS ATÉ O NÍVEL PESADELO!'
                : 'OBSERVE AS MANCHAS, RACHADURAS E O PADRÃO DE CADA BANDEJA!'}
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