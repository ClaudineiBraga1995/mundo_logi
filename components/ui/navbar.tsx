import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  /** Texto do botão da direita (Padrão: 'Sair') */
  textoBotao?: string;
  /** Rota para onde o botão vai redirecionar (Padrão: '/login') */
  hrefBotao?: string;
  /** Ação customizada ao clicar no botão, se não quiser usar apenas o Link */
  onBotaoClick?: () => void;
}

export function Navbar({
  textoBotao = 'Sair',
  hrefBotao = '/login',
  onBotaoClick,
}: NavbarProps) {
  return (
    <header className="flex w-full items-center justify-between z-10 px-2 py-1">
      {/* Logo clicável direcionando para a Home */}
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="Mundo Lógi Logo"
          width={120}
          height={70}
          priority
          className="w-[120px] max-w-full object-contain"
        />
      </Link>

      {/* Botão de Ação Direita */}
      {onBotaoClick ? (
        <Button onClick={onBotaoClick} className="px-6 py-2 text-base">
          {textoBotao}
        </Button>
      ) : (
        <Link href={hrefBotao}>
          <Button className="px-6 py-2 text-base">{textoBotao}</Button>
        </Link>
      )}
    </header>
  );
}