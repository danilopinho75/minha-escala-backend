import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Bem-vindo à API Minha Escala!",
    version: "1.0.0",})
})

export default router;