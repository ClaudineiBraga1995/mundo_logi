'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GameHud } from '@/components/game/game-hud';
import { useProgresso } from '@/hooks/use-progresso';

type WindowTheme = 'default' | 'cold' | 'night';

interface AbstractionItem {
  id: string;
  name: string;
  emoji: string;
  relevant: boolean;
  rejectMsg?: string;
}

interface SituationRoutine {
  title: string;
  instruction: string;
  place: string;
  sceneEmoji: string;
  weather: string;
  thermoIcon: string;
  theme: WindowTheme;
  items: AbstractionItem[];
}

interface SituationLevelData {
  label: string;
  name: string;
  noFail: boolean;
  routines: SituationRoutine[];
}

const LEVELS_OPTIONS = [
  { value: 0, label: '0 - APRENDIZAGEM (PARQUE NO SOL)' },
  { value: 1, label: '1 - MUITO FÁCIL' },
  { value: 2, label: '2 - FÁCIL (ESCOLA NO CALOR)' },
  { value: 3, label: '3 - NORMAL' },
  { value: 4, label: '4 - MÉDIO (PASSEIO NO FRIO)' },
  { value: 5, label: '5 - DIFÍCIL (PIQUENIQUE À TARDE)' },
  { value: 6, label: '6 - MUITO DIFÍCIL' },
  { value: 7, label: '7 - EXTREMO' },
  { value: 8, label: '8 - PESADELO' },
];

const SITUATIONS_CONFIG: Record<number, SituationLevelData> = {
  0: {
    label: '2 - 0',
    name: 'APRENDIZAGEM (PARQUE NO SOL)',
    noFail: true,
    routines: [
      {
        title: 'ROTINA 1 DE 2: MANHÃ NO PARQUE',
        instruction: 'SIGA AS DICAS LARANJAS! COLOQUE NA LANCHEIRA APENAS O QUE É BOM PARA UM DIA DE SOL NO PARQUE.',
        place: 'PARQUE',
        sceneEmoji: '☀️🌳',
        weather: 'DIA DE SOL',
        thermoIcon: '☀️',
        theme: 'default',
        items: [
          { id: 'r01_1', name: 'ÁGUA GELADA', emoji: '💧', relevant: true },
          { id: 'r01_2', name: 'MAÇÃ', emoji: '🍎', relevant: true },
          { id: 'r01_3', name: 'SANDUÍCHE', emoji: '🥪', relevant: true },
          { id: 'r01_4', name: 'CONTROLE', emoji: '🎮', relevant: false, rejectMsg: 'BRINQUEDO NÃO É LANCHE!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: LANCHE NO JARDIM',
        instruction: 'MUITO BEM! AGORA PREPARE O LANCHE PARA O JARDIM SEGUINDO AS DICAS.',
        place: 'JARDIM',
        sceneEmoji: '🌻☀️',
        weather: 'MANHÃ QUENTE',
        thermoIcon: '🌡️',
        theme: 'default',
        items: [
          { id: 'r02_1', name: 'SUCO DE LARANJA', emoji: '🧃', relevant: true },
          { id: 'r02_2', name: 'BANANA', emoji: '🍌', relevant: true },
          { id: 'r02_3', name: 'BOLO SIMPLES', emoji: '🍰', relevant: true },
          { id: 'r02_4', name: 'BOLA DE FUTEBOL', emoji: '⚽', relevant: false, rejectMsg: 'BOLA NÃO VAI DENTRO DA LANCHEIRA!' },
        ],
      },
    ],
  },
  1: {
    label: '2 - 1',
    name: 'MUITO FÁCIL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: RECREIO NA ESCOLA',
        instruction: 'AGORA SEM DICAS! ESCOLHA APENAS OS ALIMENTOS PARA O RECREIO E DEIXE OS OBJETOS DE FORA.',
        place: 'RECREIO',
        sceneEmoji: '🏫🌤️',
        weather: 'MANHÃ AGRADÁVEL',
        thermoIcon: '🌤️',
        theme: 'default',
        items: [
          { id: 'r11_1', name: 'ACHOCOLATADO', emoji: '🧃', relevant: true },
          { id: 'r11_2', name: 'PÃO COM QUEIJO', emoji: '🥪', relevant: true },
          { id: 'r11_3', name: 'PERA', emoji: '🍐', relevant: true },
          { id: 'r11_4', name: 'TESOURA', emoji: '✂️', relevant: false, rejectMsg: 'TESOURA VAI NO ESTOJO, NÃO NO LANCHE!' },
          { id: 'r11_5', name: 'URSINHO', emoji: '🧸', relevant: false, rejectMsg: 'BRINQUEDO FICA FORA DA LANCHEIRA!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: TARDE NA PRAÇA',
        instruction: 'FILTRE O QUE É COMIDA E BEBIDA PARA LEVAR À PRAÇA.',
        place: 'PRAÇA',
        sceneEmoji: '⛲☀️',
        weather: 'TARDE DE SOL',
        thermoIcon: '☀️',
        theme: 'default',
        items: [
          { id: 'r12_1', name: 'ÁGUA', emoji: '💧', relevant: true },
          { id: 'r12_2', name: 'MORANGOS', emoji: '🍓', relevant: true },
          { id: 'r12_3', name: 'BISCOITO INTEGRAL', emoji: '🍪', relevant: true },
          { id: 'r12_4', name: 'LÁPIS DE COR', emoji: '🖍️', relevant: false, rejectMsg: 'LÁPIS NÃO É LANCHE!' },
          { id: 'r12_5', name: 'PATINS', emoji: '🛼', relevant: false, rejectMsg: 'PATINS NÃO CABE NA LANCHEIRA!' },
        ],
      },
    ],
  },
  2: {
    label: '2 - 2',
    name: 'FÁCIL (ESCOLA NO CALOR)',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: ESCOLA NO CALOR',
        instruction: 'ESTÁ MUITO CALOR! ABSTRAIA COMIDAS QUENTES E OBJETOS QUE NÃO SERVEM PARA O LANCHE.',
        place: 'ESCOLA',
        sceneEmoji: '🏫☀️',
        weather: 'MUITO CALOR',
        thermoIcon: '🥵',
        theme: 'default',
        items: [
          { id: 'r21_1', name: 'SUCO NATURAL', emoji: '🧃', relevant: true },
          { id: 'r21_2', name: 'BANANA', emoji: '🍌', relevant: true },
          { id: 'r21_3', name: 'BISCOITO', emoji: '🍪', relevant: true },
          { id: 'r21_4', name: 'SOPA QUENTE', emoji: '🍲', relevant: false, rejectMsg: 'ESTÁ MUITO CALOR PARA SOPA!' },
          { id: 'r21_5', name: 'GUARDA-CHUVA', emoji: '☂️', relevant: false, rejectMsg: 'NÃO CABE NA LANCHEIRA!' },
          { id: 'r21_6', name: 'CARRINHO', emoji: '🚗', relevant: false, rejectMsg: 'ISSO É UM BRINQUEDO!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: CLUBE DE NATAÇÃO',
        instruction: 'DEPOIS DE NADAR NO CALOR, O QUE É IDEAL PARA HIDRATAR E LANCHEAR?',
        place: 'CLUBE',
        sceneEmoji: '🏊☀️',
        weather: 'SOL FORTE',
        thermoIcon: '🌡️',
        theme: 'default',
        items: [
          { id: 'r22_1', name: 'ÁGUA DE COCO', emoji: '🥥', relevant: true },
          { id: 'r22_2', name: 'MELANCIA', emoji: '🍉', relevant: true },
          { id: 'r22_3', name: 'SANDUÍCHE NATURAL', emoji: '🥪', relevant: true },
          { id: 'r22_4', name: 'CHÁ FERVENDO', emoji: '🫖', relevant: false, rejectMsg: 'BEBIDA QUENTE NO SOL FORTE NÃO COMBINA!' },
          { id: 'r22_5', name: 'ÓCULOS DE NATAÇÃO', emoji: '🥽', relevant: false, rejectMsg: 'ISSO VAI NA MOCHILA DE ROUPAS, NÃO NA LANCHEIRA!' },
          { id: 'r22_6', name: 'CHINELO', emoji: '🩴', relevant: false, rejectMsg: 'CALÇADO NÃO VAI JUNTO COM A COMIDA!' },
        ],
      },
    ],
  },
  3: {
    label: '2 - 3',
    name: 'NORMAL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: PASSEIO AO ZOOLÓGICO',
        instruction: 'VAMOS CAMINHAR BASTANTE! ESCOLHA LANCHES PRÁTICOS DE COMER COM AS MÃOS.',
        place: 'ZOOLÓGICO',
        sceneEmoji: '🦁🌤️',
        weather: 'DIA ENSOLARADO',
        thermoIcon: '☀️',
        theme: 'default',
        items: [
          { id: 'r31_1', name: 'GARRAFA DE ÁGUA', emoji: '💧', relevant: true },
          { id: 'r31_2', name: 'MAÇÃ LAVADA', emoji: '🍎', relevant: true },
          { id: 'r31_3', name: 'MINI SANDUÍCHE', emoji: '🥪', relevant: true },
          { id: 'r31_4', name: 'GUARDANAPO', emoji: '🧻', relevant: true },
          { id: 'r31_5', name: 'MACARRÃO COM MOLHO', emoji: '🍝', relevant: false, rejectMsg: 'DIFÍCIL DE COMER CAMINHANDO NO ZOOLÓGICO!' },
          { id: 'r31_6', name: 'BINÓCULO', emoji: '🔭', relevant: false, rejectMsg: 'BINÓCULO VAI NO PESCOÇO, NÃO NA LANCHEIRA!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: CINEMA À TARDE',
        instruction: 'PARA ASSISTIR AO FILME SEM FAZER SUJEIRA, QUAIS ITENS COMBINAM COM O CINEMA?',
        place: 'CINEMA',
        sceneEmoji: '🎬🍿',
        weather: 'AR-CONDICIONADO',
        thermoIcon: '❄️',
        theme: 'cold',
        items: [
          { id: 'r32_1', name: 'PIPOCA', emoji: '🍿', relevant: true },
          { id: 'r32_2', name: 'SUCO DE CAIXINHA', emoji: '🧃', relevant: true },
          { id: 'r32_3', name: 'UVAS SEM SEMENTE', emoji: '🍇', relevant: true },
          { id: 'r32_4', name: 'GUARDANAPO', emoji: '🧻', relevant: true },
          { id: 'r32_5', name: 'SORVETE DERRETENDO', emoji: '🍦', relevant: false, rejectMsg: 'SORVETE DE CASQUINHA SUJA A POLTRONA!' },
          { id: 'r32_6', name: 'LANTERNA', emoji: '🔦', relevant: false, rejectMsg: 'NÃO PODE ACENDER LANTERNA NO CINEMA!' },
        ],
      },
    ],
  },
  4: {
    label: '2 - 4',
    name: 'MÉDIO (PASSEIO NO FRIO)',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: PASSEIO NA SERRA',
        instruction: 'ESTÁ MUITO FRIO! ESCOLHA ALIMENTOS ACONCHEGANTES E IGNORE SORVETES OU PICOLÉS.',
        place: 'PASSEIO',
        sceneEmoji: '❄️🏔️',
        weather: 'DIA FRIO',
        thermoIcon: '🥶',
        theme: 'cold',
        items: [
          { id: 'r41_1', name: 'CHOCOLATE QUENTE', emoji: '☕', relevant: true },
          { id: 'r41_2', name: 'BOLO CASEIRO', emoji: '🍰', relevant: true },
          { id: 'r41_3', name: 'PÃO DE QUEIJO', emoji: '🧀', relevant: true },
          { id: 'r41_4', name: 'GUARDANAPO', emoji: '🧻', relevant: true },
          { id: 'r41_5', name: 'SORVETE', emoji: '🍦', relevant: false, rejectMsg: 'SORVETE NO FRIO NÃO COMBINA!' },
          { id: 'r41_6', name: 'PICOLÉ', emoji: '🍧', relevant: false, rejectMsg: 'ESTÁ FRIO PARA PICOLÉ!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: ESCOLA EM DIA CHUVOSO',
        instruction: 'DIA GELADO E CHUVOSO! ABSTRAIA OS ITENS GELADOS E GUARDE O LANCHE IDEAL.',
        place: 'ESCOLA',
        sceneEmoji: '🌧️🧥',
        weather: 'CHUVA E FRIO',
        thermoIcon: '🌧️',
        theme: 'cold',
        items: [
          { id: 'r42_1', name: 'CHÁ MORNO', emoji: '🫖', relevant: true },
          { id: 'r42_2', name: 'TORRADA INTEGRAL', emoji: '🍞', relevant: true },
          { id: 'r42_3', name: 'BANANA', emoji: '🍌', relevant: true },
          { id: 'r42_4', name: 'LENÇO DE PAPEL', emoji: '🧻', relevant: true },
          { id: 'r42_5', name: 'RASPADINHA GELO', emoji: '🍧', relevant: false, rejectMsg: 'MUITO GELADO PARA UM DIA DE CHUVA!' },
          { id: 'r42_6', name: 'GALOCHA', emoji: '👢', relevant: false, rejectMsg: 'BOTA DE CHUVA NÃO VAI NA LANCHEIRA!' },
        ],
      },
    ],
  },
  5: {
    label: '2 - 5',
    name: 'DIFÍCIL (PIQUENIQUE À TARDE)',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: PIQUENIQUE À TARDE',
        instruction: 'PREPARE O PIQUENIQUE! FILTRE OS 5 ITENS ESSENCIAIS ENTRE VÁRIOS OBJETOS DA CASA.',
        place: 'PIQUENIQUE',
        sceneEmoji: '🧺🌤️',
        weather: 'TARDE AGRADÁVEL',
        thermoIcon: '🌤️',
        theme: 'default',
        items: [
          { id: 'r51_1', name: 'ÁGUA', emoji: '💧', relevant: true },
          { id: 'r51_2', name: 'UVAS', emoji: '🍇', relevant: true },
          { id: 'r51_3', name: 'SANDUÍCHE', emoji: '🥪', relevant: true },
          { id: 'r51_4', name: 'SUCO', emoji: '🧃', relevant: true },
          { id: 'r51_5', name: 'TOALHA DE MÃO', emoji: '🧻', relevant: true },
          { id: 'r51_6', name: 'SABONETE', emoji: '🧼', relevant: false, rejectMsg: 'SABONETE É DE BANHEIRO!' },
          { id: 'r51_7', name: 'CHAVE DE FENDA', emoji: '🪛', relevant: false, rejectMsg: 'FERRAMENTA NÃO VAI NO LANCHE!' },
          { id: 'r51_8', name: 'BONECA', emoji: '🪆', relevant: false, rejectMsg: 'FOQUE APENAS NO LANCHE!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: VIAGEM LONGA DE ÔNIBUS',
        instruction: 'EM VIAGEM DE ÔNIBUS NÃO HÁ GELADEIRA NEM MICRO-ONDAS! ESCOLHA COMIDAS QUE NÃO ESTRAGAM.',
        place: 'VIAGEM ÔNIBUS',
        sceneEmoji: '🚌🛣️',
        weather: 'SEM GELADEIRA',
        thermoIcon: '🌡️',
        theme: 'default',
        items: [
          { id: 'r52_1', name: 'ÁGUA MINERAL', emoji: '💧', relevant: true },
          { id: 'r52_2', name: 'CASTANHAS E NOZES', emoji: '🥜', relevant: true },
          { id: 'r52_3', name: 'MAÇÃ', emoji: '🍎', relevant: true },
          { id: 'r52_4', name: 'BISCOITO SALGADO', emoji: '🍘', relevant: true },
          { id: 'r52_5', name: 'ÁLCOOL EM GEL', emoji: '🧴', relevant: true },
          { id: 'r52_6', name: 'PEIXE CRU', emoji: '🍣', relevant: false, rejectMsg: 'ESTRAGA FORA DA GELADEIRA!' },
          { id: 'r52_7', name: 'SORVETE DE POTE', emoji: '🍨', relevant: false, rejectMsg: 'DERRETE TODO NO ÔNIBUS!' },
          { id: 'r52_8', name: 'TRAVESSEIRO GIGANTE', emoji: '🛏️', relevant: false, rejectMsg: 'NÃO CABE NA LANCHEIRA!' },
        ],
      },
    ],
  },
  6: {
    label: '2 - 6',
    name: 'MUITO DIFÍCIL',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: TRILHA ECOLÓGICA',
        instruction: 'TRILHA NO MATO! PRECISAMOS DE ENERGIA LEVE E HIDRATAÇÃO, SEM VIDRO OU COMIDA PESADA.',
        place: 'TRILHA',
        sceneEmoji: '🥾🌲',
        weather: 'SOL E CAMINHADA',
        thermoIcon: '🥵',
        theme: 'default',
        items: [
          { id: 'r61_1', name: 'GARRAFA PLÁSTICA', emoji: '🧴', relevant: true },
          { id: 'r61_2', name: 'BANANA', emoji: '🍌', relevant: true },
          { id: 'r61_3', name: 'BARRA DE CEREAL', emoji: '🍫', relevant: true },
          { id: 'r61_4', name: 'SANDUÍCHE LEVE', emoji: '🥪', relevant: true },
          { id: 'r61_5', name: 'LENÇO UMEDECIDO', emoji: '🧻', relevant: true },
          { id: 'r61_6', name: 'FEIJOADA QUENTE', emoji: '🍲', relevant: false, rejectMsg: 'MUITO PESADO PARA FAZER TRILHA!' },
          { id: 'r61_7', name: 'TAÇA DE VIDRO', emoji: '🍷', relevant: false, rejectMsg: 'VIDRO PODE QUEBRAR NA TRILHA!' },
          { id: 'r61_8', name: 'BÚSSOLA', emoji: '🧭', relevant: false, rejectMsg: 'EQUIPAMENTO VAI NO BOLSO, NÃO NA LANCHEIRA!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: OBSERVAÇÃO DE ESTRELAS À NOITE',
        instruction: 'NOITE FRIA NO CAMPO! ESCOLHA LANCHES NOTURNOS AQUECIDOS E PRÁTICOS.',
        place: 'CAMPO À NOITE',
        sceneEmoji: '🌙✨',
        weather: 'NOITE GELADA',
        thermoIcon: '🥶',
        theme: 'night',
        items: [
          { id: 'r62_1', name: 'GARRAFA TÉRMICA CHÁ', emoji: '🍶', relevant: true },
          { id: 'r62_2', name: 'PÃO DE QUEIJO', emoji: '🧀', relevant: true },
          { id: 'r62_3', name: 'BOLO DE MILHO', emoji: '🍰', relevant: true },
          { id: 'r62_4', name: 'BISCOITO DOCE', emoji: '🍪', relevant: true },
          { id: 'r62_5', name: 'GUARDANAPO', emoji: '🧻', relevant: true },
          { id: 'r62_6', name: 'PICOLÉ DE LIMÃO', emoji: '🍧', relevant: false, rejectMsg: 'ESTÁ MUITO FRIO À NOITE PARA PICOLÉ!' },
          { id: 'r62_7', name: 'TELESCÓPIO', emoji: '🔭', relevant: false, rejectMsg: 'INSTRUMENTO NÃO VAI NA LANCHEIRA!' },
          { id: 'r62_8', name: 'PROTETOR SOLAR', emoji: '🧴', relevant: false, rejectMsg: 'NÃO HÁ SOL À NOITE!' },
        ],
      },
    ],
  },
  7: {
    label: '2 - 7',
    name: 'EXTREMO',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: AMIGO COM ALERGIA A AMENDOIM E LEITE',
        instruction: 'NÍVEL EXTREMO! O LANCHE É PARA DIVIDIR COM UM AMIGO ALÉRGICO A LEITE E AMENDOIM. ABSTRAIA OS PERIGOSOS!',
        place: 'ESCOLA (INCLUSÃO)',
        sceneEmoji: '🏫🤝',
        weather: 'SEM LEITE/AMENDOIM',
        thermoIcon: '⚠️',
        theme: 'default',
        items: [
          { id: 'r71_1', name: 'SUCO DE UVA', emoji: '🧃', relevant: true },
          { id: 'r71_2', name: 'SALADA DE FRUTAS', emoji: '🍓', relevant: true },
          { id: 'r71_3', name: 'PÃO COM GELEIA', emoji: '🍞', relevant: true },
          { id: 'r71_4', name: 'ÁGUA', emoji: '💧', relevant: true },
          { id: 'r71_5', name: 'GUARDANAPO', emoji: '🧻', relevant: true },
          { id: 'r71_6', name: 'PAÇOCA DE AMENDOIM', emoji: '🥜', relevant: false, rejectMsg: 'PERIGO! CONTÉM AMENDOIM!' },
          { id: 'r71_7', name: 'IOGURTE DE LEITE', emoji: '🥛', relevant: false, rejectMsg: 'PERIGO! CONTÉM LEITE!' },
          { id: 'r71_8', name: 'QUEIJO PRATO', emoji: '🧀', relevant: false, rejectMsg: 'QUEIJO É DERIVADO DE LEITE!' },
          { id: 'r71_9', name: 'CADERNO', emoji: '📓', relevant: false, rejectMsg: 'MATERIAL ESCOLAR FICA NA MOCHILA!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: PASSEIO NA PRAIA SEM TALHERES',
        instruction: 'CALOR NA PRAIA E SEM TALHERES! ESCOLHA APENAS ITENS QUE NÃO ESTRAGAM NO SOL E NÃO PRECISAM DE GARFO/COLHER.',
        place: 'PRAIA',
        sceneEmoji: '🏖️☀️',
        weather: 'SOL FORTE / SEM TALHER',
        thermoIcon: '🥵',
        theme: 'default',
        items: [
          { id: 'r72_1', name: 'ÁGUA GELADA', emoji: '💧', relevant: true },
          { id: 'r72_2', name: 'MILHO COZIDO ESPIGA', emoji: '🌽', relevant: true },
          { id: 'r72_3', name: 'BANANA', emoji: '🍌', relevant: true },
          { id: 'r72_4', name: 'BISCOITO DE POLVILHO', emoji: '🍘', relevant: true },
          { id: 'r72_5', name: 'ÁGUA DE COCO', emoji: '🥥', relevant: true },
          { id: 'r72_6', name: 'IOGURTE DE POTINHO', emoji: '🍨', relevant: false, rejectMsg: 'ESTRAGA NO SOL E PRECISA DE COLHER!' },
          { id: 'r72_7', name: 'SOPA DE LEGUMES', emoji: '🍲', relevant: false, rejectMsg: 'SOPA QUENTE NA PRAIA SEM COLHER NÃO DÁ!' },
          { id: 'r72_8', name: 'CHOCOLATE AO LEITE', emoji: '🍫', relevant: false, rejectMsg: 'DERRETE INTEIRO NO SOL DA PRAIA!' },
          { id: 'r72_9', name: 'BALDE DE AREIA', emoji: '🪣', relevant: false, rejectMsg: 'BRINQUEDO DE PRAIA NÃO É LANCHE!' },
        ],
      },
    ],
  },
  8: {
    label: '2 - 8',
    name: 'PESADELO',
    noFail: false,
    routines: [
      {
        title: 'ROTINA 1 DE 2: ACAMPAMENTO NA MONTANHA (FRIO + SEM FOGÃO)',
        instruction: 'MODO PESADELO! FRIO INTENSO NA MONTANHA E SEM FOGÃO PARA COZINHAR. SELECIONE OS 6 ITENS PERFEITOS!',
        place: 'MONTANHA',
        sceneEmoji: '⛺❄️',
        weather: 'FRIO / SEM FOGÃO',
        thermoIcon: '🥶',
        theme: 'cold',
        items: [
          { id: 'r81_1', name: 'GARRAFA TÉRMICA CAFÉ', emoji: '🍶', relevant: true },
          { id: 'r81_2', name: 'PÃO INTEGRAL', emoji: '🍞', relevant: true },
          { id: 'r81_3', name: 'BOLO DE CENOURA', emoji: '🍰', relevant: true },
          { id: 'r81_4', name: 'MAÇÃ', emoji: '🍎', relevant: true },
          { id: 'r81_5', name: 'CASTANHAS', emoji: '🥜', relevant: true },
          { id: 'r81_6', name: 'GUARDANAPO', emoji: '🧻', relevant: true },
          { id: 'r81_7', name: 'ARROZ CRU', emoji: '🍚', relevant: false, rejectMsg: 'NÃO TEMOS FOGÃO PARA COZINHAR ARROZ!' },
          { id: 'r81_8', name: 'OVO CRU', emoji: '🥚', relevant: false, rejectMsg: 'OVO CRU QUEBRA E NÃO DÁ PARA FRITAR!' },
          { id: 'r81_9', name: 'PICOLÉ DE UVA', emoji: '🍧', relevant: false, rejectMsg: 'CONGELANTE DEMAIS PARA O FRIO DA MONTANHA!' },
          { id: 'r81_10', name: 'MARTELO', emoji: '🔨', relevant: false, rejectMsg: 'FERRAMENTA NÃO VAI NA LANCHEIRA!' },
        ],
      },
      {
        title: 'ROTINA 2 DE 2: FEIRA CULTURAL (CALOR + SEM AÇÚCAR + PRÁTICO)',
        instruction: 'DESAFIO FINAL! DIA QUENTE, LANCHE SEM AÇÚCAR ADICIONADO E FÁCIL DE COMER EM PÉ. ABSTRAIA TODOS OS DISTRATORES!',
        place: 'FEIRA CULTURAL',
        sceneEmoji: '🎪☀️',
        weather: 'CALOR / SEM AÇÚCAR',
        thermoIcon: '🥵',
        theme: 'default',
        items: [
          { id: 'r82_1', name: 'ÁGUA MINERAL', emoji: '💧', relevant: true },
          { id: 'r82_2', name: 'SANDUÍCHE NATURAL', emoji: '🥪', relevant: true },
          { id: 'r82_3', name: 'UVAS FRESCAS', emoji: '🍇', relevant: true },
          { id: 'r82_4', name: 'BANANA', emoji: '🍌', relevant: true },
          { id: 'r82_5', name: 'BISCOITO ÁGUA E SAL', emoji: '🍘', relevant: true },
          { id: 'r82_6', name: 'GUARDANAPO', emoji: '🧻', relevant: true },
          { id: 'r82_7', name: 'REFRIGERANTE', emoji: '🥤', relevant: false, rejectMsg: 'CONTÉM MUITO AÇÚCAR!' },
          { id: 'r82_8', name: 'DONUT RECHEADO', emoji: '🍩', relevant: false, rejectMsg: 'DOCE COM MUITO AÇÚCAR!' },
          { id: 'r82_9', name: 'CALDO QUENTE', emoji: '🍲', relevant: false, rejectMsg: 'QUENTE DEMAIS PARA O CALOR E DIFÍCIL EM PÉ!' },
          { id: 'r82_10', name: 'INGRESSO DE PAPEL', emoji: '🎟️', relevant: false, rejectMsg: 'INGRESSO VAI NO BOLSO, NÃO NA LANCHEIRA!' },
        ],
      },
    ],
  },
};

export default function Fase2AbstracaoPage() {
  const router = useRouter();
  const { carregando, progressoInicial, salvarProgresso } = useProgresso('abstracao');

  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [currentRoutineIndex, setCurrentRoutineIndex] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [lives, setLives] = useState<number>(3);

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [endModalState, setEndModalState] = useState<{ open: boolean; victory: boolean }>({
    open: false,
    victory: false,
  });

  const levelData = SITUATIONS_CONFIG[currentLevel];
  const routineData = levelData.routines[currentRoutineIndex];
  const totalRequired = routineData.items.filter((i) => i.relevant).length;

  const initSituation = useCallback((lvlIndex: number, routineIdx = 0) => {
    const safeLevel = SITUATIONS_CONFIG[lvlIndex] ? lvlIndex : 0;
    const nextLvl = SITUATIONS_CONFIG[safeLevel];
    const safeRoutine = nextLvl.routines[routineIdx] ? routineIdx : 0;

    setCurrentLevel(safeLevel);
    setCurrentRoutineIndex(safeRoutine);
    setSelectedIds([]);
    setLives(3);
    setFeedback(null);
    setEndModalState({ open: false, victory: false });
  }, []);

  useEffect(() => {
    if (!carregando) {
      initSituation(progressoInicial.nivelAtual, progressoInicial.rotinaAtual);
    }
  }, [carregando, progressoInicial, initSituation]);

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

  const hasNextRoutine = currentRoutineIndex + 1 < levelData.routines.length;
  const hasNextLevel = Boolean(SITUATIONS_CONFIG[currentLevel + 1]);

  const handleLunchboxDrop = () => {
    if (!draggedItemId) return;
    const item = routineData.items.find((i) => i.id === draggedItemId);
    if (!item || selectedIds.includes(item.id)) return;

    if (!item.relevant) {
      showFeedback(item.rejectMsg || 'ESSE ITEM NÃO É NECESSÁRIO AGORA!', false);

      if (!levelData.noFail) {
        setLives((prev) => {
          const nextLives = prev - 1;
          if (nextLives <= 0) {
            setTimeout(() => setEndModalState({ open: true, victory: false }), 750);
          }
          return nextLives;
        });
      }
      return;
    }

    const updatedSelected = [...selectedIds, item.id];
    setSelectedIds(updatedSelected);
    showFeedback(`ÓTIMA ESCOLHA: ${item.name}!`, true);

    if (updatedSelected.length === totalRequired) {
      if (hasNextRoutine) {
        salvarProgresso(currentLevel, currentRoutineIndex + 1, false);
      } else if (hasNextLevel) {
        salvarProgresso(currentLevel + 1, 0, false);
      } else {
        salvarProgresso(currentLevel, currentRoutineIndex, true);
      }

      setTimeout(() => setEndModalState({ open: true, victory: true }), 750);
    }
  };

  // Temas da janela de contexto
  const windowThemeClasses =
    routineData.theme === 'cold'
      ? 'bg-gradient-to-b from-slate-300 to-slate-100'
      : routineData.theme === 'night'
        ? 'bg-gradient-to-b from-slate-800 to-slate-700'
        : 'bg-gradient-to-b from-sky-200 to-sky-100';

  const isCompleted = selectedIds.length === totalRequired;

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
            initSituation(lvl, 0);
            salvarProgresso(lvl, 0, false);
          }}
          faseNivelLabel={levelData.label}
          rotinaAtual={currentRoutineIndex + 1}
          totalRotinas={levelData.routines.length}
          acertosAtuais={selectedIds.length}
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

        {/* ÁREA CENTRAL EM 3 COLUNAS */}
        <section className="grid min-h-[360px] grid-cols-1 gap-4 lg:grid-cols-[260px_1.15fr_1.25fr]">
          {/* COLUNA 1: INDICADOR DE CONTEXTO */}
          <aside
            className="flex flex-col justify-between gap-3 rounded-[18px] bg-[#c8d1d9] p-3.5"
            aria-label="Contexto do Passeio"
          >
            <div className="rounded-[10px] bg-[#6f8dca] p-2 text-center text-[0.92rem] font-extrabold text-white">
              ONDE VAMOS?
            </div>

            <div
              className={`flex flex-1 flex-col items-center justify-center gap-2.5 rounded-[16px] border-[6px] border-white px-3 py-[18px] shadow-inner ${windowThemeClasses}`}
            >
              <div className="text-[3.4rem] leading-none">{routineData.sceneEmoji}</div>
              <div className="rounded-[20px] border-2 border-[#6f8dca] bg-white px-3.5 py-1 text-center text-[0.95rem] font-extrabold text-slate-800">
                {routineData.place}
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-[14px] border-2 border-[#6f8dca] bg-white px-3 py-2.5">
              <span className="text-[2rem] leading-none">{routineData.thermoIcon}</span>
              <div className="flex flex-col">
                <span className="text-[0.72rem] font-extrabold text-slate-500">
                  CLIMA / DETALHE
                </span>
                <span className="text-[0.92rem] font-extrabold text-gray-800">
                  {routineData.weather}
                </span>
              </div>
            </div>
          </aside>

          {/* COLUNA 2: ALVO DE DROP (LANCHEIRA ABERTA) */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleLunchboxDrop();
              setDraggedItemId(null);
            }}
            aria-label="Lancheira"
            className={`flex flex-col gap-3 rounded-[18px] border-4 p-3.5 transition-all duration-150 ${
              isCompleted
                ? 'border-solid border-[#4caf50] bg-[#f0fdf4]'
                : isDragOver
                  ? 'scale-[1.01] border-solid border-[#6f8dca] bg-[#dbeafe]'
                  : 'border-dashed border-[#6f8dca] bg-[#f8fafc]'
            }`}
          >
            <div className="flex items-center justify-between rounded-[12px] bg-[#6f8dca] px-3.5 py-2.5 text-[0.95rem] font-extrabold text-white">
              <span>🎒 MINHA LANCHEIRA</span>
              <span>
                {selectedIds.length} / {totalRequired} ITENS
              </span>
            </div>

            <div className="relative flex flex-1 flex-wrap content-center justify-center gap-2.5 p-2.5">
              {selectedIds.length === 0 ? (
                <p className="text-center text-[0.95rem] font-extrabold text-slate-500">
                  ARRASTE OS ITENS CERTOS PARA CÁ
                </p>
              ) : (
                routineData.items
                  .filter((item) => selectedIds.includes(item.id))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex w-[106px] cursor-default flex-col items-center justify-center gap-1.5 rounded-[14px] border-[3px] border-[#4caf50] bg-white px-2 py-2.5 shadow-xs"
                    >
                      <span className="text-[2.2rem] leading-none">{item.emoji}</span>
                      <span className="text-center text-[0.78rem] font-extrabold text-gray-800">
                        {item.name}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* COLUNA 3: DESPENSA / OPÇÕES COM DISTRATORES */}
          <div
            className="flex flex-col gap-3 rounded-[18px] bg-[#c8d1d9] p-3.5"
            aria-label="Opções Disponíveis"
          >
            <div className="rounded-[10px] bg-[#6f8dca] p-2 text-center text-[0.92rem] font-extrabold text-white">
              OPÇÕES EM CASA
            </div>

            <div className="grid flex-1 grid-cols-3 content-start gap-2.5 lg:grid-cols-2">
              {routineData.items
                .filter((item) => !selectedIds.includes(item.id))
                .map((item) => {
                  const showHint = levelData.noFail && item.relevant;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedItemId(item.id);
                        e.dataTransfer.setData('text/plain', item.id);
                      }}
                      onDragEnd={() => setDraggedItemId(null)}
                      className={`relative flex cursor-grab flex-col items-center justify-center gap-1.5 rounded-[14px] border-[3px] bg-white px-2 py-2.5 transition-all hover:-translate-y-0.5 active:cursor-grabbing ${
                        showHint
                          ? 'border-[#f59e0b] shadow-[0_0_0_4px_rgba(245,158,11,0.35)]'
                          : 'border-[#6f8dca] shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
                      }`}
                    >
                      {showHint && (
                        <span className="absolute -top-2.5 rounded-[6px] bg-[#f59e0b] px-2 py-0.5 text-[0.65rem] font-extrabold text-white">
                          ➔ LANCHEIRA
                        </span>
                      )}
                      <span className="text-[2.2rem] leading-none">{item.emoji}</span>
                      <span className="text-center text-[0.78rem] font-extrabold text-gray-800">
                        {item.name}
                      </span>
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
              COMO JOGAR - ABSTRAÇÃO
            </h2>
            <p className="font-bold text-slate-700">
              ABSTRAIR É FOCAR APENAS NO QUE É IMPORTANTE PARA O PROBLEMA E IGNORAR O RESTO:
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-left text-[0.92rem]">
              <li>
                <strong>2 ROTINAS POR NÍVEL:</strong> COMPLETE AS 2 SITUAÇÕES DO NÍVEL PARA AVANÇAR.
              </li>
              <li>
                <strong>OLHE A JANELA E O CLIMA:</strong> VEJA O LOCAL, A TEMPERATURA E OS DETALHES DO PASSEIO.
              </li>
              <li>
                <strong>ESCOLHA O ESSENCIAL:</strong> ARRASTE PARA A LANCHEIRA APENAS COMIDAS E OBJETOS ADEQUADOS PARA ESSE CONTEXTO.
              </li>
              <li>
                <strong>IGNORE OS DISTRATORES:</strong> BRINQUEDOS, FERRAMENTAS OU COMIDAS INADEQUADAS PARA O CLIMA/LOCAL DEVEM FICAR DE FORA!
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
                    : 'PARABÉNS! MESTRE DA ABSTRAÇÃO!'
                : 'VAMOS TENTAR DE NOVO?'}
            </h2>
            <p className="font-bold text-slate-700">
              {endModalState.victory
                ? hasNextRoutine
                  ? `EXCELENTE! AGORA COMPLETE A ROTINA 2 DO NÍVEL ${levelData.name}.`
                  : hasNextLevel
                    ? 'VOCÊ FILTROU O ESSENCIAL NAS 2 ROTINAS! PRONTO PARA O PRÓXIMO DESAFIO?'
                    : 'VOCÊ VENCEU TODAS AS ROTINAS ATÉ O NÍVEL PESADELO!'
                : 'OBSERVE BEM O CLIMA E AS REGRAS NA JANELA E ESCOLHA APENAS O NECESSÁRIO!'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => initSituation(currentLevel, currentRoutineIndex)}
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
                      initSituation(currentLevel, currentRoutineIndex + 1);
                    } else if (hasNextLevel) {
                      initSituation(currentLevel + 1, 0);
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