import type { Metadata } from 'next';
import './globals.css';
import { BotaoSom } from '@/components/ui/botao-som';

export const metadata: Metadata = {
  title: 'Mundo Lógi',
  description: 'Aplicação de Jogos do Pensamento Computacional',
  icons: {
    icon: 'public/images/logo.svg', // Troque para '/logo.svg' se o seu arquivo for SVG
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        <BotaoSom />
      </body>
    </html>
  );
}
