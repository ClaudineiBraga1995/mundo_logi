import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashSenha } from '@/lib/senha';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, senha, dataNascimento } = body;

    if (!dataNascimento) {
      return NextResponse.json(
        { error: 'A data de nascimento é obrigatória.' },
        { status: 400 }
      );
    }

    const dataFormatada = new Date(dataNascimento);
    const agora = new Date();

    // Data limite de 100 anos atrás
    const cemAnosAtras = new Date();
    cemAnosAtras.setFullYear(cemAnosAtras.getFullYear() - 100);

    // Validações de data
    if (isNaN(dataFormatada.getTime())) {
      return NextResponse.json(
        { error: 'Data de nascimento inválida.' },
        { status: 400 }
      );
    }

    if (dataFormatada > agora) {
      return NextResponse.json(
        { error: 'Data de nascimento não pode ser no futuro.' },
        { status: 400 }
      );
    }

    if (dataFormatada < cemAnosAtras) {
      return NextResponse.json(
        { error: 'Data de nascimento excede o limite permitido (100 anos).' },
        { status: 400 }
      );
    }

    // Gera o hash da senha antes de salvar no banco
    const senhaHash = await hashSenha(senha);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senhaHash,
        dataNasc: dataFormatada,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        dataNasc: true,
        criadoEm: true,
      },
    });

    return NextResponse.json(novoUsuario, { status: 201 });
  } catch (error: unknown) {
    console.error('Erro no Prisma:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Este e-mail já está em uso.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno ao criar usuário' },
      { status: 500 }
    );
  }
}