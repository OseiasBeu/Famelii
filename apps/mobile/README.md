# Núcleo — Mobile (Expo)

App **iOS**, **Android** e **Web** via [Expo Router](https://docs.expo.dev/router/introduction/).

## Comandos (na raiz do monorepo)

```powershell
npm.cmd run dev:mobile
```

Ou, nesta pasta:

```powershell
npm.cmd start
npm.cmd run android
npm.cmd run web
```

## `@nucleo/core`

Tipos e check-in vêm de `packages/core`. O armazenamento local usa **AsyncStorage** (`lib/setup-storage.ts`).

## Variáveis

Copia `.env.example` → `.env` com `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

## Tabs

| Tab | Rota |
|-----|------|
| Centro | `(tabs)/index` |
| Check-in | `(tabs)/check-in` |
| Missões | `(tabs)/missoes` |
| Finanças | `(tabs)/financas` |
