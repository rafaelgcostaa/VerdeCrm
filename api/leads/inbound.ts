import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Retorna 410 Gone para indicar que este recurso não está mais disponível.
  // A arquitetura mudou para inserção direta no Supabase via n8n.
  return res.status(410).json({
    error: "Gone",
    message: "This endpoint is deprecated. Leads should be inserted directly into Supabase via n8n."
  });
}