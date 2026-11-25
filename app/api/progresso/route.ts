import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Se seu arquivo prisma ficar em outro lugar (ex: '@/prisma'), ajuste aqui

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');
    const pilar = searchParams.get('pilar');

    if (!usuarioId) {
      return NextResponse.json({ error: 'usuarioId é obrigatório' }, { status: 400 });
    }

    if (pilar) {
      const progresso = await prisma.progresso.findUnique({
        where: {
          usuarioId_pilar: { usuarioId, pilar },
        },
      });
      return NextResponse.json({ progresso });
    }

    const progressos = await prisma.progresso.findMany({
      where: { usuarioId },
    });

    return NextResponse.json({ progressos });
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    return NextResponse.json({ error: 'Erro interno ao buscar progresso' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usuarioId, pilar, nivelAtual, rotinaAtual, concluido } = body;

    if (!usuarioId || !pilar) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const progresso = await prisma.progresso.upsert({
      where: {
        usuarioId_pilar: { usuarioId, pilar },
      },
      update: {
        nivelAtual: nivelAtual ?? 0,
        rotinaAtual: rotinaAtual ?? 0,
        concluido: Boolean(concluido),
      },
      create: {
        usuarioId,
        pilar,
        nivelAtual: nivelAtual ?? 0,
        rotinaAtual: rotinaAtual ?? 0,
        concluido: Boolean(concluido),
      },
    });

    return NextResponse.json({ progresso });
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar progresso' }, { status: 500 });
  }
}