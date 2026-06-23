# Núcleo — Arquitetura multiplataforma (Web + iOS + Android)

## Situação atual

| O quê | Estado |
|-------|--------|
| **`web/`** | Next.js 16 — **browser** (`@nucleo/web`). |
| **`apps/mobile/`** | Expo 56 — **iOS, Android e Web** (`@nucleo/mobile`). |
| **`packages/core/`** | Lógica partilhada (`@nucleo/core`). |

O Next.js **não** “converte” automaticamente para apps nativas. PWA cobre instalação na web, mas não substitui App Store / Play Store nem APIs nativas (push fiável, widgets, etc.).

---

## Recomendação: monorepo com **Expo (React Native)**

Mesma linguagem do brief (**TypeScript + React**), um código de produto para **iOS, Android e Web**, com backend único (**Supabase**).

```
myFamily/
├── web/              # @nucleo/web — Next.js (por agora na raiz; futuro apps/web)
├── apps/
│   └── mobile/       # @nucleo/mobile — Expo (iOS + Android + RN Web)
├── packages/
│   └── core/         # @nucleo/core — tipos, check-in, env
└── supabase/         # (a criar) migrações, RLS
```

### Porquê Expo (e não só “embrulhar” o site)

| Abordagem | Web | iOS/Android | Notas |
|-----------|-----|-------------|--------|
| **Só Next.js + PWA** | ✓ | △ limitado | Sem lojas nativas; push/offline fracos. |
| **Next + Capacitor** (webview) | ✓ | ✓ wrapper | Rápido, mas UX menos nativa; performance média. |
| **Expo + React Native Web** | ✓ | ✓ nativo | **Recomendado** — uma equipa, UI adaptada por plataforma. |
| **Flutter** | ✓ | ✓ | Excelente, mas **outra stack** (Dart); pouco reaproveitamento do `web/` atual. |

### O que partilhar entre plataformas

- Tipos (`EmotionalCheckIn`, `Task`, `Transaction`, papéis §36)
- Cliente Supabase e chamadas API
- Regras de permissão e privacidade
- Formatação de datas/moeda (pt-PT / pt-BR, §38)

### O que fica por plataforma

- **Next (`web/`)**: páginas de marketing, blog, SEO, eventual painel admin web
- **Expo (`mobile/`)**: navegação nativa, gestos, push (FCM/APNs), widgets, câmara (futuro OCR finanças)
- **UI**: Tailwind + shadcn no Next; **NativeWind** ou componentes RN no Expo (visual “Warm Tech” alinhado, não pixel-perfect igual)

---

## Migração sugerida (sem reescrever tudo de uma vez)

1. **Agora** — Continuar protótipo em `web/` para validar fluxos (check-in, centro, finanças MVP).
2. **Em paralelo** — Criar `apps/mobile` com Expo Router; extrair `packages/core` com tipos e Supabase.
3. **Novas features** — Implementar primeiro em `core` + Expo; Next consome `core` ou espelha só o necessário.
4. **Finanças MVP** — Tabelas `transactions`, `budgets`, `allowances`; RLS **só tutores**; mesma API para web e mobile.

---

## Stack resumida (alvo)

| Camada | Tecnologia |
|--------|------------|
| App móvel + web app | **Expo SDK** + **Expo Router** + TypeScript |
| Site / marketing | **Next.js** (Vercel) — opcional |
| Backend | **Supabase** (Auth, Postgres, RLS, Realtime, Storage) |
| Pagamentos | **Stripe** |
| Estilo mobile | NativeWind ou Tamagui (decidir na criação do `mobile/`) |

---

## Próximo passo técnico

Se concordares com esta direção, o passo seguinte é **scaffold `apps/mobile` (Expo)** + **`packages/core`** e mover tipos do check-in para o pacote partilhado — sem apagar o `web/` atual.
