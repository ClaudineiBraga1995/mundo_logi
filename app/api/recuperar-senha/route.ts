import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ajuste se o seu export for default (ex: import prisma from '@/lib/prisma')
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, novaSenha } = body;

    if (!email || !novaSenha) {
      return NextResponse.json(
        { error: 'Preencha o e-mail e a nova senha.' },
        { status: 400 }
      );
    }

    if (novaSenha.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter pelo menos 6 caracteres.' },
        { status: 400 }
      );
    }

    // 1. Valida se o e-mail existe no banco de dados
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { error: 'E-mail não encontrado. Verifique e tente novamente.' },
        { status: 404 }
      );
    }

    // 2. Criptografa e salva a nova senha (use o mesmo método do seu cadastro/login)
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await prisma.usuario.update({
      where: { id: usuarioExistente.id },
      data: { senha: senhaHash },
    });

    return NextResponse.json(
      { message: 'Senha alterada com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor ao tentar alterar a senha.' },
      { status: 500 }
    );
  }
}