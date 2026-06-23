# Núcleo

**Organização com afeto.** — Monorepo: **Web** (Next.js) + **Mobile** (Expo) + lógica partilhada.

| Pasta | Pacote | Plataforma |
|-------|--------|------------|
| `web/` | `@nucleo/web` | Browser (marketing + `/app`) |
| `apps/mobile/` | `@nucleo/mobile` | iOS, Android, Web (Expo) |
| `packages/core/` | `@nucleo/core` | Tipos, check-in, env Supabase |

Brief: [`prompt_inicial.md`](./prompt_inicial.md) · Roadmap: [`ROADMAP.md`](./ROADMAP.md) · Arquitetura: [`ARQUITETURA_PLATAFORMAS.md`](./ARQUITETURA_PLATAFORMAS.md)

## Instalação (raiz)

```powershell
npm.cmd install
```

## Web

```powershell
npm.cmd run dev:web
```

Abre [http://localhost:3000](http://localhost:3000) e `/app`.

Variáveis: `web/.env.local` (ver `web/.env.example`).

## Mobile (Expo)

```powershell
npm.cmd run dev:mobile
```

Depois: tecla `a` (Android), `w` (web), ou app **Expo Go** no telemóvel.

Variáveis: `apps/mobile/.env` com `EXPO_PUBLIC_SUPABASE_*` (ver `.env.example`).

## PowerShell

Se `npm` falhar por *Execution Policy*, usa `npm.cmd` (ver nota no README antigo em `web/README.md`).

## Próximos passos

1. Supabase: migrações + Auth + RLS  
2. Finanças MVP (web + mobile, só tutores)  
3. Mover `web/` → `apps/web` quando não houver servidor dev a bloquear a pasta
