# 📝 User Stories - CheckMate

## Guia de Leitura

**Formato**: Como [persona], quero [ação], para [benefício]

**Prioridade**:
- 🔴 P0 - MVP (Crítico)
- 🟡 P1 - V1 (Importante)
- 🟢 P2 - V1.5 (Desejável)
- 🔵 P3 - Futuro (Nice to have)

**Estimativa**: Story Points (1, 2, 3, 5, 8, 13)

---

## Epic 1: Onboarding e Autenticação

### US-001 🔴 Login com Instagram
**Como** novo usuário  
**Quero** fazer login usando minha conta do Instagram  
**Para** começar a usar o app rapidamente sem criar nova conta

**Critérios de Aceite**:
- [ ] Botão "Continuar com Instagram" na tela inicial
- [ ] OAuth flow completo com Instagram
- [ ] Importar automaticamente: foto, nome, @username, bio
- [ ] Se erro no OAuth, mostrar mensagem clara
- [ ] Usuário pode cancelar e voltar

**Estimativa**: 5 pontos

---

### ~~US-002~~ REMOVIDO
> **NOTA:** Login por email foi REMOVIDO. Autenticação é APENAS via Instagram OAuth conforme decisão de produto em 00-ALINHAMENTO-PRODUTO-v2.md.

---

### US-002 🔴 Completar perfil
**Como** novo usuário  
**Quero** completar meu perfil com informações básicas  
**Para** que outros usuários possam me conhecer

**Critérios de Aceite**:
- [ ] Campos: foto (obrigatório), nome (obrigatório), bio (opcional), cidade (obrigatório)
- [ ] Upload de foto ou usar do Instagram
- [ ] Crop/ajuste de foto
- [ ] Limite de 140 caracteres na bio
- [ ] Cidade com autocomplete
- [ ] Botão pular (pode completar depois)
- [ ] Progresso visual (step 1 de 3)

**Estimativa**: 3 pontos

---

### ~~US-004~~ REMOVIDO
> **NOTA:** Removido pois não há login por email. Instagram já é conectado no onboarding.

---

### US-003 🟡 Tutorial inicial
**Como** novo usuário  
**Quero** entender como o app funciona  
**Para** aproveitar melhor as funcionalidades

**Critérios de Aceite**:
- [ ] 3-4 telas de onboarding com imagens
- [ ] Explicar: check-in, discovery, rematch
- [ ] Botão "Pular" disponível
- [ ] Não mostrar novamente após completar
- [ ] Animações suaves

**Estimativa**: 2 pontos

---

## Epic 2: Check-in

### US-010 🔴 Fazer check-in em local/evento
**Como** usuário no local  
**Quero** marcar minha presença  
**Para** que outros saibam que estou aqui

**Critérios de Aceite**:
- [ ] Botão de check-in proeminente na home
- [ ] Buscar eventos/locais próximos (GPS)
- [ ] Mostrar lista de locais em até 500m
- [ ] Selecionar local e confirmar
- [ ] Escolher visibilidade: público/amigos/privado
- [ ] Adicionar status opcional (texto 140 chars)
- [ ] Feedback visual de sucesso
- [ ] Check-in só funciona se GPS confirmar proximidade

**Estimativa**: 8 pontos

---

### US-011 🔴 Ver meu check-in ativo
**Como** usuário com check-in ativo  
**Quero** ver onde estou marcado  
**Para** confirmar e gerenciar minha presença

**Critérios de Aceite**:
- [ ] Card de check-in ativo na home
- [ ] Mostrar: local, há quanto tempo, visibilidade
- [ ] Botão de "Check-out"
- [ ] Botão de editar (mudar visibilidade/status)
- [ ] Contador de pessoas no mesmo local

**Estimativa**: 3 pontos

---

### US-012 🔴 Fazer check-out
**Como** usuário saindo do local  
**Quero** encerrar meu check-in  
**Para** não aparecer mais como presente

**Critérios de Aceite**:
- [ ] Botão check-out no card ativo
- [ ] Confirmação: "Encerrar check-in?"
- [ ] Registro salvo no histórico
- [ ] Remoção da lista de presentes
- [ ] Check-in expira automaticamente após 12h

**Estimativa**: 2 pontos

---

### US-013 🔴 Check-in via QR Code
**Como** participante de evento  
**Quero** fazer check-in escaneando QR code  
**Para** ter check-in verificado pelo organizador

**Critérios de Aceite**:
- [ ] Scanner de QR integrado
- [ ] Ler QR code do evento
- [ ] Validar código com servidor
- [ ] Check-in marcado como "verificado"
- [ ] Badge especial para verificado
- [ ] Funcionar offline (sync depois)

**Estimativa**: 5 pontos

---

### US-014 🟡 Check-in programado (vou estar)
**Como** usuário interessado em evento futuro  
**Quero** marcar que vou participar  
**Para** que amigos saibam e decidam ir também

**Critérios de Aceite**:
- [ ] Na página do evento, botão "Vou"
- [ ] Opções: Vou / Interessado / Talvez
- [ ] Aparecer na lista de "quem vai"
- [ ] Notificar amigos que também demonstraram interesse
- [ ] Lembrete no dia do evento
- [ ] Converter para check-in real no dia

**Estimativa**: 5 pontos

---

### US-015 🟡 Histórico de check-ins
**Como** usuário  
**Quero** ver meu histórico de check-ins  
**Para** lembrar onde estive e reconectar

**Critérios de Aceite**:
- [ ] Lista cronológica de check-ins
- [ ] Filtro por período (semana, mês, ano)
- [ ] Mostrar: local, data, duração, pessoas
- [ ] Clicar para ver quem mais estava
- [ ] Busca por nome de local

**Estimativa**: 3 pontos

---

### US-016 🟢 Editar visibilidade de check-in passado
**Como** usuário  
**Quero** mudar a visibilidade de check-ins antigos  
**Para** controlar quem vê meu histórico

**Critérios de Aceite**:
- [ ] No histórico, opção "Editar"
- [ ] Mudar entre público/amigos/privado
- [ ] Atualização imediata

**Estimativa**: 2 pontos

---

## Epic 3: Discovery

### US-020 🔴 Ver quem está no evento/local
**Como** usuário em um local  
**Quero** ver outras pessoas presentes  
**Para** saber quem posso conhecer

**Critérios de Aceite**:
- [ ] Lista de pessoas com check-in no mesmo local
- [ ] Mostrar: foto, nome, @, tempo presente
- [ ] Indicar conexões em comum
- [ ] Indicar se é amigo/seguindo
- [ ] Ordenar por: recentes, conexões em comum
- [ ] Filtrar: todos, amigos, amigos de amigos

**Estimativa**: 5 pontos

---

### US-021 🔴 Ver quem vai em evento futuro
**Como** usuário interessado em evento  
**Quero** ver quem confirmou presença  
**Para** decidir se vou também

**Critérios de Aceite**:
- [ ] Na página do evento, aba "Quem vai"
- [ ] Contador total de confirmados
- [ ] Lista com mesmos campos do US-020
- [ ] Destacar "X amigos seus vão"
- [ ] CTA: "Você também vai?"

**Estimativa**: 3 pontos

---

### US-022 🔴 Buscar eventos/locais
**Como** usuário  
**Quero** buscar eventos ou locais específicos  
**Para** encontrar onde quero fazer check-in

**Critérios de Aceite**:
- [ ] Campo de busca na home
- [ ] Busca por nome
- [ ] Resultados em tempo real (debounce 300ms)
- [ ] Mostrar: nome, tipo, distância, pessoas presentes
- [ ] Separar: eventos hoje, eventos futuros, locais

**Estimativa**: 5 pontos

---

### US-023 🟡 Feed de atividades
**Como** usuário  
**Quero** ver atividades recentes dos meus amigos  
**Para** saber onde estão indo

**Critérios de Aceite**:
- [ ] Feed cronológico
- [ ] Tipos: check-in, "vai em evento", novo match
- [ ] Pull-to-refresh
- [ ] Paginação infinita
- [ ] Filtro: todos amigos, favoritos

**Estimativa**: 5 pontos

---

### US-024 🟡 Descobrir eventos próximos
**Como** usuário  
**Quero** ver eventos acontecendo perto de mim  
**Para** descobrir coisas pra fazer

**Critérios de Aceite**:
- [ ] Seção "Acontecendo agora" na home
- [ ] Baseado em GPS
- [ ] Mostrar: nome, distância, pessoas presentes
- [ ] Filtro por categoria
- [ ] "Ver mais" para lista completa

**Estimativa**: 5 pontos

---

### US-025 🟡 Mapa de check-ins
**Como** usuário  
**Quero** ver um mapa com check-ins próximos  
**Para** visualizar onde as pessoas estão

**Critérios de Aceite**:
- [ ] Mapa interativo (Google Maps)
- [ ] Pins nos locais com check-ins ativos
- [ ] Cluster quando muitos pins próximos
- [ ] Clicar no pin: ver detalhes do local
- [ ] Filtro de raio (500m, 1km, 5km)

**Estimativa**: 8 pontos

---

### US-026 🟢 Recomendação de eventos
**Como** usuário  
**Quero** receber sugestões personalizadas  
**Para** descobrir eventos relevantes pra mim

**Critérios de Aceite**:
- [ ] Seção "Para você" na home
- [ ] Baseado em: histórico, amigos, interesses
- [ ] Explicar por que recomendou
- [ ] Feedback: "Não me interessa"

**Estimativa**: 8 pontos

---

## Epic 4: Interações e Matches

> **NOTA:** Sistema de interações alinhado com 03-FEATURES-FUNCIONALIDADES-v2.md e 11-PRD.md

### US-INT-001 🔴 Enviar curtida com intenção
**Como** usuário em um evento
**Quero** curtir alguém com um tipo de intenção específico
**Para** expressar meu interesse de forma contextualizada

**Critérios de Aceite**:
- [ ] Ao tocar no perfil de alguém, ver opções de interação
- [ ] Mostrar apenas interações permitidas pelo tema do evento
- [ ] Animação de confirmação ao enviar
- [ ] Não revelar identidade para a pessoa curtida
- [ ] Limite de 10 curtidas por dia (free)
- [ ] Contador mostrando curtidas restantes

**Estimativa**: 5 pontos

---

### US-INT-002 🔴 Ver curtidas recebidas (anônimo)
**Como** usuário em um evento
**Quero** saber quantas pessoas me curtiram
**Para** ter noção do interesse sem saber quem

**Critérios de Aceite**:
- [ ] Badge no perfil: "5 pessoas te curtiram"
- [ ] Não revelar identidades
- [ ] Atualizar em tempo real
- [ ] Separar por tipo de interação (opção)

**Estimativa**: 3 pontos

---

### US-INT-003 🔴 Match revelado no check-in
**Como** usuário que fez check-in
**Quero** ver matches revelados automaticamente
**Para** saber com quem tenho interesse mútuo

**Critérios de Aceite**:
- [ ] Ao fazer check-in, verificar matches pendentes
- [ ] Match = ambos se curtiram E ambos fizeram check-in
- [ ] Modal de celebração: "É Match! 🎉"
- [ ] Mostrar tipo de interação do match
- [ ] Botão para ir ao chat
- [ ] Push notification para o outro usuário

**Estimativa**: 8 pontos

---

### US-INT-004 🟡 Ver quem curtiu (premium)
**Como** usuário premium
**Quero** ver quem me curtiu antes do check-in
**Para** decidir se quero curtir de volta

**Critérios de Aceite**:
- [ ] Seção "Quem te curtiu" visível só para premium
- [ ] Lista de pessoas com foto, nome, tipo de interação
- [ ] Botão para curtir de volta
- [ ] Upsell para free: "Quer ver quem te curtiu?"

**Estimativa**: 5 pontos

---

### US-INT-005 🔴 Tipos de interação disponíveis
**Como** usuário
**Quero** escolher entre diferentes tipos de interação
**Para** expressar minha intenção de forma precisa

**Sistema de Interações:**
| Emoji | ID | Label | Uso |
|-------|-----|-------|-----|
| 🔥 | fire | Interesse | Atração romântica |
| 🤝 | handshake | Networking | Contato profissional |
| ✋ | highfive | Amizade | Curtir a vibe |
| 🚗 | carona | Carona | Dividir transporte |
| 🎫 | ticket | Ingresso | Dividir/vender entrada |
| 🍾 | champagne | Drinks | Convite para after |
| 💼 | briefcase | Proposta | Proposta profissional |
| 🎯 | target | Objetivo | Objetivo do evento |

**Estimativa**: 3 pontos

---

## Epic 5: Sistema de Temas

### US-THEME-001 🔴 Evento com tema aplicado
**Como** usuário em um evento temático
**Quero** ver a UI adaptada ao tema
**Para** ter experiência contextualizada

**Critérios de Aceite**:
- [ ] Cores do tema aplicadas à UI
- [ ] Labels personalizados exibidos
- [ ] Interações bloqueadas não aparecem
- [ ] Mensagem de match personalizada pelo tema

**Estimativa**: 5 pontos

---

### US-THEME-002 🟡 Seleção de interações por tema
**Como** organizador
**Quero** definir quais interações são permitidas no meu evento
**Para** garantir contexto apropriado

**Critérios de Aceite**:
- [ ] No dashboard, selecionar tema do evento
- [ ] Ver preview das interações permitidas/bloqueadas
- [ ] Poder customizar além do padrão do tema
- [ ] Usuarios veem apenas interações permitidas

**Estimativa**: 5 pontos

---

### US-THEME-003 🔵 Temas disponíveis
**Como** organizador
**Quero** escolher um tema para meu evento
**Para** definir a atmosfera e contexto

**Temas Disponíveis (MVP):**
| ID | Nome | Interações Padrão | Bloqueadas |
|----|------|-------------------|------------|
| romantic | Romance | fire, highfive, champagne | briefcase |
| professional | Profissional | handshake, briefcase, target | fire |
| social | Social | highfive, champagne, carona | briefcase |
| party | Festa | fire, champagne, highfive | briefcase |

**Estimativa**: 3 pontos

---

## Epic 6: ReMatch (Segunda Chance)

### US-030 🔴 Ver pessoas do mesmo evento (passado)
**Como** usuário que foi em um evento  
**Quero** ver quem mais estava lá  
**Para** reconectar com quem conheci

**Critérios de Aceite**:
- [ ] No histórico, clicar em check-in passado
- [ ] Ver lista de pessoas que estavam
- [ ] Mostrar: foto, nome, @
- [ ] Indicar se já são conectados
- [ ] Funciona até 7 dias após evento

**Estimativa**: 3 pontos

---

### US-031 🔴 Enviar ReMatch request
**Como** usuário que encontrou alguém em evento  
**Quero** enviar solicitação de conexão  
**Para** manter contato com a pessoa

**Critérios de Aceite**:
- [ ] Botão "Conectar" no perfil da pessoa
- [ ] Só aparece se estiveram no mesmo local
- [ ] Modal para adicionar mensagem (opcional)
- [ ] Sugestões de mensagem contextual
- [ ] Limite de 5 requests por dia
- [ ] Confirmação de envio

**Estimativa**: 5 pontos

---

### US-032 🔴 Receber e responder ReMatch
**Como** usuário  
**Quero** ver e responder solicitações de conexão  
**Para** decidir com quem quero conectar

**Critérios de Aceite**:
- [ ] Notificação push quando receber
- [ ] Seção "Solicitações" no app
- [ ] Ver: foto, nome, onde se encontraram, mensagem
- [ ] Opções: Aceitar / Ignorar / Bloquear
- [ ] Se aceitar: ambos viram "match"

**Estimativa**: 5 pontos

---

### US-033 🔴 Match confirmado
**Como** usuário com match aceito  
**Quero** ver minha nova conexão  
**Para** iniciar conversa

**Critérios de Aceite**:
- [ ] Tela de celebração "É um match!"
- [ ] Mostrar perfil completo da pessoa
- [ ] Mostrar onde se encontraram
- [ ] Botão "Enviar mensagem"
- [ ] Adicionar à lista de conexões

**Estimativa**: 3 pontos

---

### US-034 🟡 Chat pós-match
**Como** usuário com match  
**Quero** conversar com a pessoa  
**Para** manter contato e combinar encontros

**Critérios de Aceite**:
- [ ] Chat 1:1 só entre matches
- [ ] Mensagens de texto
- [ ] Emoji picker
- [ ] Indicador de lido
- [ ] Push notification de nova mensagem
- [ ] Histórico persistente

**Estimativa**: 8 pontos

---

### US-035 🟡 Bloquear usuário
**Como** usuário  
**Quero** bloquear alguém  
**Para** não receber mais contato dessa pessoa

**Critérios de Aceite**:
- [ ] Opção em: request, chat, perfil
- [ ] Confirmação antes de bloquear
- [ ] Pessoa não pode mais: ver perfil, enviar request, mensagem
- [ ] Não aparece mais em listas
- [ ] Lista de bloqueados em configurações
- [ ] Opção de desbloquear

**Estimativa**: 3 pontos

---

### US-036 🟡 Reportar usuário
**Como** usuário  
**Quero** denunciar comportamento inadequado  
**Para** manter a comunidade segura

**Critérios de Aceite**:
- [ ] Opção "Reportar" no perfil e chat
- [ ] Motivos: spam, assédio, perfil falso, outro
- [ ] Campo para detalhes
- [ ] Confirmação de envio
- [ ] Opção de bloquear junto
- [ ] Report vai para moderação

**Estimativa**: 3 pontos

---

## Epic 5: Perfil e Configurações

### US-040 🔴 Ver meu perfil
**Como** usuário  
**Quero** ver como meu perfil aparece  
**Para** garantir que está como quero

**Critérios de Aceite**:
- [ ] Aba "Perfil" na navegação
- [ ] Mostrar: foto, nome, bio, @instagram
- [ ] Estatísticas: check-ins, conexões, badges
- [ ] Botão "Editar perfil"
- [ ] Preview "Como outros veem"

**Estimativa**: 3 pontos

---

### US-041 🔴 Editar perfil
**Como** usuário  
**Quero** atualizar minhas informações  
**Para** manter perfil atualizado

**Critérios de Aceite**:
- [ ] Editar: foto, nome, bio, cidade
- [ ] Trocar foto (camera ou galeria)
- [ ] Atualizar do Instagram
- [ ] Validação de campos
- [ ] Salvar ou cancelar
- [ ] Feedback de sucesso

**Estimativa**: 3 pontos

---

### US-042 🔴 Configurações de privacidade
**Como** usuário  
**Quero** controlar quem vê minhas informações  
**Para** ter privacidade

**Critérios de Aceite**:
- [ ] Visibilidade padrão de check-ins
- [ ] Quem pode enviar ReMatch: todos/amigos de amigos/ninguém
- [ ] Mostrar no discovery: sim/não
- [ ] Esconder histórico de check-ins
- [ ] Modo invisível temporário

**Estimativa**: 5 pontos

---

### US-043 🟡 Configurações de notificação
**Como** usuário  
**Quero** controlar quais notificações recebo  
**Para** não ser incomodado

**Critérios de Aceite**:
- [ ] Toggle por tipo de notificação
- [ ] Tipos: check-in amigo, request, match, mensagem, eventos
- [ ] Horário silencioso (configurar período)
- [ ] Som on/off
- [ ] Vibração on/off

**Estimativa**: 3 pontos

---

### US-044 🟡 Ver minhas conexões
**Como** usuário  
**Quero** ver lista de pessoas que conectei  
**Para** gerenciar minha rede

**Critérios de Aceite**:
- [ ] Lista de matches/conexões
- [ ] Mostrar: foto, nome, onde se conheceram
- [ ] Busca por nome
- [ ] Ordenar por: recente, alfabético
- [ ] Clicar: ver perfil ou ir pro chat

**Estimativa**: 3 pontos

---

### US-045 🟢 Deletar conta
**Como** usuário  
**Quero** excluir minha conta e dados  
**Para** sair da plataforma completamente

**Critérios de Aceite**:
- [ ] Opção em Configurações
- [ ] Explicar o que será deletado
- [ ] Confirmar com senha
- [ ] Período de "cooling off" (7 dias)
- [ ] Email de confirmação
- [ ] Dados deletados após período
- [ ] Pode cancelar no período

**Estimativa**: 5 pontos

---

## Epic 6: Organizador (B2B)

### US-050 🔴 Cadastrar como organizador
**Como** organizador de eventos  
**Quero** criar conta de organizador  
**Para** usar as ferramentas B2B

**Critérios de Aceite**:
- [ ] Formulário: nome, email, empresa, cargo
- [ ] Verificação de email
- [ ] Aprovação manual ou automática
- [ ] Acesso ao dashboard

**Estimativa**: 3 pontos

---

### US-051 🔴 Criar evento
**Como** organizador  
**Quero** cadastrar meu evento  
**Para** habilitar check-ins

**Critérios de Aceite**:
- [ ] Campos: nome, data, horário, local, descrição, imagem
- [ ] Definir tipo de check-in (geo, QR, código)
- [ ] Definir visibilidade
- [ ] Preview antes de publicar
- [ ] Gerar QR code do evento
- [ ] Link compartilhável

**Estimativa**: 5 pontos

---

### US-052 🔴 Dashboard básico do evento
**Como** organizador  
**Quero** ver métricas do meu evento  
**Para** acompanhar engajamento

**Critérios de Aceite**:
- [ ] Total de check-ins
- [ ] Check-ins ao longo do tempo (gráfico)
- [ ] Lista de participantes
- [ ] Pico de presença
- [ ] Exportar lista (CSV)

**Estimativa**: 5 pontos

---

### US-053 🟡 Configurar check-in do evento
**Como** organizador  
**Quero** customizar como check-in funciona  
**Para** adequar ao meu evento

**Critérios de Aceite**:
- [ ] Tipo: geolocalização, QR code, código manual
- [ ] Raio de geolocalização (50m a 1km)
- [ ] Check-in antecipado (quanto antes)
- [ ] Exigir verificação
- [ ] Permitir check-in remoto
- [ ] Horário de funcionamento

**Estimativa**: 5 pontos

---

### US-054 🟡 Gerar QR codes
**Como** organizador  
**Quero** gerar QR codes para o evento  
**Para** distribuir no local

**Critérios de Aceite**:
- [ ] Gerar QR code único do evento
- [ ] Download em alta resolução
- [ ] QR codes múltiplos por área (opcional)
- [ ] Validade configurável
- [ ] Regenerar se comprometido

**Estimativa**: 3 pontos

---

### US-055 🟡 Analytics avançado
**Como** organizador  
**Quero** ver métricas detalhadas  
**Para** entender melhor meu evento

**Critérios de Aceite**:
- [ ] Tempo médio de permanência
- [ ] Heatmap de presença (por hora)
- [ ] Taxa de ReMatch
- [ ] Top influenciadores (quem trouxe mais)
- [ ] Comparativo com eventos anteriores
- [ ] Exportar relatório PDF

**Estimativa**: 8 pontos

---

### US-056 🟡 Widget para site
**Como** organizador  
**Quero** embed no meu site  
**Para** mostrar quem vai

**Critérios de Aceite**:
- [ ] Código embed (iframe ou JS)
- [ ] Customizar cores/tema
- [ ] Mostrar contador ou lista
- [ ] Responsivo
- [ ] Link para o app

**Estimativa**: 5 pontos

---

### US-057 🟢 Integração com Sympla
**Como** organizador que usa Sympla  
**Quero** integrar as plataformas  
**Para** sync de participantes

**Critérios de Aceite**:
- [ ] Conectar conta Sympla
- [ ] Importar evento existente
- [ ] Sync lista de inscritos
- [ ] Match de usuários por email
- [ ] Atualização em tempo real

**Estimativa**: 13 pontos

---

## Epic 7: Notificações

### US-060 🟡 Push de check-in de amigo
**Como** usuário  
**Quero** saber quando amigo faz check-in  
**Para** decidir se vou encontrar

**Critérios de Aceite**:
- [ ] Push: "[Nome] está em [Local]"
- [ ] Só para amigos (não seguidos)
- [ ] Deep link para o local
- [ ] Respeitar configurações de notificação
- [ ] Não enviar se em modo silencioso

**Estimativa**: 3 pontos

---

### US-061 🟡 Push de ReMatch request
**Como** usuário  
**Quero** saber quando recebo solicitação  
**Para** responder rapidamente

**Critérios de Aceite**:
- [ ] Push: "Alguém do [Evento] quer conectar"
- [ ] Não revelar quem (preservar privacidade)
- [ ] Deep link para solicitações
- [ ] Imediato

**Estimativa**: 2 pontos

---

### US-062 🟡 Push de match confirmado
**Como** usuário  
**Quero** saber quando match é aceito  
**Para** celebrar e conversar

**Critérios de Aceite**:
- [ ] Push: "Match! Você e [Nome] estão conectados"
- [ ] Deep link para o chat
- [ ] Imediato

**Estimativa**: 2 pontos

---

### US-063 🟡 Push de nova mensagem
**Como** usuário  
**Quero** saber quando recebo mensagem  
**Para** responder

**Critérios de Aceite**:
- [ ] Push com preview da mensagem
- [ ] Nome e foto do remetente
- [ ] Deep link para o chat
- [ ] Agrupar se múltiplas do mesmo

**Estimativa**: 2 pontos

---

### US-064 🟢 Push de amigos vão em evento
**Como** usuário  
**Quero** saber quando amigos confirmam presença  
**Para** decidir se vou também

**Critérios de Aceite**:
- [ ] Push: "5 amigos vão em [Evento]"
- [ ] Agregar (não enviar individual)
- [ ] Deep link para o evento
- [ ] Configurável: threshold de amigos

**Estimativa**: 3 pontos

---

## Epic 8: Gamificação

### US-070 🟢 Sistema de pontos
**Como** usuário  
**Quero** ganhar pontos por atividades  
**Para** me sentir recompensado

**Critérios de Aceite**:
- [ ] Ganhar pontos por: check-in, match, completar perfil
- [ ] Ver total de pontos no perfil
- [ ] Histórico de pontos ganhos
- [ ] Animação ao ganhar pontos

**Estimativa**: 5 pontos

---

### US-071 🟢 Badges de conquista
**Como** usuário  
**Quero** ganhar badges por conquistas  
**Para** mostrar no meu perfil

**Critérios de Aceite**:
- [ ] Badges definidos (Early Adopter, Connector, etc)
- [ ] Notificação ao desbloquear
- [ ] Exibir no perfil
- [ ] Ver badges de outros
- [ ] Descrição de como ganhar cada um

**Estimativa**: 5 pontos

---

### US-072 🟢 Níveis de usuário
**Como** usuário  
**Quero** subir de nível conforme uso  
**Para** ter benefícios

**Critérios de Aceite**:
- [ ] Níveis baseados em pontos
- [ ] Indicador visual de nível
- [ ] Benefícios por nível (destaque, etc)
- [ ] Progress bar para próximo nível

**Estimativa**: 3 pontos

---

### US-073 🔵 Leaderboard
**Como** usuário  
**Quero** ver ranking de pessoas  
**Para** competir com amigos

**Critérios de Aceite**:
- [ ] Ranking global (cidade)
- [ ] Ranking entre amigos
- [ ] Ranking por evento
- [ ] Semanal e all-time
- [ ] Minha posição destacada

**Estimativa**: 5 pontos

---

## Resumo por Prioridade

### 🔴 MVP (P0) - 23 stories
Total estimado: ~80 story points

### 🟡 V1 (P1) - 20 stories
Total estimado: ~70 story points

### 🟢 V1.5 (P2) - 10 stories
Total estimado: ~45 story points

### 🔵 Futuro (P3) - 5 stories
Total estimado: ~25 story points

---

*User Stories v1.0 - Para planejamento de sprints*
