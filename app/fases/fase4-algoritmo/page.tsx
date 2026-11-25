'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GameHud } from '@/components/game/game-hud';
import { useProgresso } from '@/hooks/use-progresso';

interface AlgorithmStepItem {
  id: string;
  name: string;
  emoji: string;
  order: number | null;
  rejectMsg?: string;
}

interface AlgorithmRoutine {
  title: string;
  instruction: string;
  goalTitle: string;
  goalDesc: string;
  goalEmoji: string;
  totalSteps: number;
  items: AlgorithmStepItem[];
}

interface AlgorithmLevelData {
  label: string;
  name: string;
  noFail: boolean;
  routines: AlgorithmRoutine[];
}

const LEVELS_OPTIONS = [
  { value: 0, label: '0 - APRENDIZAGEM (LAVAR AS MÃOS - SEM ERRO)' },
  { value: 1, label: '1 - MUITO FÁCIL' },
  { value: 2, label: '2 - FÁCIL (LAVAR AS MÃOS - 3 PASSOS)' },
  { value: 3, label: '3 - NORMAL' },
  { value: 4, label: '4 - MÉDIO (HIGIENE PÓS-REFEIÇÃO - 4 PASSOS)' },
  { value: 5, label: '5 - DIFÍCIL (PREPARAR SUCO NATURAL - 4 PASSOS)' },
  { value: 6, label: '6 - MUITO DIFÍCIL' },
  { value: 7, label: '7 - EXTREMO' },
  { value: 8, label: '8 - PESADELO' },
];

const ALGORITHM_LEVELS: Record<number, AlgorithmLevelData> = {
  0: {
    label: '4 - 0',
    name: 'APRENDIZAGEM (LAVAR AS MÃOS - SEM ERRO)',
    noFail: true,
    routines: [
      {
        title: 'ROTINA 1 DE 2: LAVAR AS MÃOS (COM DICAS)',
        instruction: 'SIGA AS ETIQUETAS LARANJAS (PASSO 1, 2, 3)! ARRASTE NA ORDEM CERTA E CLIQUE EM EXECUTAR.',
        goalTitle: 'LAVAR AS MÃOS',
        goalDesc: 'SIGA AS SETAS NUMERADAS (1, 2, 3)',
        goalEmoji: '🙌💧',
        totalSteps: 3,
        items: [
          { id: 'r01_1', name: 'MOLHAR AS MÃOS', emoji: '🚰', order: 1 },
          { id: 'r01_2', name: 'PASSAR SABONETE', emoji: '🧼', order: 2 },
          { id: 'r01_3', name: 'SECAR COM TOALHA', emoji: '🧻', order: 3 },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: CALÇAR OS TÊNIS (COM DICAS)',
        instruction: 'MUITO BEM! AGORA MONTE O ALGORITMO PARA CALÇAR OS TÊNIS SEGUINDO AS DICAS.',
        goalTitle: 'CALÇAR OS TÊNIS',
        goalDesc: 'ANTES DE SAIR PARA BRINCAR',
        goalEmoji: '👟🧦',
        totalSteps: 3,
        items: [
          { id: 'r02_1', name: 'COLOCAR AS MEIAS', emoji: '🧦', order: 1 },
          { id: 'r02_2', name: 'CALÇAR OS TÊNIS', emoji: '👟', order: 2 },
          { id: 'r02_3', name: 'AMARRAR CADARÇOS', emoji: '🎀', order: 3 },
        ],
      },
    ],
  },
  1: {
    label: '4 - 1',
    name: 'MUITO FÁCIL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: COMER UMA BANANA',
        instruction: 'AGORA SEM DICAS! ORDENE OS 3 PASSOS PARA LANCHEAR UMA BANANA (SEM DISTRATORES).',
        goalTitle: 'COMER BANANA',
        goalDesc: 'LANCHE SAUDÁVEL DA TARDE',
        goalEmoji: '🍌😋',
        totalSteps: 3,
        items: [
          { id: 'r11_1', name: 'DESCASCAR A BANANA', emoji: '🍌', order: 1 },
          { id: 'r11_2', name: 'COMER A BANANA', emoji: '😋', order: 2 },
          { id: 'r11_3', name: 'JOGAR CASCA NO LIXO', emoji: '🗑️', order: 3 },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: LAVAR UMA MAÇÃ',
        instruction: 'QUAL É A ORDEM CERTA PARA HIGIENIZAR E COMER UMA MAÇÃ?',
        goalTitle: 'COMER MAÇÃ LIMPA',
        goalDesc: 'HIGIENE ANTES DE COMER',
        goalEmoji: '🍎✨',
        totalSteps: 3,
        items: [
          { id: 'r12_1', name: 'ABRIR A TORNEIRA', emoji: '🚰', order: 1 },
          { id: 'r12_2', name: 'LAVAR A MAÇÃ', emoji: '🍎', order: 2 },
          { id: 'r12_3', name: 'SECAR COM PANO', emoji: '🧻', order: 3 },
        ],
      },
    ],
  },
  2: {
    label: '4 - 2',
    name: 'FÁCIL (LAVAR AS MÃOS - 3 PASSOS)',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: LAVAR AS MÃOS (3 PASSOS + DISTRATOR)',
        instruction: 'ORDENE OS 3 PASSOS DE LAVAR AS MÃOS E IGNORE O OBJETO QUE NÃO SERVE PARA ESSA TAREFA.',
        goalTitle: 'LAVAR AS MÃOS',
        goalDesc: 'ORDENE OS 3 PASSOS SEM DICAS',
        goalEmoji: '🧼🙌',
        totalSteps: 3,
        items: [
          { id: 'r21_1', name: 'PASSAR SABONETE', emoji: '🧼', order: 2 },
          { id: 'r21_2', name: 'SECAR COM TOALHA', emoji: '🧻', order: 3 },
          { id: 'r21_3', name: 'MOLHAR AS MÃOS', emoji: '🚰', order: 1 },
          { id: 'r21_4', name: 'PENTEAR CABELO', emoji: '🪮', order: null, rejectMsg: 'PENTE NÃO SERVE PARA LAVAR AS MÃOS!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: ARRUMAR A CAMA AO ACORDAR',
        instruction: 'MONTE A SEQUÊNCIA DE 3 PASSOS PARA DEIXAR A CAMA ARRUMADA!',
        goalTitle: 'ARRUMAR A CAMA',
        goalDesc: 'TAREFA MATINAL DO QUARTO',
        goalEmoji: '🛏️✨',
        totalSteps: 3,
        items: [
          { id: 'r22_1', name: 'ESTENDER O LENÇOL', emoji: '🛏️', order: 1 },
          { id: 'r22_2', name: 'AJEITAR TRAVESSEIRO', emoji: '🛌', order: 2 },
          { id: 'r22_3', name: 'DOBRAR O COBERTOR', emoji: '🧣', order: 3 },
          { id: 'r22_4', name: 'ESCOVAR OS DENTES', emoji: '🪥', order: null, rejectMsg: 'ISSO É NO BANHEIRO, NÃO NA CAMA!' },
        ],
      },
    ],
  },
  3: {
    label: '4 - 3',
    name: 'NORMAL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: PREPARAR ACHOCOLATADO',
        instruction: 'COLOQUE OS 4 PASSOS NA ORDEM CERTA PARA PREPARAR SEU LEITE COM CHOCOLATE!',
        goalTitle: 'ACHOCOLATADO',
        goalDesc: 'CAFÉ DA MANHÃ NUTRITIVO',
        goalEmoji: '🥛🍫',
        totalSteps: 4,
        items: [
          { id: 'r31_1', name: 'PEGAR O COPO', emoji: '🥛', order: 1 },
          { id: 'r31_2', name: 'COLOCAR O LEITE', emoji: '🍼', order: 2 },
          { id: 'r31_3', name: 'PÔR ACHOCOLATADO', emoji: '🍫', order: 3 },
          { id: 'r31_4', name: 'MISTURAR COM COLHER', emoji: '🥄', order: 4 },
          { id: 'r31_5', name: 'GUARDAR MOCHILA', emoji: '🎒', order: null, rejectMsg: 'MOCHILA NÃO ENTRA NA RECEITA!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: PLANTAR UMA SEMENTE NO VASO',
        instruction: 'AJUDE A PLANTINHA A CRESCER! ORDENE OS 4 PASSOS DO PLANTIO.',
        goalTitle: 'PLANTAR SEMENTE',
        goalDesc: 'CUIDANDO DA NATUREZA',
        goalEmoji: '🌱🪴',
        totalSteps: 4,
        items: [
          { id: 'r32_1', name: 'COLOCAR TERRA NO VASO', emoji: '🪴', order: 1 },
          { id: 'r32_2', name: 'FAZER UM BURAQUINHO', emoji: '👆', order: 2 },
          { id: 'r32_3', name: 'COLOCAR A SEMENTE', emoji: '🌰', order: 3 },
          { id: 'r32_4', name: 'REGAR COM ÁGUA', emoji: '🚿', order: 4 },
          { id: 'r32_5', name: 'CORTAR PAPEL', emoji: '✂️', order: null, rejectMsg: 'TESOURA NÃO SERVE PARA PLANTAR!' },
        ],
      },
    ],
  },
  4: {
    label: '4 - 4',
    name: 'MÉDIO (HIGIENE PÓS-REFEIÇÃO - 4 PASSOS)',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: ESCOVAR OS DENTES',
        instruction: 'DEPOIS DO LANCHE, MONTE O ALGORITMO DE 4 PASSOS PARA ESCOVAR OS DENTES!',
        goalTitle: 'HIGIENE PÓS-REFEIÇÃO',
        goalDesc: 'ESCOVAR OS DENTES NA ORDEM CERTA',
        goalEmoji: '😁🪥',
        totalSteps: 4,
        items: [
          { id: 'r41_1', name: 'ENXAGUAR A BOCA', emoji: '🥤', order: 3 },
          { id: 'r41_2', name: 'PEGAR A ESCOVA', emoji: '🪥', order: 1 },
          { id: 'r41_3', name: 'SECAR O ROSTO', emoji: '🧻', order: 4 },
          { id: 'r41_4', name: 'COLOCAR CREME DENTAL', emoji: '🧴', order: 2 },
          { id: 'r41_5', name: 'CALÇAR TÊNIS', emoji: '👟', order: null, rejectMsg: 'TÊNIS NÃO FAZ PARTE DA HIGIENE BUCAL!' },
          { id: 'r41_6', name: 'PEGAR BOLA', emoji: '⚽', order: null, rejectMsg: 'FOQUE NA HIGIENE APÓS O LANCHE!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: LIMPAR A MESA APÓS O LANCHE',
        instruction: 'ORGANIZE A COZINHA! ORDENE OS 4 PASSOS PARA LIMPAR A MESA DEPOIS DE COMER.',
        goalTitle: 'LIMPAR A MESA',
        goalDesc: 'ORGANIZAÇÃO PÓS-REFEIÇÃO',
        goalEmoji: '🍽️🧽',
        totalSteps: 4,
        items: [
          { id: 'r42_1', name: 'JOGAR RESTOS NO LIXO', emoji: '🗑️', order: 1 },
          { id: 'r42_2', name: 'LEVAR PRATOS À PIA', emoji: '🍽️', order: 2 },
          { id: 'r42_3', name: 'PASSAR PANO ÚMIDO', emoji: '🧽', order: 3 },
          { id: 'r42_4', name: 'GUARDAR AS CADEIRAS', emoji: '🪑', order: 4 },
          { id: 'r42_5', name: 'LIGAR VIDEOGAME', emoji: '🎮', order: null, rejectMsg: 'TERMINE DE LIMPAR A MESA PRIMEIRO!' },
          { id: 'r42_6', name: 'ABRIR GUARDA-CHUVA', emoji: '☂️', order: null, rejectMsg: 'NÃO ESTÁ CHOVENDO NA COZINHA!' },
        ],
      },
    ],
  },
  5: {
    label: '4 - 5',
    name: 'DIFÍCIL (PREPARAR SUCO NATURAL - 4 PASSOS)',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: PREPARAR SUCO DE LARANJA',
        instruction: 'MONTE A RECEITA DO SUCO NATURAL EM 4 PASSOS IGNORANDO OS DISTRATORES!',
        goalTitle: 'PREPARAR SUCO NATURAL',
        goalDesc: 'MONTE A RECEITA PASSO A PASSO',
        goalEmoji: '🍊🧃',
        totalSteps: 4,
        items: [
          { id: 'r51_1', name: 'SERVIR NO COPO', emoji: '🥛', order: 4 },
          { id: 'r51_2', name: 'ESPREMER LARANJAS', emoji: '🍊', order: 2 },
          { id: 'r51_3', name: 'MISTURAR COM ÁGUA', emoji: '💧', order: 3 },
          { id: 'r51_4', name: 'LAVAR AS LARANJAS', emoji: '🚰', order: 1 },
          { id: 'r51_5', name: 'SABÃO EM PÓ', emoji: '📦', order: null, rejectMsg: 'ISSO É DE LAVAR ROUPA, NÃO DE SUCO!' },
          { id: 'r51_6', name: 'TESOURA ESCOLAR', emoji: '✂️', order: null, rejectMsg: 'TESOURA NÃO VAI NA RECEITA!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: MONTAR SANDUÍCHE NATURAL',
        instruction: 'PREPARE UM SANDUÍCHE SAUDÁVEL SEGUINDO A SEQUÊNCIA LÓGICA DE 4 PASSOS!',
        goalTitle: 'SANDUÍCHE NATURAL',
        goalDesc: 'RECEITA PRÁTICA DE LANCHE',
        goalEmoji: '🥪🥬',
        totalSteps: 4,
        items: [
          { id: 'r52_1', name: 'PEGAR FATIAS DE PÃO', emoji: '🍞', order: 1 },
          { id: 'r52_2', name: 'PASSAR REQUEIJÃO', emoji: '🧈', order: 2 },
          { id: 'r52_3', name: 'COLOCAR QUEIJO E ALFACE', emoji: '🥬', order: 3 },
          { id: 'r52_4', name: 'FECHAR O SANDUÍCHE', emoji: '🥪', order: 4 },
          { id: 'r52_5', name: 'COLAR FIGURINHA', emoji: '🏷️', order: null, rejectMsg: 'ISSO NÃO É INGREDIENTE DE SANDUÍCHE!' },
          { id: 'r52_6', name: 'CREME DENTAL', emoji: '🧴', order: null, rejectMsg: 'CREME DENTAL É PARA ESCOVAR OS DENTES!' },
        ],
      },
    ],
  },
  6: {
    label: '4 - 6',
    name: 'MUITO DIFÍCIL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: LAVAR A LOUÇA DO LANCHE (5 PASSOS)',
        instruction: 'AGORA SÃO 5 PASSOS! MONTE O ALGORITMO COMPLETO PARA LAVAR E GUARDAR A LOUÇA.',
        goalTitle: 'LAVAR A LOUÇA',
        goalDesc: 'SEQUÊNCIA DE 5 PASSOS NA PIA',
        goalEmoji: '🍽️🫧',
        totalSteps: 5,
        items: [
          { id: 'r61_1', name: 'TIRAR RESTOS DE COMIDA', emoji: '🗑️', order: 1 },
          { id: 'r61_2', name: 'ENSABOAR COM ESPONJA', emoji: '🧽', order: 2 },
          { id: 'r61_3', name: 'ENXAGUAR COM ÁGUA', emoji: '🚰', order: 3 },
          { id: 'r61_4', name: 'SECAR COM PANO LIMPO', emoji: '🧻', order: 4 },
          { id: 'r61_5', name: 'GUARDAR NO ARMÁRIO', emoji: '🗄️', order: 5 },
          { id: 'r61_6', name: 'PINTAR COM TINTA', emoji: '🎨', order: null, rejectMsg: 'TINTA VAI SUJAR A LOUÇA DE NOVO!' },
          { id: 'r61_7', name: 'CHUTAR BOLA', emoji: '⚽', order: null, rejectMsg: 'BRINCAR DE BOLA É DEPOIS!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: VITAMINA DE BANANA NO LIQUIDIFICADOR (5 PASSOS)',
        instruction: 'CUIDADO COM A SEGURANÇA! NÃO LIGUE O LIQUIDIFICADOR SEM TAMPAR ANTES. ORDENE OS 5 PASSOS.',
        goalTitle: 'VITAMINA DE BANANA',
        goalDesc: 'RECEITA EM 5 ETAPAS',
        goalEmoji: '🍌🥤',
        totalSteps: 5,
        items: [
          { id: 'r62_1', name: 'DESCASCAR AS BANANAS', emoji: '🍌', order: 1 },
          { id: 'r62_2', name: 'COLOCAR NO COPO E PÔR LEITE', emoji: '🥛', order: 2 },
          { id: 'r62_3', name: 'TAMPAR O LIQUIDIFICADOR', emoji: '🧢', order: 3 },
          { id: 'r62_4', name: 'BATER A VITAMINA', emoji: '🌪️', order: 4 },
          { id: 'r62_5', name: 'SERVIR NO COPO', emoji: '🥤', order: 5 },
          { id: 'r62_6', name: 'PÔR SAL GROSSO', emoji: '🧂', order: null, rejectMsg: 'SAL NÃO COMBINA COM VITAMINA DOCE!' },
          { id: 'r62_7', name: 'CHAVE DE FENDA', emoji: '🪛', order: null, rejectMsg: 'FERRAMENTA NÃO VAI NA RECEITA!' },
        ],
      },
    ],
  },
  7: {
    label: '4 - 7',
    name: 'EXTREMO',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: ATRAVESSAR A RUA COM SEGURANÇA (5 PASSOS)',
        instruction: 'NÍVEL EXTREMO! ORDENE OS 5 PASSOS DE SEGURANÇA NO TRÂNSITO PARA ATRAVESSAR NA FAIXA.',
        goalTitle: 'ATRAVESSAR A RUA',
        goalDesc: 'SEGURANÇA NO TRÂNSITO',
        goalEmoji: '🚸🚦',
        totalSteps: 5,
        items: [
          { id: 'r71_1', name: 'IR ATÉ A FAIXA DE PEDESTRES', emoji: '🚸', order: 1 },
          { id: 'r71_2', name: 'PARAR NA CALÇADA', emoji: '🛑', order: 2 },
          { id: 'r71_3', name: 'OLHAR PARA OS DOIS LADOS', emoji: '👀', order: 3 },
          { id: 'r71_4', name: 'ESPERAR OS CARROS PARAREM', emoji: '🚗', order: 4 },
          { id: 'r71_5', name: 'ATRAVESSAR ANDANDO', emoji: '🚶', order: 5 },
          { id: 'r71_6', name: 'CORRER OLHANDO CELULAR', emoji: '📱', order: null, rejectMsg: 'PERIGO! NUNCA ATRAVESSE OLHANDO CELULAR!' },
          { id: 'r71_7', name: 'PULAR NO MEIO DA RUA', emoji: '🤸', order: null, rejectMsg: 'ATITUDE PERIGOSA NO TRÂNSITO!' },
          { id: 'r71_8', name: 'JOGAR BOLA NA PISTA', emoji: '⚽', order: null, rejectMsg: 'RUA NÃO É LUGAR DE JOGAR BOLA!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: PREPARAR SALADA DE FRUTAS (5 PASSOS)',
        instruction: 'MONTE A SEQUÊNCIA DE 5 PASSOS PARA FAZER UMA SALADA DE FRUTAS HIGIENIZADA E SABOROSA!',
        goalTitle: 'SALADA DE FRUTAS',
        goalDesc: 'HIGIENE E PREPARO DE 5 PASSOS',
        goalEmoji: '🍓🍍',
        totalSteps: 5,
        items: [
          { id: 'r72_1', name: 'LAVAR AS MÃOS E AS FRUTAS', emoji: '🚰', order: 1 },
          { id: 'r72_2', name: 'DESCASCAR AS FRUTAS', emoji: '🍌', order: 2 },
          { id: 'r72_3', name: 'PICAR EM CUBINHOS', emoji: '🔪', order: 3 },
          { id: 'r72_4', name: 'MISTURAR NA TIGELA', emoji: '🥣', order: 4 },
          { id: 'r72_5', name: 'SERVIR NAS TAÇAS', emoji: '🍨', order: 5 },
          { id: 'r72_6', name: 'PÔR DETERGENTE', emoji: '🧴', order: null, rejectMsg: 'DETERGENTE É VENENO! NÃO VAI NA COMIDA!' },
          { id: 'r72_7', name: 'MISTURAR COM TERRA', emoji: '🪴', order: null, rejectMsg: 'FRUTAS DEVEM FICAR LIMPAS!' },
          { id: 'r72_8', name: 'GUARDAR SEM LAVAR', emoji: '🦠', order: null, rejectMsg: 'PRECISA HIGIENIZAR ANTES DE CORTAR!' },
        ],
      },
    ],
  },
  8: {
    label: '4 - 8',
    name: 'PESADELO',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: ROTINA COMPLETA DA MANHÃ ATÉ A ESCOLA (6 PASSOS)',
        instruction: 'MODO PESADELO! 6 PASSOS ORDENADOS + 4 DISTRATORES. CONSTRUA O ALGORITMO MATINAL SEM ERROS!',
        goalTitle: 'MANHÃ ESCOLAR',
        goalDesc: 'ALGORITMO COMPLETO DE 6 PASSOS',
        goalEmoji: '🏫⏰',
        totalSteps: 6,
        items: [
          { id: 'r81_1', name: 'ACORDAR E ARRUMAR CAMA', emoji: '🛏️', order: 1 },
          { id: 'r81_2', name: 'LAVAR O ROSTO', emoji: '💦', order: 2 },
          { id: 'r81_3', name: 'TOMAR CAFÉ DA MANHÃ', emoji: '🥪', order: 3 },
          { id: 'r81_4', name: 'ESCOVAR OS DENTES', emoji: '🪥', order: 4 },
          { id: 'r81_5', name: 'VESTIR O UNIFORME', emoji: '👕', order: 5 },
          { id: 'r81_6', name: 'PEGAR MOCHILA E SAIR', emoji: '🎒', order: 6 },
          { id: 'r81_7', name: 'VOLTAR A DORMIR', emoji: '😴', order: null, rejectMsg: 'SE DORMIR DE NOVO VAI PERDER A AULA!' },
          { id: 'r81_8', name: 'VESTIR PIJAMA', emoji: '🩳', order: null, rejectMsg: 'PIJAMA É PARA DORMIR, NÃO PARA A ESCOLA!' },
          { id: 'r81_9', name: 'JOGAR VIDEOGAME', emoji: '🎮', order: null, rejectMsg: 'NÃO É HORA DE JOGAR ANTES DA AULA!' },
          { id: 'r81_10', name: 'SAIR DESCALÇO', emoji: '🦶', order: null, rejectMsg: 'PRECISA VESTIR O UNIFORME E CALÇADO!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: DAR BANHO NO CACHORRINHO DE ESTIMAÇÃO (6 PASSOS)',
        instruction: 'ÚLTIMO DESAFIO DO MODO PESADELO! ORDENE OS 6 PASSOS PARA DAR BANHO NO PET COM CARINHO E SEGURANÇA!',
        goalTitle: 'BANHO NO PET',
        goalDesc: 'CUIDADO ANIMAL EM 6 ETAPAS',
        goalEmoji: '🐶🛁',
        totalSteps: 6,
        items: [
          { id: 'r82_1', name: 'PREPARAR TOALHA E SHAMPOO PET', emoji: '🧴', order: 1 },
          { id: 'r82_2', name: 'MOLHAR COM ÁGUA MORNA', emoji: '🚿', order: 2 },
          { id: 'r82_3', name: 'ENSABOAR COM SHAMPOO PET', emoji: '🫧', order: 3 },
          { id: 'r82_4', name: 'ENXAGUAR TODA A ESPUMA', emoji: '💧', order: 4 },
          { id: 'r82_5', name: 'SECAR BEM COM A TOALHA', emoji: '🧻', order: 5 },
          { id: 'r82_6', name: 'ESCOVAR OS PELOS', emoji: '🪮', order: 6 },
          { id: 'r82_7', name: 'USAR SABÃO EM PÓ', emoji: '📦', order: null, rejectMsg: 'SABÃO EM PÓ FAZ MAL PARA O CACHORRO!' },
          { id: 'r82_8', name: 'JOGAR ÁGUA GELADA', emoji: '🧊', order: null, rejectMsg: 'ÁGUA GELADA ASSUSTA O ANIMALZINHO!' },
          { id: 'r82_9', name: 'DEIXAR MOLHADO NO VENTO', emoji: '💨', order: null, rejectMsg: 'PRECISA SECAR O PET COM TOALHA!' },
          { id: 'r82_10', name: 'COLOCAR NA MÁQUINA LAVAR', emoji: '🧺', order: null, rejectMsg: 'NUNCA! PET TOMA BANHO NA BANHEIRA!' },
        ],
      },
    ],
  },
};

export default function Fase4AlgoritmoPage() {
  const router = useRouter();
  const { carregando, progressoInicial, salvarProgresso } = useProgresso('algoritmo');

  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [currentRoutineIndex, setCurrentRoutineIndex] = useState<number>(0);
  const [shuffledItems, setShuffledItems] = useState<AlgorithmStepItem[]>(
    ALGORITHM_LEVELS[0].routines[0].items
  );
  const [slots, setSlots] = useState<(AlgorithmStepItem | null)[]>(
    Array(ALGORITHM_LEVELS[0].routines[0].totalSteps).fill(null)
  );
  const [lives, setLives] = useState<number>(3);

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executingStepIndex, setExecutingStepIndex] = useState<number | null>(null);
  const [displayGoalEmoji, setDisplayGoalEmoji] = useState<string>(
    ALGORITHM_LEVELS[0].routines[0].goalEmoji
  );
  const [isGoalAnimating, setIsGoalAnimating] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const execIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [endModalState, setEndModalState] = useState<{ open: boolean; victory: boolean }>({
    open: false,
    victory: false,
  });

  const levelData = ALGORITHM_LEVELS[currentLevel];
  const routineData = levelData.routines[currentRoutineIndex];

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

  const initLevel = useCallback((lvlIndex: number, routineIdx = 0) => {
    if (execIntervalRef.current) clearInterval(execIntervalRef.current);

    const safeLevel = ALGORITHM_LEVELS[lvlIndex] ? lvlIndex : 0;
    const lvl = ALGORITHM_LEVELS[safeLevel];
    const safeRoutine = lvl.routines[routineIdx] ? routineIdx : 0;
    const rtn = lvl.routines[safeRoutine];
    const randomized = [...rtn.items].sort(() => Math.random() - 0.5);

    setCurrentLevel(safeLevel);
    setCurrentRoutineIndex(safeRoutine);
    setShuffledItems(randomized);
    setSlots(Array(rtn.totalSteps).fill(null));
    setLives(3);
    setIsExecuting(false);
    setExecutingStepIndex(null);
    setDisplayGoalEmoji(rtn.goalEmoji);
    setFeedback(null);
    setEndModalState({ open: false, victory: false });
  }, []);

  // Carrega o progresso salvo e embaralha os passos no cliente
  useEffect(() => {
    if (!carregando) {
      initLevel(progressoInicial.nivelAtual, progressoInicial.rotinaAtual);
    }
    return () => {
      if (execIntervalRef.current) clearInterval(execIntervalRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [carregando, progressoInicial, initLevel]);

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

  const handleStepDrop = (targetStepNumber: number) => {
    if (!draggedItemId || isExecuting) return;
    const item = shuffledItems.find((i) => i.id === draggedItemId);
    if (!item) return;

    // Regra 1: Item distrator que não pertence à tarefa
    if (item.order === null) {
      registerMistake(item.rejectMsg || 'ESSE PASSO NÃO FAZ PARTE DA TAREFA!');
      return;
    }

    // Regra 2: Ordem incorreta do algoritmo
    if (item.order !== targetStepNumber) {
      registerMistake(`OPA! "${item.name}" NÃO É O ${targetStepNumber}º PASSO!`);
      return;
    }

    // Acerto
    const updatedSlots = [...slots];
    updatedSlots[targetStepNumber - 1] = item;
    setSlots(updatedSlots);
    showFeedback(`PASSO ${targetStepNumber} CORRETO!`, true);
  };

  const hasNextRoutine = currentRoutineIndex + 1 < levelData.routines.length;
  const hasNextLevel = Boolean(ALGORITHM_LEVELS[currentLevel + 1]);

  const runAlgorithmAnimation = () => {
    if (isExecuting) return;
    setIsExecuting(true);

    let stepIdx = 0;

    execIntervalRef.current = setInterval(() => {
      if (stepIdx < slots.length) {
        const currentItem = slots[stepIdx];
        setExecutingStepIndex(stepIdx);
        if (currentItem) {
          setDisplayGoalEmoji(currentItem.emoji);
          setIsGoalAnimating(true);
          playFeedbackSound(true);
          setTimeout(() => setIsGoalAnimating(false), 300);
        }
        stepIdx++;
      } else {
        if (execIntervalRef.current) clearInterval(execIntervalRef.current);
        setExecutingStepIndex(null);
        setDisplayGoalEmoji('🎉✅');
        setIsExecuting(false);

        if (hasNextRoutine) {
          salvarProgresso(currentLevel, currentRoutineIndex + 1, false);
        } else if (hasNextLevel) {
          salvarProgresso(currentLevel + 1, 0, false);
        } else {
          salvarProgresso(currentLevel, currentRoutineIndex, true);
        }

        setTimeout(() => setEndModalState({ open: true, victory: true }), 600);
      }
    }, 800);
  };

  const filledCount = slots.filter((s) => s !== null).length;
  const allFilled = filledCount === routineData.totalSteps;
  const placedIds = slots.filter((s): s is AlgorithmStepItem => s !== null).map((s) => s.id);
  const remainingItems = shuffledItems.filter((item) => !placedIds.includes(item.id));

  if (carregando) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#e5e4e4] font-sans text-lg font-extrabold text-[#6f8dca]">
        CARREGANDO PROGRESSO...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#e5e4e4] p-4 font-sans text-gray-800 select-none">
      <main className="relative flex w-full max-w-[1140px] flex-col gap-4 rounded-[20px] border-[3px] border-[#c8d1d9] bg-[#e5e4e4] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
        {/* BARRA SUPERIOR PADRONIZADA */}
        <GameHud
          levels={LEVELS_OPTIONS}
          currentLevel={currentLevel}
          onSelectLevel={(lvl) => {
            initLevel(lvl, 0);
            salvarProgresso(lvl, 0, false);
          }}
          faseNivelLabel={levelData.label}
          rotinaAtual={currentRoutineIndex + 1}
          totalRotinas={levelData.routines.length}
          acertosAtuais={filledCount}
          totalAcertos={routineData.totalSteps}
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

        {/* ÁREA DE TRABALHO EM 3 COLUNAS */}
        <section className="grid min-h-[390px] grid-cols-1 gap-4 lg:grid-cols-[260px_1.15fr_1.25fr]">
          {/* COLUNA 1: META DA ATIVIDADE (ESQUERDA) */}
          <aside
            className="flex flex-col justify-between gap-3 rounded-[18px] bg-[#c8d1d9] p-3.5"
            aria-label="Objetivo da Tarefa"
          >
            <div className="rounded-[10px] bg-[#6f8dca] p-2 text-center text-[0.92rem] font-extrabold text-white">
              OBJETIVO
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-2.5 rounded-[16px] border-[3px] border-[#6f8dca] bg-white px-3 py-[18px] text-center">
              <div
                className={`text-[3.6rem] leading-none transition-transform duration-300 ${
                  isGoalAnimating ? 'scale-125' : 'scale-100'
                }`}
              >
                {displayGoalEmoji}
              </div>
              <h2 className="text-[1.08rem] font-extrabold text-slate-800">
                {routineData.goalTitle}
              </h2>
              <p className="text-[0.82rem] font-bold text-slate-500">
                {routineData.goalDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={runAlgorithmAnimation}
              disabled={!allFilled || isExecuting}
              className="cursor-pointer rounded-[14px] bg-[#4caf50] px-3 py-3.5 text-base font-extrabold text-white shadow-[0_4px_0_#2e7d32] transition-all active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-70 disabled:shadow-none"
            >
              ▶ EXECUTAR ALGORITMO
            </button>
          </aside>

          {/* COLUNA 2: PASSOS EMBARALHADOS + DISTRATORES (CENTRO) */}
          <div
            className="flex flex-col gap-3 rounded-[18px] border-[3px] border-[#c8d1d9] bg-[#f8fafc] p-3.5"
            aria-label="Ações Disponíveis"
          >
            <div className="rounded-[10px] bg-[#6f8dca] p-2 text-center text-[0.92rem] font-extrabold text-white">
              PASSOS DISPONÍVEIS (ARRASTE)
            </div>

            <div className="grid flex-1 grid-cols-2 content-start gap-2.5">
              {remainingItems.map((item) => {
                const showHint = levelData.noFail && item.order !== null;
                return (
                  <div
                    key={item.id}
                    draggable={!isExecuting}
                    onDragStart={(e) => {
                      setDraggedItemId(item.id);
                      e.dataTransfer.setData('text/plain', item.id);
                    }}
                    onDragEnd={() => setDraggedItemId(null)}
                    className={`relative flex cursor-grab flex-col items-center justify-center gap-1 rounded-[14px] border-[3px] bg-white px-1.5 py-2.5 transition-transform duration-150 hover:-translate-y-0.5 active:cursor-grabbing ${
                      showHint
                        ? 'border-[#f59e0b] shadow-[0_0_0_4px_rgba(245,158,11,0.35)]'
                        : 'border-[#6f8dca] shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {showHint && (
                      <span className="absolute -top-2.5 rounded-[6px] bg-[#f59e0b] px-2 py-0.5 text-[0.68rem] font-extrabold text-white">
                        PASSO {item.order} ➔
                      </span>
                    )}
                    <span className="text-[2rem] leading-none">{item.emoji}</span>
                    <span className="text-center text-[0.75rem] font-extrabold text-gray-800">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUNA 3: QUADRO DE SEQUÊNCIA NUMERADA (DIREITA) */}
          <div
            className="flex flex-col gap-3 rounded-[18px] bg-[#c8d1d9] p-3.5"
            aria-label="Sequência de Passos"
          >
            <div className="rounded-[10px] bg-[#6f8dca] p-2 text-center text-[0.92rem] font-extrabold text-white">
              ORDEM DO ALGORITMO
            </div>

            <div className="flex flex-1 flex-col justify-center gap-2">
              {slots.map((placedItem, index) => {
                const stepNumber = index + 1;
                const isDragOver = dragOverSlot === stepNumber;
                const isStepExecuting = executingStepIndex === index;

                return (
                  <div
                    key={stepNumber}
                    onDragOver={(e) => {
                      if (placedItem) return;
                      e.preventDefault();
                      setDragOverSlot(stepNumber);
                    }}
                    onDragLeave={() => setDragOverSlot(null)}
                    onDrop={(e) => {
                      if (placedItem) return;
                      e.preventDefault();
                      setDragOverSlot(null);
                      handleStepDrop(stepNumber);
                      setDraggedItemId(null);
                    }}
                    className={`flex min-h-[58px] items-center gap-3 rounded-[14px] border-[3px] px-3 py-1.5 transition-all duration-150 ${
                      isStepExecuting
                        ? 'scale-[1.03] border-solid border-[#f59e0b] bg-[#fef3c7]'
                        : placedItem
                          ? 'border-solid border-[#4caf50] bg-[#f0fdf4]'
                          : isDragOver
                            ? 'scale-[1.01] border-solid border-[#6f8dca] bg-[#dbeafe]'
                            : 'border-dashed border-[#6f8dca] bg-white'
                    }`}
                  >
                    <div
                      className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] text-[1.1rem] font-black text-white ${
                        placedItem ? 'bg-[#4caf50]' : 'bg-[#6f8dca]'
                      }`}
                    >
                      {stepNumber}.
                    </div>

                    {placedItem ? (
                      <div className="flex flex-1 items-center gap-2.5 text-[0.86rem] font-extrabold text-gray-800">
                        <span className="text-[1.65rem] leading-none">{placedItem.emoji}</span>
                        <span>{placedItem.name}</span>
                      </div>
                    ) : (
                      <div className="flex-1 text-[0.86rem] font-extrabold text-slate-500">
                        ARRASTE O {stepNumber}º PASSO AQUI
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DE AJUDA */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
          <div className="flex w-full max-w-[520px] flex-col gap-4 rounded-[20px] border-4 border-[#6f8dca] bg-white p-6 text-center">
            <h2 className="text-[1.5rem] font-black text-[#6f8dca]">
              COMO JOGAR - ALGORITMO
            </h2>
            <p className="font-bold text-slate-700">
              UM ALGORITMO É UMA SEQUÊNCIA ORDENADA DE PASSOS PARA RESOLVER UMA TAREFA:
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-left text-[0.92rem]">
              <li>
                <strong>2 ROTINAS POR NÍVEL:</strong> COMPLETE OS 2 ALGORITMOS DO NÍVEL PARA AVANÇAR.
              </li>
              <li>
                <strong>OBSERVE O OBJETIVO:</strong> VEJA QUAL TAREFA O PERSONAGEM PRECISA FAZER À ESQUERDA.
              </li>
              <li>
                <strong>SIGA A ORDEM (1, 2, 3...):</strong> O QUE VEM PRIMEIRO? ARRASTE CADA PASSO PARA O NÚMERO CERTO.
              </li>
              <li>
                <strong>CLIQUE EM EXECUTAR:</strong> QUANDO COMPLETAR TODOS OS NÚMEROS, APERTE O BOTÃO VERDE PARA VER O RESULTADO!
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
                    : 'PARABÉNS! MESTRE DOS ALGORITMOS!'
                : 'VAMOS TENTAR DE NOVO?'}
            </h2>
            <p className="font-bold text-slate-700">
              {endModalState.victory
                ? hasNextRoutine
                  ? `EXCELENTE! AGORA COMPLETE A ROTINA 2 DO NÍVEL ${levelData.name}.`
                  : hasNextLevel
                    ? 'VOCÊ EXECUTOU OS 2 ALGORITMOS NA ORDEM PERFEITA! AVANÇAR?'
                    : 'VOCÊ CONCLUIU TODOS OS PILARES DO MUNDO LÓGI ATÉ O MODO PESADELO!'
                : 'PENSE NA ORDEM LÓGICA DO PRIMEIRO AO ÚLTIMO PASSO!'}
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