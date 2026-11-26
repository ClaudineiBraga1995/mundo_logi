import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Gera um hash seguro da senha usando bcryptjs
 */
export async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, SALT_ROUNDS);
}

/**
 * Compara a senha digitada com o hash salvo no banco.
 * Mantém um fallback simples caso exista algum registro antigo sem hash no banco.
 */
export async function verificarSenha(
  senhaDigitada: string,
  senhaArmazenada: string
): Promise<boolean> {
  if (!senhaArmazenada) return false;

  // Hashes bcrypt costumam começar com $2a$, $2b$ ou $2y$
  const pareceHashBcrypt = /^\$2[aby]\$\d{2}\$/.test(senhaArmazenada);
  if (pareceHashBcrypt) {
    return bcrypt.compare(senhaDigitada, senhaArmazenada);
  }

  return senhaDigitada === senhaArmazenada;
}