import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "Bem-vindo à API Minha Escala!",
    version: "1.0.0",})
})

export default router;