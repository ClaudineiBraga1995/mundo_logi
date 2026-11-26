'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const USER_KEYS = ['mundo_logi_user', 'usuario', 'user', 'usuarioLogado', 'authUser'];
const ID_KEYS = ['usuarioId', 'userId', 'token', 'authToken'];

export function hasActiveSession(): { loggedIn: boolean; userName: string | null } {
  if (typeof window === 'undefined') {
    return { loggedIn: false, userName: null };
  }

  for (const key of USER_KEYS) {
    const raw = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const entity = parsed?.usuario || parsed?.user || parsed?.data || parsed;
        const hasUser = Boolean(
          entity?.id || entity?._id || entity?.email || entity?.nome || entity?.name
        );
        if (hasUser) {
          return {
            loggedIn: true,
            userName: entity?.nome || entity?.name || null,
          };
        }
      } catch {
        return { loggedIn: true, userName: raw };
      }
    }
  }

  for (const idKey of ID_KEYS) {
    const val = window.localStorage.getItem(idKey) || window.sessionStorage.getItem(idKey);
    if (val) {
      return { loggedIn: true, userName: null };
    }
  }

  return { loggedIn: false, userName: null };
}

export function clearActiveSession() {
  if (typeof window === 'undefined') return;

  [...USER_KEYS, ...ID_KEYS].forEach((k) => {
    window.localStorage.removeItem(k);
    window.sessionStorage.removeItem(k);
  });
}

export function useRedirectIfAuthenticated(redirectTo = '/narrativa') {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { loggedIn } = hasActiveSession();
    if (loggedIn) {
      router.replace(redirectTo);
    } else {
      setChecking(false);
    }
  }, [router, redirectTo]);

  return checking;
}