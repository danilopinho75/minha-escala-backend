import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./error";

export interface TokenPayload {
  id: number
  email: string
  role: string
  igrejaId: string | null
}

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload
    }
  }
}

const jwtSecret = process.env.JWT_SECRET;

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token não informado', 401)
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, jwtSecret!) as TokenPayload;
    req.usuario = payload;
    next();
  } catch {
    throw new AppError('Token Inválido ou expirado', 401)
  }
}

export function autorizar(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.usuario || !roles.includes(req.usuario.role)) {
      throw new AppError('Acesso não autorizado', 403)
    }

    next()
  }
}
