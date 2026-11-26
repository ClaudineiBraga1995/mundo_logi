import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verificarSenha } from '@/lib/senha';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    // Busca o usuário no banco de dados pelo e-mail
    const usuario = await prisma.usuario.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Verifica se o usuário existe e se a senha bate com o hash (ou texto antigo)
    const senhaValida = usuario ? await verificarSenha(senha, usuario.senha) : false;

    if (!usuario || !senhaValida) {
      return NextResponse.json(
        { error: 'E-mail ou senha incorretos.' },
        { status: 401 }
      );
    }

    // Sucesso no login
    return NextResponse.json({
      message: 'Login realizado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('Erro no Login:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor ao tentar realizar login.' },
      { status: 500 }
    );
  }
}