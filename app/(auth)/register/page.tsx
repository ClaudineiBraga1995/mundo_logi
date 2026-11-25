'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function RegistrePage() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  // Controla o tipo do input de data (muda para 'date' ao focar para exibir o calendário)
  const [inputType, setInputType] = useState<'text' | 'date'>('text');

  // Limites de data para evitar instabilidade na pré-renderização
  const [hoje, setHoje] = useState<string>('');
  const [minData, setMinData] = useState<string>('');

  const [alerta, setAlerta] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

  useEffect(() => {
    const dataAtual = new Date();
    setHoje(dataAtual.toISOString().split('T')[0]);

    const dataMin = new Date();
    dataMin.setFullYear(dataMin.getFullYear() - 100);
    setMinData(dataMin.toISOString().split('T')[0]);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlerta(null);

    if (senha !== confirmarSenha) {
      setAlerta({ texto: 'As senhas não coincidem!', tipo: 'erro' });
      return;
    }

    const dataSelecionada = new Date(dataNascimento);
    const agora = new Date();
    const dataMinima = new Date();
    dataMinima.setFullYear(dataMinima.getFullYear() - 100);

    if (dataSelecionada > agora) {
      setAlerta({ texto: 'A data de nascimento não pode ser no futuro!', tipo: 'erro' });
      return;
    }

    if (dataSelecionada < dataMinima) {
      setAlerta({ texto: 'Por favor, insira uma data de nascimento válida (máximo 100 anos).', tipo: 'erro' });
      return;
    }

    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senha,
          dataNascimento,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlerta({ texto: 'Cadastro realizado com sucesso! Redirecionando...', tipo: 'sucesso' });
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setAlerta({ texto: data.error || 'Erro ao cadastrar usuário.', tipo: 'erro' });
      }
    } catch (err) {
      setAlerta({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#e5e4e4] px-4 py-6 font-sans">
      <main className="flex w-full max-w-[1000px] flex-col items-center justify-center gap-6 md:gap-8 lg:flex-row lg:gap-[12vw]">
        {/* Lado Esquerdo: Logo do Mundo Lógi */}
        <div className="logo-container flex justify-center">
          <Link href="/">
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
          <div className="flex w-full flex-col items-center rounded-[22px] bg-[#9eb9cc] p-5 shadow-sm sm:p-7 lg:rounded-[24px] lg:p-[35px]">
            <h2 className="mb-4 text-[24px] font-bold text-black sm:text-[28px] lg:mb-[20px] lg:text-[32px]">
              Criar Conta
            </h2>

            {/* Componente de Alerta de Erro/Sucesso */}
            {alerta && (
              <div className="mb-3 w-full">
                <Alert tipo={alerta.tipo} mensagem={alerta.texto} />
              </div>
            )}

            <form id="form-cadastro" onSubmit={handleRegister} className="flex w-full flex-col gap-2.5 lg:gap-[14px]">
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full rounded-[12px] bg-[#c8d1d9] px-4 py-2.5 text-[15px] text-black outline-none placeholder:text-[#555] lg:rounded-[14px] lg:px-[20px] lg:py-[12px] lg:text-[16px]"
              />

              <input
                type={inputType}
                placeholder="Data de Nascimento"
                value={dataNascimento}
                min={minData}
                max={hoje}
                onFocus={() => setInputType('date')}
                onBlur={() => {
                  if (!dataNascimento) setInputType('text');
                }}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
                className="w-full rounded-[12px] bg-[#c8d1d9] px-4 py-2.5 text-[15px] text-black outline-none placeholder:text-[#555] lg:rounded-[14px] lg:px-[20px] lg:py-[12px] lg:text-[16px]"
              />

              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[12px] bg-[#c8d1d9] px-4 py-2.5 text-[15px] text-black outline-none placeholder:text-[#555] lg:rounded-[14px] lg:px-[20px] lg:py-[12px] lg:text-[16px]"
              />

              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full rounded-[12px] bg-[#c8d1d9] px-4 py-2.5 text-[15px] text-black outline-none placeholder:text-[#555] lg:rounded-[14px] lg:px-[20px] lg:py-[12px] lg:text-[16px]"
              />

              <input
                type="password"
                placeholder="Confirmar Senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className="w-full rounded-[12px] bg-[#c8d1d9] px-4 py-2.5 text-[15px] text-black outline-none placeholder:text-[#555] lg:rounded-[14px] lg:px-[20px] lg:py-[12px] lg:text-[16px]"
              />
            </form>
          </div>

          {/* Botão "Cadastrar" */}
          <Button
            type="submit"
            form="form-cadastro"
            className="w-[150px] py-[7px] text-[15px] lg:w-[160px] lg:py-[8px] lg:text-[16px]"
          >
            Cadastrar
          </Button>

          {/* Link para voltar ao Login */}
          <Link
            href="/login"
            className="text-center text-[14px] font-semibold text-[#1d4ed8] underline transition-colors hover:text-[#1e40af] lg:text-[15px]"
          >
            Já tem conta? Entrar
          </Link>
        </div>
      </main>
    </div>
  );
}