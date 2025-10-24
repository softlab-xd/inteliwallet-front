# API Integration Guide

Este documento descreve a API REST do InteliWallet e como integrar o frontend com seu backend.

> 📖 **Implementando o Backend?** Consulte [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) para um guia completo de como construir o backend com Spring Boot + PostgreSQL.

## Configuração

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Configure a URL do seu backend em `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

### Modo de Desenvolvimento (Mock)

O frontend inclui um serviço mock completo para desenvolvimento sem backend:

1. Habilite o modo mock em `.env.local`:
   ```env
   NEXT_PUBLIC_USE_MOCK=true
   ```

2. O aplicativo usará dados mock locais definidos em `lib/services/mock.service.ts`

3. Você pode customizar os dados mock editando este arquivo

4. Útil para:
   - Desenvolvimento de UI sem backend
   - Testes de integração
   - Demonstrações e protótipos

**Nota:** Lembre-se de desabilitar (`NEXT_PUBLIC_USE_MOCK=false`) ao conectar com o backend real!

## Estrutura da API

A aplicação está preparada para consumir os seguintes endpoints:

### Autenticação

#### POST `/auth/login`
Realiza login do usuário.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "username",
    "email": "user@example.com",
    "avatar": "👤",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "totalPoints": 325,
    "level": 5
  }
}
```

#### POST `/auth/register`
Registra novo usuário.

**Request:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as login

#### POST `/auth/logout`
Faz logout do usuário (opcional).

#### GET `/auth/me`
Retorna os dados do usuário autenticado.

**Response:**
```json
{
  "id": "user-id",
  "username": "username",
  "email": "user@example.com",
  "avatar": "👤",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "totalPoints": 325,
  "level": 5,
  "hasCompletedOnboarding": false
}
```

**Nota:** O campo `hasCompletedOnboarding` controla se o usuário verá o tutorial de onboarding. Quando `false`, o onboarding será exibido automaticamente na primeira vez que o usuário acessar o dashboard.

### Transações

#### GET `/transactions`
Lista todas as transações do usuário.

**Query Params:**
- `type`: "income" | "expense"
- `category`: string
- `startDate`: ISO date string
- `endDate`: ISO date string
- `search`: string

**Response:**
```json
[
  {
    "id": "transaction-id",
    "type": "expense",
    "amount": 50.00,
    "title": "Grocery Shopping",
    "category": "Food & Dining",
    "date": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### POST `/transactions`
Cria nova transação.

**Request:**
```json
{
  "type": "expense",
  "amount": 50.00,
  "title": "Grocery Shopping",
  "category": "Food & Dining",
  "date": "2024-01-15T00:00:00.000Z"
}
```

#### PUT `/transactions/:id`
Atualiza transação existente.

#### DELETE `/transactions/:id`
Remove transação.

#### GET `/transactions/stats`
Retorna estatísticas das transações.

**Response:**
```json
{
  "totalIncome": 5400,
  "totalExpenses": 4200,
  "balance": 1200,
  "savingsRate": 22.2,
  "monthlyData": [
    { "month": "Jan", "income": 4500, "expenses": 3200 }
  ],
  "categoryData": [
    { "name": "Food & Dining", "value": 850, "color": "#hex" }
  ],
  "weeklySpending": [
    { "day": "Mon", "amount": 120 }
  ]
}
```

### Metas (Goals)

#### GET `/goals`
Lista todas as metas.

**Response:**
```json
[
  {
    "id": "goal-id",
    "title": "Emergency Fund",
    "targetAmount": 10000,
    "currentAmount": 5000,
    "category": "Savings",
    "deadline": "2024-12-31T00:00:00.000Z",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

#### POST `/goals`
Cria nova meta.

#### PUT `/goals/:id`
Atualiza meta.

#### DELETE `/goals/:id`
Remove meta.

#### POST `/goals/:id/contribute`
Adiciona contribuição a uma meta.

**Request:**
```json
{
  "amount": 500
}
```

### Amigos

#### GET `/friends`
Lista amigos do usuário.

**Response:**
```json
[
  {
    "id": "friend-id",
    "username": "Friend Name",
    "avatar": "👤",
    "totalPoints": 245,
    "rank": 2,
    "status": "active"
  }
]
```

#### POST `/friends/add`
Envia convite de amizade.

**Request:**
```json
{
  "username": "friend_username"
}
```

#### DELETE `/friends/:id`
Remove amigo.

#### GET `/friends/invites`
Lista convites pendentes.

**Response:**
```json
[
  {
    "id": "invite-id",
    "fromUser": {
      "id": "user-id",
      "username": "Username",
      "avatar": "👤"
    },
    "toUserId": "current-user-id",
    "status": "pending",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
]
```

#### POST `/friends/invites/:id/accept`
Aceita convite.

#### POST `/friends/invites/:id/decline`
Recusa convite.

### Gamificação

#### GET `/gamification/achievements`
Lista conquistas.

**Response:**
```json
[
  {
    "id": "achievement-id",
    "name": "First Transaction",
    "description": "Complete your first transaction",
    "icon": "🎯",
    "rarity": "common",
    "points": 10,
    "unlocked": true,
    "unlockedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

#### GET `/gamification/leaderboard`
Retorna ranking de usuários.

**Response:**
```json
[
  {
    "id": "user-id",
    "username": "Username",
    "avatar": "👤",
    "totalPoints": 1250,
    "rank": 1,
    "level": 12
  }
]
```

#### GET `/gamification/challenges`
Lista desafios ativos.

**Response:**
```json
[
  {
    "id": "challenge-id",
    "title": "Save $1000",
    "description": "Save at least $1000 this month",
    "progress": 750,
    "target": 1000,
    "reward": 100,
    "deadline": "2024-01-31T23:59:59.000Z",
    "status": "active"
  }
]
```

### Perfil do Usuário

#### GET `/users/profile`
Retorna perfil do usuário.

#### PUT `/users/profile`
Atualiza perfil.

**Request:**
```json
{
  "username": "new_username",
  "email": "newemail@example.com",
  "avatar": "👨",
  "hasCompletedOnboarding": true
}
```

**Nota:** O campo `hasCompletedOnboarding` deve ser atualizado para `true` quando o usuário completar o tutorial de onboarding.

#### DELETE `/users/profile`
Remove conta do usuário.

## Autenticação

Todas as requisições (exceto login e register) devem incluir o header:

```
Authorization: Bearer {jwt-token}
```

O token JWT é salvo automaticamente no localStorage após login/registro bem-sucedido.

## Tratamento de Erros

A API deve retornar erros no seguinte formato:

```json
{
  "message": "Error message here",
  "code": "ERROR_CODE",
  "details": {}
}
```

Status codes esperados:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Serviços Disponíveis

Os serviços estão localizados em `lib/services/`:

- `authService`: Autenticação
- `userService`: Gerenciamento de perfil
- `transactionService`: Transações
- `goalService`: Metas
- `friendService`: Amigos
- `gamificationService`: Conquistas e desafios

## Client HTTP

O cliente HTTP está em `lib/services/api-client.ts` e possui:

- Métodos: GET, POST, PUT, PATCH, DELETE
- Timeout configurável (30s padrão)
- Tratamento automático de autenticação
- Tratamento de erros padronizado

## Próximos Passos

1. Configure seu backend para seguir esta estrutura de API
2. Atualize `.env.local` com a URL do seu backend
3. Implemente os endpoints conforme documentado
4. Teste a integração
