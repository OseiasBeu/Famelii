# Núcleo — Roadmap de produto

Documento operacional derivado do brief em [`prompt_inicial.md`](./prompt_inicial.md) e da versão resumida [`prompt_inicial.resumo.md`](./prompt_inicial.resumo.md). Ajustar datas e owners quando a equipa existir.

---

## 1. Objetivo global

| Dimensão | Meta |
|----------|------|
| **Produto** | Sistema operacional familiar: organização + afeto, para **toda a família** (gestor assistente da casa). |
| **MVP / Fase 1** | Validar **uso diário** e **retenção emocional** (check-in, comando, rotina partilhada). |
| **Receita** | Assinatura **Premium** sustentada por valor (Stripe), com free generoso até 4 membros — ver `prompt_inicial.md` # 33. |

---

## 2. Visão por fases (resumo)

| Fase | Nome sugerido | Foco |
|------|----------------|------|
| **1** | Fundação + hábito diário | Núcleo emocional e rotina mínima viável, confiança (RGPD, permissões), i18n, push, pagamentos. |
| **2** | Profundidade + casa | Trilhas, missões avançadas, finanças/cofre, integrações, PWA, doméstico (compras, ementa). |
| **3** | Vida física e mobilidade | Saúde, localização opcional, transporte. |
| **4** | Inteligência e identidade | IA familiar (com ética), memórias, multi-família. |

> **Nota:** duração em meses não está fixada no brief; recomenda-se **só fechar datas** após validação da Fase 1 (métricas abaixo).

---

## 3. Fase 1 — Fundação e retenção diária

**Critério de sucesso sugerido:** ativação D1/D7, check-ins por semana, **≥ 2 membros ativos** por núcleo, baixo churn nas primeiras 8 semanas.

### 3.1 Produto core (experiência familiar)

| Entrega | Notas / referência no brief |
|---------|-----------------------------|
| Permissões base | Papéis tutor / filho / adolescente; visibilidade por módulo; **RLS** alinhado à UI — `prompt_inicial.md` **# 36** |
| Check-in emocional | Com opções de privacidade — **# 10** |
| Centro de comando | Humor, agenda, tarefas, alertas, resumo diário — **# 9** |
| Corações (módulo) | **# 12** |
| Calendário familiar | **Interno ao Núcleo** nesta fase — **# 18** |
| Missões básicas | Inclui responsáveis e vistas simples — **# 13–14** |
| **Finanças MVP** | Registo manual, categorias, orçamento semanal, mesada — **só tutores** — **# 20**, **# 36** |

### 3.2 Plataforma, inclusão e confiança

| Entrega | Notas |
|---------|--------|
| Internacionalização base | pt-BR / pt-PT; locale data, número, moeda — **# 38** |
| Acessibilidade baseline | Alvo WCAG 2.2 AA em fluxos críticos — **# 38** |
| Notificações push | Política por papel, horas silenciosas — **# 41** |
| Export de dados + eliminação de conta | RGPD, página de confiança — **# 40** |

### 3.3 Monetização e stack mínima

| Entrega | Notas |
|---------|--------|
| Stripe + portal de faturação | Premium conforme **# 33**; stack **# 30** |
| Auth, Realtime, Storage | Supabase conforme brief |

**Dependências críticas:** políticas RLS antes de dados reais de famílias; fluxos de convite e menor com consentimento de tutor (**# 36**).

---

## 4. Fase 2 — Profundidade, integrações e “casa”

**Critério de sucesso sugerido:** retenção a 90 dias, uso de **trilhas** e/ou **calendário sync**, conversão free → premium em gatilhos naturais (membros, trilhas, etc.).

### 4.1 Produto e rotina avançada

| Entrega | Notas |
|---------|--------|
| Trilhas | Hábitos e metas — **# 15–16** |
| Missões avançadas | Paridade **Bloco A** (estilo Todoist): NL, recorrência, filtros, projetos/secções, lembretes, anexos — **# 13** (tabela paridade), **# 14** |
| Financeiro expandido + Cofre | OCR, importação bancária, etc. — **# 20** evolução, **# 21** |
| “Só adultos” em anexos, comentários, notas | **# 42**, **# 36** (tabela) |

### 4.2 Integrações e plataforma móvel

| Entrega | Notas |
|---------|--------|
| **App Expo** (iOS + Android + RN Web) | Monorepo — ver [`ARQUITETURA_PLATAFORMAS.md`](./ARQUITETURA_PLATAFORMAS.md); `packages/core` partilhado |
| Sincronização calendário externo | Google Calendar; Apple/CalDAV quando viável — **# 37** |
| PWA + leitura offline | Agenda e missões — **# 39** |
| Widgets / atalhos | Check-in rápido; missões do dia — **# 39** |

### 4.3 Funcionalidades domésticas de alto uso

| Entrega | Notas |
|---------|--------|
| Lista de compras partilhada | Realtime; permissões — **# 42** |
| Ementa / refeições da semana | Planeamento leve — **# 42** |
| Perfil de emergência (opcional) | Alergias, SOS, aprovação por tutores — **# 42** |

---

## 5. Fase 3 — Saúde, localização e deslocações

| Entrega | Notas |
|---------|--------|
| Saúde | Vacinas, medicamentos, alergias, consultas — **# 22** |
| Localização | Opcional, nunca obrigatória — **# 23** |
| Transporte | A definir em detalhe de produto quando a Fase 3 for priorizada |

**Risco / compliance:** dados de saúde e localização exigem base legal e UX de consentimento reforçado (RGPD + confiança parental).

---

## 6. Fase 4 — IA, memórias e multi-família

| Entrega | Notas |
|---------|--------|
| IA familiar | Insights e correlações; **ética e consentimento** obrigatórios — **# 24**, **# 43** |
| Memórias | Timeline emocional, fotos/vídeos — **# 26** |
| Multi-família | Mesmo utilizador, vários núcleos; permissões por `family_id` — **# 25**, **# 36** |

---

## 7. Métricas sugeridas (por fase)

| Métrica | Fase 1 | Fases seguintes |
|---------|--------|-----------------|
| Ativação D1 / D7 | ✓ foco | manter |
| Check-ins / utilizador / semana | ✓ foco | correlacionar com retenção |
| Membros ativos por núcleo | ✓ foco | ✓ |
| Trial → Premium / conversão | após Stripe estável | ✓ |
| Churn mensal | monitorizar desde cedo | ✓ |
| Uso de sync calendário | — | ✓ Fase 2 |
| Uso offline / PWA | — | ✓ Fase 2 |

*(Alinhado à estratégia de funil em `prompt_inicial.md` **# 34**.)*

---

## 8. Itens transversais (todo o roadmap)

- **Segurança:** RLS, revisão de API, política de menores — **# 30**, **# 36**, **# 40**.
- **Observabilidade:** Sentry, logs — **# 30**.
- **Feature flags:** lançamentos graduais — **# 30**.
- **Design system:** Warm Tech, motion moderado — **# 27–29**.

---

## 9. Alterações a este ficheiro

1. Manter **uma única fonte de verdade** para *o quê* construir: atualizar primeiro `prompt_inicial.md` **# 32** se o âmbito mudar.
2. Usar este `ROADMAP.md` para **planeamento temporal**, owners, datas e dependências de equipa.
3. Registar decisões de *descope* numa secção “Decidido / Adiado” abaixo (template).

### Decidido / Adiado (template)

| Data | Decisão | Motivo |
|------|---------|--------|
| _YYYY-MM-DD_ | _…_ | _…_ |

---

*Última sincronização com o brief: estrutura equivalente a `prompt_inicial.md` secção # 32.*
