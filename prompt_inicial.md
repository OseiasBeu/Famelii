# NÚCLEO

## O Sistema Operacional da Família Moderna

**Tagline:**
*"Organização com afeto."*

Alternativas:

* O coração da rotina familiar.
* Onde a rotina encontra o afeto.
* A casa digital da sua família.
* Mais conexão. Menos caos.

---

> **Dois níveis de brief**
> * **[`prompt_inicial.resumo.md`](./prompt_inicial.resumo.md)** — versão **resumida** (produto, stack base, roadmap macro, visão), útil para partilhar com parceiros ou alinhar depressa.
> * **Este ficheiro** — especificação **completa**: estratégia de mercado, permissões (papéis + RLS), paridade Todoist nas Missões, integrações de calendário, i18n, acessibilidade, PWA, conta e RGPD, notificações, funcionalidades domésticas, princípios de IA, etc. (secções numeradas a partir de **# 34. ESTRATÉGIA DE MERCADO** e seguintes).

---

# 1. VISÃO

O Núcleo é uma plataforma digital criada para ajudar famílias a se organizarem, se comunicarem e se conectarem emocionalmente.

Mais do que um aplicativo de produtividade, o Núcleo funciona como um sistema operacional familiar que integra organização doméstica, desenvolvimento pessoal, bem-estar emocional e coordenação da rotina em um único ambiente.

O objetivo não é apenas aumentar a produtividade da família.

O objetivo é fortalecer relacionamentos.

---

# 2. PROPÓSITO

Ajudar famílias a viverem com mais:

* conexão
* clareza
* presença
* responsabilidade
* gratidão
* afeto

Através da tecnologia.

---

# 3. FILOSOFIA DO PRODUTO

O Núcleo nasce sobre cinco princípios:

## 1. Organização reduz estresse

Quando todos sabem o que precisa ser feito, a família vive melhor.

## 2. Emoções importam

Uma casa organizada emocionalmente vale mais do que uma agenda perfeita.

## 3. Desenvolvimento é coletivo

Pais e filhos crescem juntos.

## 4. Afeto deve ser intencional

O amor existe.
Mas precisa ser praticado diariamente.

## 5. Tecnologia deve aproximar

Nunca substituir relacionamentos.

---

# 4. PROBLEMA

Atualmente as famílias utilizam diversas ferramentas isoladas:

* WhatsApp
* Google Calendar
* Aplicativos bancários
* Notion
* Todoist
* Planilhas
* Aplicativos de hábitos

O resultado é:

* desorganização
* excesso de comunicação dispersa
* sobrecarga mental dos pais
* conflitos domésticos
* falta de acompanhamento emocional
* ausência de visão integrada da família

---

# 5. PROPOSTA DE VALOR

O Núcleo é a única plataforma que une:

* organização familiar
* produtividade doméstica
* inteligência emocional
* hábitos
* afeto
* desenvolvimento humano

em um único ecossistema.

---

# 6. PÚBLICO-ALVO

## Inicial

Famílias com filhos entre 4 e 18 anos.

Principalmente:

* pais ocupados
* famílias cristãs
* famílias homeschool
* famílias que valorizam desenvolvimento pessoal
* famílias que desejam reduzir conflitos domésticos

---

# 7. DIFERENCIAL CENTRAL

O Núcleo não é um aplicativo de tarefas.

É uma infraestrutura emocional da casa moderna.

---

# 8. MVP

Objetivo:

Validar uso diário e retenção emocional.

---

# 9. CENTRO DE COMANDO FAMILIAR

Tela principal da plataforma.

Ela concentra:

* humor da família
* agenda
* tarefas
* hábitos
* mensagens
* alertas
* resumo diário

---

# 10. CHECK-IN EMOCIONAL

## Funcionalidade principal

Ao abrir o aplicativo pela primeira vez no dia:

Pergunta:

> Como você está se sentindo hoje?

---

## Opções

😄 Feliz

🙂 Bem

😐 Neutro

😞 Triste

😤 Irritado

🙈 Prefiro não dizer

---

## Recursos

* observação opcional
* histórico emocional
* streaks
* estatísticas
* gráficos

---

## Privacidade

O usuário pode escolher:

* compartilhar tudo
* compartilhar apenas emoji
* compartilhar apenas com os pais
* ocultar detalhes

---

# 11. RESUMO EMOCIONAL FAMILIAR

Exemplo:

> Família hoje:
>
> 2 felizes
> 1 neutro
> 1 preocupado

Sem exposição excessiva.

Sem constrangimento.

---

# 12. MÓDULO CORAÇÃO

Camada afetiva do produto.

Permite:

* enviar corações
* agradecer
* incentivar
* reconhecer atitudes

---

## Exemplos

❤️ Obrigado por ajudar hoje.

❤️ Boa prova!

❤️ Você foi incrível.

---

## Recursos

* histórico pessoal
* gratidão semanal
* boa noite coletiva
* mural de carinho

---

# 13. MISSÕES

Sistema avançado de tarefas.

Inspirado em:

* Todoist
* TickTick
* Notion

Adaptado para famílias.

---

## Funcionalidades

* tarefas
* recorrência
* responsáveis
* prioridades
* comentários
* anexos
* lembretes

---

## Linguagem Natural

Exemplo:

Comprar pão todo sábado às 9h #compras @pais p1

---

## Extração automática

* tarefa
* horário
* recorrência
* categoria
* prioridade
* responsáveis

---

## Paridade com Todoist (referência de produto)

Objetivo declarado: **aproximar ao máximo** das capacidades do [Todoist](https://www.todoist.com/) dentro das **Missões** e vistas associadas, **sem** o Núcleo deixar de ser app **familiar** (papéis, privacidade, afeto, calendário da casa). O Todoist evoluiu durante anos — a implementação deve ser **por fases**, com critérios de aceitação claros.

### Bloco A — Núcleo tipo Todoist (prioridade alta)

| Capacidade (estilo Todoist) | No Núcleo |
|-----------------------------|-----------|
| Inbox / captura rápida | Caixa de entrada de missões (por utilizador ou por família, a definir na UX). |
| Hoje / Em breve | Já previsto em **Visões** (# 14); alinhar nomes e filtros de data. |
| Tarefa + conclusão + sub-tarefas | Missões hierárquicas (pai/filho) ou checklist dentro da missão. |
| Recorrência rica | Regras simples no MVP; regras complexas (ex.: “última sexta do mês”) em fase seguinte. |
| Prioridades | Já previsto; mapear para p1–p4 ou equivalente. |
| Lembretes (hora) | Já previsto; push (# 41). |
| Comentários e anexos | Já previsto; **“só adultos”** em anexos/comentários (# 42, # 36). |
| Projetos / listas agrupadas | **Projetos** da família (# 31 `projects`) + secções dentro do projeto (como listas do Todoist). |
| Etiquetas / filtros | Etiquetas (NL ou UI) + **filtros guardados** (queries: por membro, etiqueta, prazo, prioridade). |
| Linguagem natural na criação | Já previsto (# 13); evoluir parser e casos limite. |
| Vista calendário de tarefas | Cruzar **Missões com prazo** com **Calendário** (# 18) (uma vista ou integração visual). |
| Partilha e responsáveis | Por **membro do núcleo** e permissões (# 36), não “equipa empresa”. |

### Bloco B — Produto maduro (médio prazo)

* **Modelos / templates** de listas (ex.: “semana escolar”, “viagem”, “compras”) — alinhado a [templates Todoist](https://www.todoist.com/) mas com conteúdo **familiar**.
* **Integrações** selecionadas (não “300+” de início): e-mail-para-missão, calendário (# 37), automações pontuais.
* **Board / Kanban** por projeto (opcional), se a família preferir arrastar cartões.
* **Assistência / IA** na criação ou desdobramento de tarefas — alinhar **ética** (# 43); não obrigar.

### Bloco C — Deliberadamente diferente do Todoist

* **Karma / ranking social** tipo produtividade individual agressiva: **não** replicar; usar **gamificação positiva** (# 17) e corações/check-in.
* **Workspace “empresa”** separado: no Núcleo o equivalente é **multi-família** (# 25), não B2B genérico.
* **Filosofia:** menos “output profissional”, mais **clareza em casa** e **menos conflito** (estratégia # 34).

### Critério de “paridade suficiente”

Considerar Missões **“nível Todoist”** para a família quando: NL + recorrência + filtros + projetos/secções + lembretes + comentários/anexos + vista agenda + partilha com papéis estiverem **estáveis** em produção (mesmo que algumas regras de recorrência ainda cresçam depois).

---

# 14. VISÕES DAS MISSÕES

## Meu Dia

Tarefas do usuário.

## Família Hoje

Visão geral da casa.

## Urgentes

Prioridade máxima.

## Sem Responsável

Itens esquecidos.

## Por Membro

Visão individual.

---

# 15. TRILHAS

Sistema de hábitos e metas.

---

## Exemplos

### Leitura

10 livros no semestre.

### Hidratação

8 copos por dia.

### Sono

8 horas por noite.

### Exercícios

30 minutos diários.

### Estudo

Matemática e revisão.

### Bem-estar

Meditação e gratidão.

---

# 16. ELEMENTOS DAS TRILHAS

* progresso
* streaks
* badges
* recompensas
* diário de conquistas

---

# 17. GAMIFICAÇÃO

Gamificação positiva.

---

## Incentivar

* constância
* responsabilidade
* colaboração
* crescimento

---

## Nunca usar

* punições
* humilhação
* bloqueios
* exposição negativa

---

# 18. CALENDÁRIO FAMILIAR

Calendário compartilhado.

---

## Recursos

* escola
* saúde
* trabalho
* lazer
* eventos
* integração com calendários externos (sincronização — ver secção 37)

---

## Alertas

Conflitos de agenda.

---

## Exemplo

Consulta da Luísa conflita com reunião do Pedro.

---

# 19. LINHA DO TEMPO DA CASA

Substituir parte da dependência do WhatsApp.

---

## Exemplos

Mamãe saiu do trabalho.

Pedro chegou da escola.

Cachorro alimentado.

Compras concluídas.

---

# 20. FINANÇAS

## MVP

* registro manual
* categorias
* orçamento semanal
* mesada digital

---

## Evolução

* OCR
* importação bancária
* OFX
* PDF
* CSV
* comprovantes

---

# 21. COFRE FAMILIAR

Fase futura.

---

## Guardar

* documentos
* contratos
* seguros
* certidões
* apólices

---

## Alertas

Vencimentos e renovações.

---

# 22. SAÚDE

Fase futura.

---

## Recursos

* vacinas
* medicamentos
* alergias
* consultas

---

# 23. LOCALIZAÇÃO

Opcional.

Nunca obrigatória.

---

## Recursos

* compartilhamento temporário
* geofence
* chegada e saída

---

# 24. IA FAMILIAR

Fase avançada.

**Ética, dados e transparência:** ver secção **43** (complemento técnico e de conformidade).

---

## Exemplos

João está triste há 3 dias.

Você tem voo amanhã.

Gastos com delivery aumentaram 25%.

---

## Correlações

Humor × hábitos.

Humor × sono.

Humor × exercícios.

---

# 25. MULTI-FAMÍLIA

Uma pessoa pode participar de vários núcleos.

Exemplos:

* pais idosos
* família principal
* filhos de casamento anterior

---

# 26. MEMÓRIAS

Timeline emocional.

---

## Armazenar

* fotos
* vídeos
* mensagens
* momentos especiais

---

# 27. DESIGN

Conceito:

Warm Tech.

---

## Inspiração

* simplicidade
* acolhimento
* modernidade
* lar digital

---

## Não parecer

* ERP
* banco
* sistema corporativo

---

# 28. SISTEMA DE TEMAS

Cada família possui identidade própria.

---

## Temas

Casa Serena

Natureza

Futuro

Manhã Feliz

---

## Personalização

* cores
* ícones
* clima visual
* animações

---

# 29. MOTION DESIGN

Framer Motion.

---

## Usar

* microinterações
* transições suaves
* feedback emocional

---

## Evitar

* excesso
* distrações

---

# 30. STACK

Frontend:

* Next.js
* React
* TypeScript
* Tailwind
* shadcn/ui
* Framer Motion
* **PWA** (instalável) e leitura **offline** onde fizer sentido — ver secção 39

Backend:

* Supabase
* PostgreSQL
* **Row Level Security (RLS)** em todas as tabelas com dados familiares — políticas alinhadas à secção 36 (regras no servidor, não só na UI)
* Auth
* Storage
* Realtime

Pagamentos e negócio:

* **Stripe** (ou equivalente maduro): assinaturas Premium, checkout, **portal de faturação** (self-service), webhooks para estado da subscrição

Mensagens, qualidade e entrega:

* **Email transacional** (ex.: Resend, Postmark): convites, verificação de conta, resets, alertas críticos da família
* **Push mobile:** FCM (Android) e APNs (iOS), ou fornecedor unificado (avaliar custo, privacidade e sub-processadores em relação ao RGPD)
* **Observabilidade:** Sentry (ou similar) para erros; logs estruturados para diagnóstico e incidentes
* **Feature flags** (ex.: PostHog, LaunchDarkly ou alternativa open source): lançamentos graduais, betas por núcleo, rollback rápido de funcionalidade

Deploy:

* Vercel (site / marketing Next.js, se mantido)

---

## Plataformas (Web + iOS + Android)

**Direção recomendada:** monorepo com **Expo (React Native)** para a **app de produto** em iOS, Android e Web (React Native Web), e **Next.js** opcional para marketing/SEO — ver [`ARQUITETURA_PLATAFORMAS.md`](./ARQUITETURA_PLATAFORMAS.md).

* **Não** depender só de PWA para “app nativa”; lojas e push/widgets passam por Expo ou equivalente.
* Lógica partilhada (`packages/core`): tipos, Supabase, regras de permissões, finanças, missões.
* UI por plataforma: shadcn/Tailwind (web) + NativeWind ou componentes RN (mobile).

---

# 31. BANCO DE DADOS

Entidades principais:

* users
* families
* family_members
* family_member_roles (papel por núcleo: tutor, filho, adolescente, convidado — ver secção 36)
* emotional_checkins
* hearts
* tasks
* task_comments
* projects
* habits
* habit_logs
* rewards
* notifications
* **transactions** (finanças — despesas/receitas manuais)
* **budgets** (orçamento semanal por categoria ou global)
* **allowances** (mesada digital por membro filho)
* calendar_connections (ligação OAuth / tokens a calendários externos — ver secção 37)
* shopping_lists + shopping_list_items (lista de compras partilhada — ver secção 42)
* meal_plans (ementa / refeições da semana — ver secção 42)
* household_emergency_profile (dados de emergência opcionais por núcleo ou por membro — ver secção 42)

---

# 32. ROADMAP

## Fase 1

* Permissões base (papéis tutor / filho / adolescente; visibilidade por módulo)
* Check-in emocional
* Centro de comando
* Corações
* Calendário (interno ao Núcleo)
* Missões básicas
* **Finanças MVP** (registo manual, categorias, orçamento semanal, mesada — **só tutores**, §20)
* **Internacionalização base** (pt-BR / pt-PT, locale de data, número, moeda — ver secção 38)
* **Acessibilidade baseline** (alvo WCAG 2.2 AA em fluxos críticos — ver secção 38)
* **Notificações push** com política por papel e horas silenciosas (ver secção 41)
* **Stripe** + portal de faturação para Premium (ver secção 30)
* **Export de dados** e **eliminação de conta** (RGPD — ver secção 40)

## Fase 2

* Trilhas
* Missões avançadas
* Financeiro expandido
* Cofre
* **Sincronização com calendários externos** (Google Calendar; Apple/CalDAV onde viável — ver secção 37)
* **Lista de compras partilhada** e **ementa / refeições da semana** (ver secção 42)
* **Widgets ou atalhos** para check-in e tarefas rápidas (ver secção 39)
* **PWA + leitura offline** de agenda e missões (ver secção 39)
* **Perfil de emergência** opcional (alergias, contactos — ver secção 42)
* **“Só adultos”** em anexos, comentários de missões e notas (ver secção 42 e 36)

## Fase 3

* Saúde
* Localização
* Transporte

## Fase 4

* IA Familiar (com **ética e consentimento** explícitos — ver secção 43)
* Memórias
* Multi-família

---

# 33. MODELO DE NEGÓCIO

## Gratuito

Até 4 membros.

* Check-ins
* Agenda
* Missões básicas
* Corações

---

## Premium

* membros ilimitados
* trilhas
* IA
* financeiro avançado
* OCR
* cofre
* multi-família

---

# 34. ESTRATÉGIA DE MERCADO

Objetivo: transformar proposta de valor e produto em **receita recorrente** (assinaturas), com aquisição sustentável e retenção forte — não depender apenas de lançamento ou pico de marketing.

---

## Posicionamento comercial

* **Promessa central do produto:** um **gestor assistente da família como um todo** — adultos e filhos no mesmo espaço: rotina, humor, tarefas, calendário e afeto. Não é “app para a mãe” nem “app só para os miúdos”; é **o quadro da casa** com camada emocional.
* Mensagem principal: **organização familiar com afeto** — menos “produtividade genérica”, mais **clareza em casa** e **menos conflito**.
* Diferencial explícito em vendas: **check-in emocional + privacidade + corações** como pilar de confiança (não como gimmick).
* Evitar comparar diretamente com ERP, banco ou ferramentas corporativas na comunicação pública.

---

## Praia inicial (beachhead)

**Produto ≠ praia de marketing:** o Núcleo continua desenhado para a **família inteira**. O *beachhead* não “fecha” o produto a um nicho — indica **onde começar a vender e a contar a história** com menos dispersão e mais repetição da mesma dor.

**Praia recomendada (12–18 meses):** famílias com **filhos entre 4 e 14 anos** (alargando até ~18 conforme o público-alvo do doc), em contexto **lusófono** (ex.: **Portugal** e **Brasil** em primeiro lugar), com **dois adultos a coordenar a casa** ou **um adulto muito sobrecarregado**. Dor explícita: **calendário + WhatsApp + listas e apps soltos**, sensação de **“ninguém vê o quadro todo”**, esquecimentos e **picos de conflito** na rotina.

**Porquê esta praia (alinhada ao “gestor da família”):**

* A promessa **“um sítio para a rotina e o humor da casa”** ressoa sem depender de escola formal vs. homeschool.
* O **Centro de comando**, **missões**, **calendário** e **check-in** respondem à mesma sobrecarga em famílias “típicas”.
* Há caminho natural para **convidar o outro adulto** e **incluir filhos** (com idade e permissões adequadas) — o produto ganha força com **mais de uma pessoa ativa**, não com um único utilizador.

**Narrativa principal (exemplos de ângulo, não slogans finais):**

* “A rotina da família, num só sítio — com espaço para o afeto.”
* “Menos grupos e folhas soltas. Mais **visão da semana** e **quem precisa de apoio hoje**.”

**Onboarding:** primeiro valor em **visão da semana para a família** + **check-in** + **uma missão ou evento** partilhado (linguagem neutra: escola, casa, saúde, lazer). Trilhas e módulos avançados entram quando fizer sentido na jornada, não no primeiro minuto.

**Homeschool, famílias cristãs e desenvolvimento pessoal** (já no público-alvo do doc): tratá-los como **canais e comunidades de early adopters** — parcerias, conteúdo segmentado, eventual landing dedicada — **sem** definir o produto publicamente como “app de homeschool” ou “app cristão”. A história principal mantém-se: **família como um todo**.

**Fase seguinte:** profundidade por **idade dos filhos** (ex.: adolescentes e autonomia), **multi-família** e **IA** no roadmap; o GTM pode então abrir **ângulos de campanha** mais específicos sem mudar a base do posicionamento.

---

## Canais de aquisição (prioridade)

1. **Comunidades e confiança** — grupos de **pais e famílias** (redes sociais, chats), associações e encontros locais; **homeschool** e outros nichos como **entradas fortes** onde haja adesão. Escolas como canal só onde fizer sentido legal e culturalmente.
2. **Conteúdo educativo** — blog, newsletter, vídeos: **organização da rotina familiar**, calendário partilhado, conflitos em casa, adolescentes; **homeschool** como **linha editorial** entre outras, não como único eixo (SEO e partilha).
3. **Programa de referência** — família convida família (crédito premium ou meses extra), porque o produto é **inherentemente social**.
4. **Parcerias** — marcas/comunidades com audiência familiar (co-marketing, bundles, eventos), sempre com alinhamento de valores.
5. **Paid ads** — apenas com **criativo e landing** testados; evitar escalar anúncios antes de **retenção** validada.

---

## Funil orientado à receita

* **Topo:** descoberta (conteúdo, comunidade, parceria, ads leves).
* **Meio:** teste do free (onboarding até **primeiro valor** em menos de 10 minutos: check-in + 1 missão + 1 evento ou coração).
* **Fundo:** conversão para Premium — gatilhos naturais: **mais de 4 membros**, **trilhas**, **financeiro avançado**, **multi-família**, **IA**, conforme roadmap.

Métricas a acompanhar (exemplos): ativação D1/D7, check-ins por semana, famílias com 2+ membros ativos, **trial → pago**, churn mensal, expansão de lugares (membros).

---

## Precificação e packaging (diretrizes)

* Preço Premium em **tier claro** (mensal vs anual com desconto) — anual favorece **receita previsível** e LTV.
* Free generoso o suficiente para **hábito diário**; Premium vende **profundidade** (mais pessoas, trilhas, dados, IA, cofre), não o básico emocional.
* Testar **oferta de lançamento** (vitalícia descontada ou lifetime limitada) só se houver estratégia clara de suporte e roadmap — evitar canibalizar assinatura sem necessidade.

---

## Retenção = motor de receita

* Centro de comando e check-in devem **puxar** abertura diária.
* Notificações: **úteis e respeitosas** (não spam) — alinhado à filosofia do produto.
* **Churn**: saída por “não encaixou na rotina” exige melhor onboarding e integrações (calendário externo) cedo na jornada.

---

## Conformidade e confiança como vantagem comercial

* RGPD, dados de menores, transparência e exportação: comunicar de forma **simples** na página de confiança — reduz fricção B2C e desbloqueia parcerias institucionais mais tarde. Detalhe operacional: secções **40** (export, apagar conta), **38** (I18N e acessibilidade como inclusão) e **43** (IA e dados).

---

## O que adiar na estratégia inicial

* Escalar vários segmentos com mensagens diferentes em paralelo.
* Feature parity com Notion/Todoist como promessa de marketing.
* B2B complexo (escolas como clientes pagadores) antes de PMF claro no B2C familiar.

---

# 35. VISÃO DE LONGO PRAZO

O Núcleo não pretende ser apenas mais um aplicativo.

A visão é se tornar o sistema operacional emocional da família moderna.

Um lugar onde:

* pais encontram clareza
* filhos desenvolvem responsabilidade
* adolescentes mantêm autonomia
* famílias fortalecem vínculos

Todos os dias.

Porque famílias fortes transformam comunidades.
E comunidades fortes transformam o mundo.

---

# 36. SISTEMA DE PERMISSÕES E PAPEIS

Objetivo: cada pessoa vê e edita **só o que faz sentido** para a idade e o papel na família — sem surpresas para crianças nem “buracos negros” para pais. O modelo é **RBAC por núcleo** (*role-based access control*): o mesmo utilizador pode ter papéis **diferentes** em núcleos diferentes (multi-família, fase futura).

---

## Princípios

* **Defesa em profundidade:** UI esconde o que não pode ver; **API e base de dados** recusam o que não pode aceder (nunca confiar só no cliente).
* **Clareza na app infantil/jovem:** se algo está oculto, mensagem simples (“só os teus pais veem isto”), sem culpa nem curiosidade punitiva.
* **Mínimo de papéis no MVP:** poucos papéis bem definidos; **papéis customizados** e convidados finos (ex.: cuidador) ficam para fases posteriores.

---

## Papéis sugeridos (MVP → evolução)

### Tutor / administrador familiar

* Tipicamente **pai e mãe** (ou tutores legais) definidos na criação do núcleo ou por convite com aprovação do outro tutor.
* **Podem:** gerir membros e convites, definir papéis dos filhos, ver módulos sensíveis (finanças, cofre, certos alertas), moderar onde fizer sentido (ex.: conteúdo reportado).
* **Auditoria leve (futuro):** registo de “quem convidou quem” e alterações de papel — útil para segurança e litígio.

### Filho (criança)

* **Vê:** centro de comando na medida da família, missões atribuídas a si, calendário **partilhado** (eventos marcados como visíveis para crianças), corações recebidos/enviados conforme regras da família, o **próprio** check-in e estatísticas pessoais.
* **Não vê (por defeito):** finanças detalhadas, cofre, notas privadas dos pais, eventos marcados **“só adultos”**, check-ins alheios quando estes estiverem em modo privado (alinhado à secção **Privacidade** do check-in).

### Adolescente

* Papel intermédio: **mais autonomia** que criança (missões próprias, trilhas, menos “painel de bebé”), mas **ainda sem** finanças/cofre sensíveis, salvo a família **ativar** exceções explícitas (opt-in documentado).
* Check-in dos pais continua a respeitar **partilha só emoji / só pais** escolhida pelo autor.

### Convidado (fase posterior)

* Ex.: avós, baby-sitter — **permissões muito limitadas** e temporais (ex.: só “hoje” ou só certas listas).

---

## Visibilidade por módulo (regra de bolso)

| Área | Criança | Adolescente | Tutor |
| --- | --- | --- | --- |
| Check-in (próprio) | Sim | Sim | Sim |
| Check-in (outrem) | Só o que o autor partilhar | Idem | Idem + resumo familiar conforme regras |
| Missões / agenda partilhada | Sim (escopo da família) | Sim | Sim |
| Eventos “só adultos” | Não | Não (por defeito) | Sim |
| Finanças / orçamento / cofre | Não | Não (por defeito) | Sim |
| Corações | Sim (participação afetiva) | Sim | Sim |
| Localização (futuro) | Opcional, nunca obrigatório | Idem | Quem partilha define com quem |
| Anexos em missões / comentários / notas marcados **“só adultos”** | Não | Não (por defeito) | Sim |
| Lista de compras / ementa (itens sensíveis, se existirem) | Configurável; por defeito visível ao núcleo | Idem | Sim |

*Campos concretos (ex.: valor em euros vs. “há orçamento para X”) podem ser refinados no desenho de ecrã — a regra de produto é: **dados sensíveis = tutores por defeito**.*

*Extensão da regra **“só adultos”** (além do calendário): qualquer **anexo**, **comentário** ou **nota** associado a missões ou projectos pode ser etiquetado como visível **apenas a tutores**, para evitar fugas de informação financeira, médica ou pessoal dos pais.*

---

## Convites e menores

* **Menor:** convite ou criação de conta com **consentimento do tutor** (fluxo explícito; idade mínima conforme lei do mercado alvo, ex. UE).
* **Não** permitir que criança eleve sozinha privilégios; alteração de papel **só por tutor**.

---

## Ligação ao check-in e ao resumo familiar

* As opções já previstas (**compartilhar tudo / só emoji / só com os pais / ocultar detalhes**) são a **camada emocional** do mesmo sistema: o resumo “Família hoje” no Centro de comando **agrega só o que cada membro autorizou**, para não expor nem constranger.

---

## Multi-família (fase futura)

* Permissões e papéis são sempre **por `family_id`**: o mesmo utilizador é “filho” num núcleo e “tutor” noutro, sem misturar dados.

---

# 37. INTEGRAÇÕES E SINCRONIZAÇÃO EXTERNA (CALENDÁRIO)

Objetivo: reduzir **dupla digitação** e aumentar retenção — a família já vive no Google Calendar, iCloud ou outro; o Núcleo deve **coexistir**, não exigir migração total no primeiro dia.

---

## Escopo por fases

* **Fase inicial (leitura / subscrição):** importar ou subscrever feed **ICS** de calendários públicos ou partilhados; mostrar eventos externos no **Calendário familiar** e no **Centro de comando**.
* **Fase de produto maduro:** **OAuth** e API **Google Calendar** (lista de eventos, criar/alterar eventos do Núcleo espelhados); **Apple / CalDAV** onde for tecnicamente e legalmente sustentável (complexidade de tokens e UX de permissões).
* **Conflitos de agenda** (já previstos no doc): cruzar eventos **internos** + **sincronizados** para alertas.

---

## Princípios

* **Permissões claras:** o utilizador escolhe **que calendários** ligar e se a sync é **só leitura** ou **bidirecional** (quando suportado).
* **Revogação:** desligar integração remove tokens; dados já importados tratados conforme política de **retenção** (ver secção 40).
* **Menores:** ligações de calendário configuradas preferencialmente por **tutor**; filhos veem só eventos dentro das regras de visibilidade (secção 36).

---

# 38. INTERNACIONALIZAÇÃO (I18N) E ACESSIBILIDADE

## I18N

* Mercado **lusófono** em primeiro lugar: **pt-BR** e **pt-PT** com copy, **formatos de data/hora**, **separadores numéricos** e **moeda** corretos por locale (Brasil vs Portugal).
* Arquitetura de strings e **pluralização** desde o MVP para não refatorizar tudo ao abrir outros idiomas (ex.: EN mais tarde).
* Nomes de papéis na UI (“tutor”, “pai/mãe”) podem ter **variantes regionais** sem mudar o modelo de dados.

## Acessibilidade e inclusão

* Alvo: **WCAG 2.2 nível AA** nos fluxos críticos (registo, convite, check-in, missões, calendário).
* **Contraste**, foco visível, navegação por teclado onde aplicável (web), **tamanhos dinâmicos** (respeitar preferências do sistema em mobile).
* Mensagens de erro e estados vazios **compreensíveis** (incluindo crianças e idosos na mesma família).

---

# 39. OFFLINE, PWA E WIDGETS / ATALHOS

## Offline e PWA

* **PWA instalável:** ícone na home, abertura rápida, sensação de “app da casa”.
* **Offline (prioridade leitura):** com cache e sync quando voltar a rede — ver **agenda** e **missões** atribuídas sem bloquear o dia a dia em túneis ou escolas com rede fraca.
* **Escrita offline:** fase posterior ou limitada (fila de sync com resolução de conflitos); documentar expectativa para o utilizador (“alterações vão sincronizar quando houver rede”).

## Widgets e atalhos

* **Widget** ou **atalho do sistema** (iOS/Android) para **check-in emocional** em 1 toque e, em fase seguinte, para **“as minhas missões de hoje”**.
* Respeitar **horas silenciosas** e preferências de notificação (secção 41).

---

# 40. CONTA, DADOS E PORTABILIDADE

## Exportação de dados

* **Export** legível (ex.: **JSON** + anexos empacotados onde aplicável) a pedido do tutor ou do titular da conta, alinhado a **RGPD** e confiança parental.
* Prazo e volume comunicados de forma simples na **página de confiança** (estratégia de mercado).

## Eliminação de conta e núcleo

* Fluxo claro de **apagar conta** ou **sair do núcleo** com efeitos explicados (o que fica anonimizado vs. apagado).
* **Retenção mínima** apenas onde a lei exigir (ex.: faturação).

## Recuperação e continuidade

* **Dois tutores** no núcleo reduzem risco de bloqueio se um perder o dispositivo; fluxos de **recuperação de conta** (email, segundo factor em fase posterior) documentados.
* **Handover:** transferência de “administrador principal” entre tutores (caso separação ou mudança de telemóvel).

---

# 41. NOTIFICAÇÕES PUSH (POLÍTICA DE PRODUTO)

## Princípios

* **Úteis, não ruidosas:** cada push deve ter valor claro (lembrete de missão, evento em 1h, coração recebido, conflito de agenda).
* **Respeito ao sono e à escola:** **horas silenciosas** configuráveis por núcleo ou por dispositivo; **digest** diário opcional em vez de dezenas de pings.

## Por papel

* **Tutor:** alertas de sistema, finanças/cofre (fases futuras), convites, conflitos de agenda.
* **Filho / adolescente:** missões atribuídas, eventos relevantes, corações; **sem** expor detalhes que o autor marcou como privados no check-in.

## Controlo

* Granularidade por **categoria** (agenda, missões, social, sistema) e **canal** (push, email, in-app apenas).

---

# 42. FUNCIONALIDADES DOMÉSTICAS E EMERGÊNCIA

Objetivo: reforçar o papel de **gestor assistente da família** com tarefas de **alto uso semanal**, além de missões genéricas.

---

## Lista de compras partilhada

* Lista única ou por loja; **marcar como comprado** em tempo real (Realtime); opcional ligar item a **missão** (“comprar pão”).
* **Permissões:** por defeito todo o núcleo participa; tutores podem restringir listas sensíveis (ex.: farmácia) se necessário.

## Ementa / refeições da semana

* Planeamento **leve** (não competir com apps de receitas no MVP): dias da semana + refeições + notas; opcional ligar a **lista de compras** (“ingredientes da terça”).
* Reduz decisões e conflitos (“o que há para jantar?”).

## Contactos e informação de emergência (opcional)

* **Cartão de emergência** por núcleo ou por filho: alergias, medicamento crítico, **números SOS**, contacto de outro tutor — visível conforme papel (filhos podem ver o **essencial** que os tutores aprovarem).
* **Nunca** substituir serviços de emergência oficiais; linguagem clara de limitação de responsabilidade.

## “Só adultos” estendido (síntese)

* Além do **calendário**, aplicar etiqueta **só tutores** a **anexos**, **comentários** e **notas** ligados a missões ou projectos — detalhe de regras na secção 36 (tabela).

---

# 43. IA FAMILIAR — PRINCÍPIOS TÉCNICOS E DE DADOS (COMPLEMENTO À SECÇÃO 24)

* **Consentimento explícito** antes de usar dados familiares em **modelos** ou **RAG** personalizado; opção de **desligar** funcionalidades de IA mantendo o resto do produto.
* **Menores:** sem uso de dados pessoais sensíveis para treino ou perfis comerciais **fora** do estritamente necessário ao serviço e à lei aplicável.
* **Transparência:** explicar **o que** a IA analisa (ex.: padrões de humor agregados vs. conteúdo bruto de conversas).
* **Retenção e minimização:** não guardar prompts e outputs indefinidamente sem política; preferir **processamento** com janelas claras.
* **Humano no controlo:** sugestões, não decisões automáticas irreversíveis sobre dinheiro, saúde ou localização sem confirmação.

