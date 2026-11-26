'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRedirectIfAuthenticated } from '@/hooks/use-auth-guard';

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const checkingAuth = useRedirectIfAuthenticated('/narrativa');

  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [alerta, setAlerta] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

  const resetarFormulario = useCallback(() => {
    setEmail('');
    setNovaSenha('');
    setConfirmarNovaSenha('');
    setCarregando(false);
    setAlerta(null);
  }, []);

  useEffect(() => {
    resetarFormulario();
    return () => {
      resetarFormulario();
    };
  }, [resetarFormulario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlerta(null);

    if (novaSenha !== confirmarNovaSenha) {
      setAlerta({ texto: 'As senhas não coincidem!', tipo: 'erro' });
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch('/api/recuperar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, novaSenha }),
      });

      const data = await res.json();

      if (res.ok) {
        setEmail('');
        setNovaSenha('');
        setConfirmarNovaSenha('');
        setAlerta({
          texto: 'Senha alterada com sucesso! Redirecionando para o login...',
          tipo: 'sucesso',
        });

        setTimeout(() => {
          resetarFormulario();
          router.replace('/login');
          router.refresh();
        }, 1500);
      } else {
        setAlerta({
          texto: data.error || 'Não foi possível alterar a senha.',
          tipo: 'erro',
        });
        setCarregando(false);
      }
    } catch {
      setAlerta({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
      setCarregando(false);
    }
  };

  if (checkingAuth) return null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#e5e4e4] px-4 py-6 font-sans">
      <main className="flex w-full max-w-[1000px] flex-col items-center justify-center gap-6 md:gap-8 lg:flex-row lg:gap-[12vw]">
        {/* Lado Esquerdo: Logo do Mundo Lógi */}
        <div className="logo-container flex justify-center">
          <Link href="/" onClick={resetarFormulario}>
            <Image
              src="/images/logo.png"
              alt="Mundo Lógi Logo"
              width={320}
              height={190}
              priority
              className="h-auto w-[200px] max-w-full object-contain sm:w-[240px] md:w-[270px] lg:w-[320px]"
            />
          </Link>
        </div>

        {/* Lado Direito: Formulário e Ações */}
        <div className="flex w-full max-w-[295px] flex-col items-center gap-4 sm:max-w-[330px] md:max-w-[360px] lg:max-w-[380px] lg:gap-[18px]">
          {/* Card Azul Claro */}
          <div className="flex w-full flex-col items-center rounded-[22px] bg-[#9eb9cc] p-5 shadow-sm sm:p-7 lg:rounded-[24px] lg:p-[40px]">
            <h2 className="mb-4 text-[24px] font-bold text-black sm:text-[28px] lg:mb-[25px] lg:text-[32px]">
              Alterar senha!
            </h2>

            {/* Componente de Alerta */}
            {alerta && (
              <div className="mb-3 w-full">
                <Alert tipo={alerta.tipo} mensagem={alerta.texto} />
              </div>
            )}

            <form
              id="form-recuperar-senha"
              onSubmit={handleSubmit}
              autoComplete="off"
              className="flex w-full flex-col gap-3 lg:gap-[16px]"
            >
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
                className="w-full rounded-[12px] bg-[#c8d1d9] px-4 py-2.5 text-[15px] text-black outline-none placeholder:text-[#555] lg:rounded-[14px] lg:px-[20px] lg:py-[14px] lg:text-[16px]"
              />

              <input
                type="password"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded-[12px] bg-[#c8d1d9] px-4 py-2.5 text-[15px] text-black outline-none placeholder:text-[#555] lg:rounded-[14px] lg:px-[20px] lg:py-[14px] lg:text-[16px]"
              />

              <input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmarNovaSenha}
                onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded-[12px] bg-[#c8d1d9] px-4 py-2.5 text-[15px] text-black outline-none placeholder:text-[#555] lg:rounded-[14px] lg:px-[20px] lg:py-[14px] lg:text-[16px]"
              />
            </form>
          </div>

          {/* Botão "Alterar" */}
          <Button
            type="submit"
            form="form-recuperar-senha"
            disabled={carregando}
            className="w-[140px] py-[7px] text-[15px] lg:w-[150px] lg:py-[8px] lg:text-[16px]"
          >
            {carregando ? 'Alterando...' : 'Alterar'}
          </Button>

          {/* Link para voltar ao Login */}
          <Link
            href="/login"
            onClick={resetarFormulario}
            className="text-center text-[14px] font-semibold text-[#1d4ed8] underline transition-colors hover:text-[#1e40af] lg:text-[15px]"
          >
            Lembrou a senha? Voltar ao login
          </Link>
        </div>
      </main>
    </div>
  );
}