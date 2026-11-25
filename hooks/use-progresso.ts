'use client';

import { useState, useEffect, useCallback } from 'react';

export type PilarSlug = 'decomposicao' | 'abstracao' | 'padroes' | 'algoritmo';

export function useProgresso(pilar: PilarSlug) {
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [progressoInicial, setProgressoInicial] = useState<{
    nivelAtual: number;
    rotinaAtual: number;
  }>({ nivelAtual: 0, rotinaAtual: 0 });

  useEffect(() => {
    const userStr = localStorage.getItem('mundo_logi_user');
    if (!userStr) {
      setCarregando(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user?.id) {
        setCarregando(false);
        return;
      }

      setUsuarioId(user.id);

      fetch(`/api/progresso?usuarioId=${user.id}&pilar=${pilar}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.progresso) {
            setProgressoInicial({
              nivelAtual: data.progresso.nivelAtual,
              rotinaAtual: data.progresso.rotinaAtual,
            });
          }
        })
        .catch((err) => console.error('Erro ao carregar progresso:', err))
        .finally(() => setCarregando(false));
    } catch {
      setCarregando(false);
    }
  }, [pilar]);

  const salvarProgresso = useCallback(
    async (nivelAtual: number, rotinaAtual: number, concluido = false) => {
      if (!usuarioId) return;

      try {
        await fetch('/api/progresso', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuarioId,
            pilar,
            nivelAtual,
            rotinaAtual,
            concluido,
          }),
        });
      } catch (err) {
        console.error('Erro ao salvar progresso:', err);
      }
    },
    [usuarioId, pilar]
  );

  return { carregando, progressoInicial, salvarProgresso };
}