import { Request, Response, NextFunction } from 'express'

// Classe de erro customizada para erros esperados da aplicação
export class AppError {
  public readonly mensagem: string
  public readonly status: number

  constructor(mensagem: string, status: number = 400) {
    this.mensagem = mensagem
    this.status = status
  }
}

// Middleware global de erros — captura qualquer erro jogado nas rotas
export function handlerErros(
  erro: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Erro esperado da aplicação (ex: "Membro não encontrado")
  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.mensagem })
  }

  // Erro inesperado — loga e retorna 500
  console.error('❌ Erro interno:', erro)
  return res.status(500).json({ erro: 'Erro interno do servidor' })
}
