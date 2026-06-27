# Núcleo — web

## Comandos

```bash
npm install
npm run dev
```

**Windows / PowerShell:** se `npm` falhar com *execution of scripts is disabled*, usa `npm.cmd run dev` (ou o terminal **cmd**).

- Marketing: [http://localhost:3000](http://localhost:3000)
- App (Fase 1): [http://localhost:3000/app](http://localhost:3000/app)

## Supabase

1. Copia `.env.example` → `.env.local`.
2. Preenche `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. O **check-in** continua a funcionar em `localStorage` até existirem tabelas e auth; depois ligamos persistência e resumo familiar.

## Estrutura relevante

| Caminho | Função |
|---------|--------|
| `src/app/app/` | Shell da app (`/app`, `/app/check-in`, …) |
| `src/components/emotional-check-in-form.tsx` | Check-in emocional |
| `src/lib/supabase/` | Cliente browser + servidor (`@supabase/ssr`) |
| `src/lib/checkin-storage.ts` | Persistência local do check-in |
