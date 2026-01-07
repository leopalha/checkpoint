# Security Checklist - CheckMate

> **Versao:** 1.0
> **Ultima Revisao:** 2026-01-06

---

## 1. Autenticacao e Autorizacao

### 1.1 OAuth/JWT
- [ ] JWT com expiracao curta (1h access, 7d refresh)
- [ ] Refresh token rotativo (single-use)
- [ ] Blacklist de tokens revogados (Redis)
- [ ] Validacao de audience e issuer no JWT
- [ ] Secrets armazenados em vault (AWS Secrets Manager)

### 1.2 Instagram OAuth
- [ ] Validar state parameter contra CSRF
- [ ] Verificar token com Instagram API apos callback
- [ ] Nao armazenar access token do Instagram (apenas usar para login)
- [ ] Revogar acesso se usuario deletar conta

### 1.3 Rate Limiting
- [ ] Rate limit por IP em endpoints de auth (10/min)
- [ ] Rate limit por usuario em acoes sensiveis
- [ ] Exponential backoff apos falhas repetidas
- [ ] Alerta para tentativas de brute force

---

## 2. Protecao de Dados (LGPD)

### 2.1 Dados Pessoais
| Dado | Classificacao | Retencao | Criptografia |
|------|---------------|----------|--------------|
| Nome | PII | Conta ativa | Em repouso |
| Email | PII | Conta ativa | Em repouso |
| Foto | PII | Conta ativa | Em transito |
| Localizacao | Sensivel | 30 dias | Em repouso |
| Mensagens | PII | 7 dias | E2E (futuro) |
| Historico check-in | PII | 1 ano | Em repouso |

### 2.2 Consentimento
- [ ] Termos de uso claros em portugues
- [ ] Politica de privacidade acessivel
- [ ] Opt-in explicito para notificacoes
- [ ] Opt-in para compartilhar localizacao
- [ ] Registro de consentimentos com timestamp

### 2.3 Direitos do Usuario
- [ ] Endpoint para exportar dados (/users/me/export)
- [ ] Endpoint para deletar conta (/users/me/delete)
- [ ] Soft delete com 30 dias para arrependimento
- [ ] Hard delete automatico apos 30 dias
- [ ] Anonimizacao de dados em analytics

---

## 3. Anti-Harassment

### 3.1 Limites e Restricoes
- [ ] Limite de curtidas por dia (10 free, ilimitado premium)
- [ ] Limite de mensagens por hora para novos matches
- [ ] Cooldown apos rejeicao (nao pode curtir de novo)
- [ ] Bloqueio mutuo permanente

### 3.2 Report e Moderacao
- [ ] Botao de report em 1 toque
- [ ] Categorias de report:
  - Spam
  - Comportamento inapropriado
  - Assedio
  - Perfil falso
  - Outro
- [ ] Fila de moderacao com SLA de 24h
- [ ] Shadow ban para reincidentes
- [ ] Ban permanente com apelacao

### 3.3 Deteccao Automatica
- [ ] Filtro de palavras proibidas em mensagens
- [ ] Deteccao de conteudo implicito (ML futuro)
- [ ] Alerta para padroes de comportamento suspeito
- [ ] Verificacao de fotos (nudez, violencia)

---

## 4. Seguranca de Localizacao

### 4.1 GPS
- [ ] Validar coordenadas no servidor (bounds check)
- [ ] Deteccao basica de GPS spoofing
- [ ] Raio minimo configuravel (200m)
- [ ] Nao expor coordenadas exatas para outros usuarios
- [ ] Fuzzing de localizacao para discovery

### 4.2 QR Code
- [ ] QR codes com assinatura criptografica
- [ ] Expiracao de QR codes (1 evento = 1 QR)
- [ ] Rotacao de QR codes durante evento (opcional)
- [ ] Rate limit de scans por dispositivo

---

## 5. Seguranca da API

### 5.1 Input Validation
- [ ] Validacao de todos os inputs (Zod/Joi)
- [ ] Sanitizacao de strings (XSS prevention)
- [ ] Limite de tamanho de payloads (1MB)
- [ ] Validacao de tipos e formatos

### 5.2 SQL Injection
- [ ] Usar ORM (Prisma) - queries parametrizadas
- [ ] Nunca concatenar strings em queries
- [ ] Validar IDs como UUIDs

### 5.3 Headers de Seguranca
- [ ] HTTPS obrigatorio (HSTS)
- [ ] Content-Security-Policy
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection: 1; mode=block

### 5.4 CORS
- [ ] Whitelist de origens permitidas
- [ ] Nao usar Access-Control-Allow-Origin: *
- [ ] Validar Origin header

---

## 6. Infraestrutura

### 6.1 Database
- [ ] Conexoes SSL obrigatorias
- [ ] Credenciais em environment variables
- [ ] Backup automatico diario
- [ ] Encriptacao at rest (AES-256)
- [ ] Acesso restrito por IP (VPC)

### 6.2 Redis
- [ ] Senha obrigatoria
- [ ] TLS habilitado
- [ ] Acesso restrito por IP

### 6.3 Logs
- [ ] Nao logar dados sensiveis (PII, tokens)
- [ ] Mascarar dados parcialmente em logs
- [ ] Retencao de logs: 90 dias
- [ ] Logs de acesso separados

### 6.4 Secrets
- [ ] Usar AWS Secrets Manager ou similar
- [ ] Rotacao automatica de secrets
- [ ] Nunca commitar secrets no codigo
- [ ] .env apenas para desenvolvimento

---

## 7. Mobile Security

### 7.1 Armazenamento
- [ ] Tokens em SecureStore (Expo)
- [ ] Nao armazenar dados sensiveis em AsyncStorage
- [ ] Certificate pinning (producao)
- [ ] Detectar jailbreak/root (alerta apenas)

### 7.2 Comunicacao
- [ ] Apenas HTTPS
- [ ] Validar certificados SSL
- [ ] Nao confiar em proxies de usuario

---

## 8. Monitoramento

### 8.1 Alertas
- [ ] Pico de erros 4xx/5xx
- [ ] Tentativas de login falhadas em massa
- [ ] Acesso de IPs suspeitos
- [ ] Padroes de scraping
- [ ] Reports de usuarios acima do normal

### 8.2 Audit Log
- [ ] Login/logout
- [ ] Mudancas de perfil
- [ ] Acoes de moderacao
- [ ] Acessos administrativos
- [ ] Exportacao/delecao de dados

---

## 9. Incident Response

### 9.1 Classificacao
| Severidade | Descricao | SLA |
|------------|-----------|-----|
| P0 | Vazamento de dados, sistema fora | 1h |
| P1 | Vulnerabilidade critica | 4h |
| P2 | Bug de seguranca medio | 24h |
| P3 | Melhoria de seguranca | 1 semana |

### 9.2 Processo
1. Detectar e confirmar incidente
2. Conter o impacto
3. Notificar stakeholders
4. Investigar causa raiz
5. Remediar
6. Documentar e aprender

### 9.3 Notificacao LGPD
- [ ] Notificar ANPD em 72h para vazamentos
- [ ] Notificar usuarios afetados
- [ ] Documentar medidas tomadas

---

## 10. Checklist Pre-Lancamento

### MVP
- [ ] Pentest basico realizado
- [ ] HTTPS em todos endpoints
- [ ] Rate limiting implementado
- [ ] Validacao de input em todos endpoints
- [ ] Logs sem PII
- [ ] Backup funcionando
- [ ] Processo de report funcionando
- [ ] Termos e politica publicados

### V1.0
- [ ] Pentest profissional
- [ ] WAF configurado
- [ ] DDoS protection
- [ ] Audit log completo
- [ ] Processo de incident response documentado
- [ ] Treinamento do time em seguranca

---

## 11. Compliance

### LGPD
- [ ] DPO designado (pode ser terceirizado)
- [ ] ROPA (Registro de Atividades de Tratamento)
- [ ] Avaliacao de Impacto (DPIA) se necessario
- [ ] Contratos com processadores (AWS, etc)

### App Stores
- [ ] Privacy Policy URL nas lojas
- [ ] App Tracking Transparency (iOS)
- [ ] Data safety section (Android)

---

## 12. Revisoes Periodicas

| Item | Frequencia |
|------|------------|
| Revisao de acessos | Mensal |
| Rotacao de secrets | Trimestral |
| Pentest | Anual |
| Revisao de politicas | Semestral |
| Backup restore test | Trimestral |

---

*Security Checklist v1.0 - CheckMate*
