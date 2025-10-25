# 💰 InteliWallet - Smart Wallet PWA

> **Aplicativo de gestão financeira gamificada construído com as mais recentes tecnologias web**

Transforme suas finanças pessoais em uma experiência divertida e engajante! InteliWallet combina gestão financeira inteligente com elementos de gamificação para motivar você a alcançar suas metas.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Começando](#-começando)
- [Stack Tecnológica](#️-stack-tecnológica)
- [Arquitetura](#-arquitetura)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Configuração do Backend](#-configuração-do-backend)
- [Internacionalização](#-internacionalização)
- [Roadmap](#️-roadmap)

---

## ✨ Funcionalidades

### 🔐 Autenticação & Onboarding
- **Sistema de Login/Registro** com JWT e validação de formulários
- **Onboarding Interativo** - Tutorial guiado para novos usuários em 5 etapas
- **Perfil de Usuário** - Gerenciamento de informações pessoais

### 💳 Gestão de Transações
- ✅ **Adicionar Transações** - Registre receitas e despesas com categorias
- ✅ **Editar Transações** - Menu dropdown com opções de editar/deletar em cada item
- ✅ **Filtros Avançados** - Busca por texto, tipo e categoria
- ✅ **Visualização Agrupada** - Transações organizadas por data (Hoje, Ontem, etc)
- ✅ **Atualização em Tempo Real** - Dashboard atualiza automaticamente ao adicionar/editar/deletar

### 📊 Dashboard Analítico Inteligente
- **Cálculos em Tempo Real:**
  - Total de receitas e despesas do mês
  - Balanço (receitas - despesas)
  - **Gasto Médio Diário** - Calculado desde a primeira transação até hoje
  - **Status de Orçamento** - Verde (saudável) ou Vermelho (gastando demais)
  - **Categoria com Mais Gastos** - Automaticamente identificada

- **Gráficos Interativos:**
  - 📈 Gráfico de Área: Receitas vs Despesas (últimos 6 meses)
  - 🥧 Gráfico de Pizza: Gastos por Categoria
  - 📊 Gráfico de Barras: Padrão de Gastos Semanal

- **Sistema de Atualização Performático:**
  - Sem reload de página
  - Atualização automática via callbacks
  - Sem perda de estado ou flickering

### 🎯 Metas Financeiras
- **Criar Metas** - Defina objetivos de economia
- **Acompanhamento Visual** - Barras de progresso coloridas
- **Prazos** - Acompanhe quantos dias faltam
- **Contribuições** - Adicione valores às suas metas

### 🎮 Sistema de Gamificação
- **Níveis e XP** - Ganhe pontos e suba de nível
- **Conquistas** - Desbloqueie badges (Common, Rare, Epic, Legendary)
- **Desafios Semanais** - Complete desafios para ganhar pontos extras
- **Sistema de Streak** - Mantenha sua sequência de dias ativos

### 👥 Social & Competição
- **Sistema de Amigos** - Adicione amigos e compare progresso
- **Convites** - Envie e aceite convites de amizade
- **Leaderboard** - Ranking dos melhores poupadores do mês
- **Perfil Social** - Avatar, nível e pontos totais

### 🌐 Experiência do Usuário
- **Multi-idioma** - Suporte para Português (PT-BR) e Inglês (EN)
- **Tema Escuro Moderno** - Design roxo/escuro com cores OKLch
- **PWA** - Instalável como app nativo no celular
- **Responsivo** - Design adaptado para mobile e desktop
- **Modo Offline** - Funciona mesmo sem backend (modo mock)

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18.0 ou superior
- **pnpm** (recomendado), npm ou yarn
- **Git** para controle de versão

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd "Smart Wallet PWA"
```

2. **Instale as dependências**
```bash
# Usando pnpm (recomendado)
pnpm install

# Ou usando npm
npm install

# Ou usando yarn
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# URL da API do Backend
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. **Execute o projeto em modo de desenvolvimento**
```bash
pnpm dev
# ou
npm run dev
```

5. **Acesse no navegador**

Abra [http://localhost:3000](http://localhost:3000) para ver o aplicativo rodando.

#### 🔌 Modo Backend Real

Para conectar a uma API real:

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Veja [BACKEND_CORS_EXAMPLE.md](./BACKEND_CORS_EXAMPLE.md) para configurar o backend.

---

## 🛠️ Stack Tecnológica

### Frontend Core

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Next.js** | 16.0.0 | Framework React com App Router e Server Components |
| **React** | 19.2.0 | Biblioteca UI com hooks e concurrent features |
| **TypeScript** | 5.0 | Type safety e IntelliSense |
| **TailwindCSS** | 4.1.9 | Utility-first CSS com OKLch colors |

### UI & Componentes

| Pacote | Propósito |
|--------|-----------|
| **shadcn/ui** | 59 componentes acessíveis baseados em Radix UI |
| **Radix UI** | Primitivos de UI acessíveis e não estilizados |
| **Lucide React** | Ícones SVG modernos e consistentes |
| **Recharts** | Gráficos responsivos e customizáveis |
| **next-themes** | Sistema de temas dark/light |

### Formulários & Validação

| Pacote | Propósito |
|--------|-----------|
| **React Hook Form** | Gerenciamento de formulários performático |
| **Zod** | Validação de schemas TypeScript-first |
| **@hookform/resolvers** | Integração RHF + Zod |

### Utilitários

| Pacote | Propósito |
|--------|-----------|
| **clsx** + **tailwind-merge** | Merge inteligente de classes CSS |
| **date-fns** | Manipulação de datas |
| **class-variance-authority** | Variantes de componentes tipo-safe |

---

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
📁 Smart Wallet PWA/
├── 📁 app/                          # Next.js App Router
│   ├── 📄 layout.tsx               # Root layout com providers
│   ├── 📄 page.tsx                 # Página inicial → DashboardView
│   ├── 📄 globals.css              # Estilos globais + variáveis CSS
│   └── 📁 login/                   # Página de autenticação
│       └── 📄 page.tsx
│
├── 📁 components/                   # Componentes React
│   ├── 📄 dashboard-view.tsx       # Layout principal com navegação
│   ├── 📄 spending-dashboard.tsx   # Dashboard com gráficos e estatísticas
│   ├── 📄 transactions-list.tsx    # Lista de transações com CRUD
│   ├── 📄 goals-tracker.tsx        # Gerenciamento de metas
│   ├── 📄 gamification-panel.tsx   # Sistema de gamificação
│   ├── 📄 user-profile.tsx         # Perfil e configurações
│   ├── 📄 onboarding.tsx           # Tutorial interativo
│   ├── 📄 add-transaction-dialog.tsx  # Modal para adicionar transação
│   ├── 📄 language-selector.tsx    # Seletor de idioma
│   │
│   └── 📁 ui/                       # Componentes shadcn/ui (59 componentes)
│       ├── 📄 button.tsx
│       ├── 📄 dialog.tsx
│       ├── 📄 form.tsx
│       ├── 📄 input.tsx
│       ├── 📄 select.tsx
│       ├── 📄 card.tsx
│       ├── 📄 chart.tsx
│       └── ... (56 outros componentes)
│
├── 📁 lib/                          # Lógica de negócio e utilitários
│   ├── 📁 config/
│   │   └── 📄 api.ts               # Configuração de endpoints da API
│   │
│   ├── 📁 context/
│   │   └── 📄 user-context.tsx     # Context API para dados do usuário
│   │
│   ├── 📁 i18n/                     # Sistema de internacionalização
│   │   ├── 📄 types.ts             # Tipos TypeScript para traduções
│   │   ├── 📄 context.tsx          # Provider de idioma
│   │   ├── 📄 index.ts             # Exports
│   │   └── 📁 translations/
│   │       ├── 📄 en.ts            # Traduções em inglês
│   │       └── 📄 pt.ts            # Traduções em português
│   │
│   ├── 📁 services/                 # Camada de serviços (API calls)
│   │   ├── 📄 api-client.ts        # Cliente HTTP com interceptors
│   │   ├── 📄 auth.service.ts      # Autenticação (login, register, logout)
│   │   ├── 📄 transaction.service.ts  # CRUD de transações
│   │   ├── 📄 goal.service.ts      # CRUD de metas
│   │   ├── 📄 user.service.ts      # Perfil do usuário
│   │   ├── 📄 friend.service.ts    # Sistema de amigos
│   │   └── 📄 index.ts             # Barrel exports
│   │
│   ├── 📁 types/
│   │   └── 📄 user.ts              # Tipos de usuário, amigos, etc
│   │
│   └── 📄 utils.ts                  # Função cn() para merge de classes
│
├── 📁 hooks/                        # Custom React Hooks
│   ├── 📄 use-toast.ts             # Sistema de notificações toast
│   └── 📄 use-mobile.ts            # Detecção de viewport mobile
│
├── 📁 public/                       # Assets estáticos
│
├── 📄 package.json                  # Dependências e scripts
├── 📄 pnpm-lock.yaml                # Lock file do pnpm
├── 📄 tsconfig.json                 # Configuração TypeScript
├── 📄 next.config.mjs               # Configuração Next.js
├── 📄 postcss.config.mjs            # Configuração PostCSS + Tailwind
├── 📄 components.json               # Configuração shadcn/ui
├── 📄 .env.local                    # Variáveis de ambiente (não commitado)
│
└── 📄 CLAUDE.md                     # Documentação de arquitetura completa
```

### Padrões de Arquitetura

#### 1. **Gerenciamento de Estado**
- **Local:** `useState` para estado de componente
- **Global:** React Context API (`UserContext`, `LanguageContext`)
- **Server:** React Server Components (infraestrutura pronta)

#### 2. **Camada de Serviços**
```typescript
// Padrão de serviço
export const transactionService = {
  async list(filters?: TransactionFilters): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>('/transactions', { params: filters })
  },
  async create(data: CreateTransactionData): Promise<Transaction> {
    return apiClient.post<Transaction>('/transactions', data)
  },
  async update(id: string, data: Partial<CreateTransactionData>): Promise<Transaction> {
    return apiClient.put<Transaction>(`/transactions/${id}`, data)
  },
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/transactions/${id}`)
  }
}
```

#### 3. **Sistema de Callbacks para Performance**
```typescript
// Padrão de atualização sem remontagem de componentes
const handleTransactionChange = () => {
  setRefreshTrigger(prev => prev + 1) // Trigger sem remontagem
}

<SpendingDashboard refreshTrigger={refreshTrigger} />
<TransactionsList onTransactionChange={handleTransactionChange} />
<AddTransactionDialog onSuccess={handleTransactionChange} />
```

#### 4. **Internacionalização**
```typescript
const { t, language, setLanguage } = useLanguage()

<h1>{t.dashboard.title}</h1>
<p>{t.dashboard.subtitle}</p>
```

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento (localhost:3000)

# Produção
pnpm build        # Cria build otimizado para produção
pnpm start        # Inicia servidor de produção

# Qualidade de Código
pnpm lint         # Executa ESLint para análise de código
```

---

## 🔌 Configuração do Backend

### Opção 1: Desenvolver sem Backend (Recomendado para UI)

Use o modo mock configurando `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK=true
```

### Opção 2: Conectar a um Backend Real

1. **Configure o CORS no seu backend**

Consulte [BACKEND_CORS_EXAMPLE.md](./BACKEND_CORS_EXAMPLE.md) para exemplos de:
- Express.js (Node.js)
- FastAPI (Python)
- NestJS (TypeScript)
- Spring Boot (Java)

2. **Configure a URL da API**
```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. **Estrutura de Endpoints Esperada**

O frontend espera os seguintes endpoints REST:

**Autenticação:**
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login (retorna JWT)
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/me` - Obter usuário atual

**Transações:**
- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Deletar transação
- `GET /api/transactions/stats` - Obter estatísticas

**Metas:**
- `GET /api/goals` - Listar metas
- `POST /api/goals` - Criar meta
- `PUT /api/goals/:id` - Atualizar meta
- `DELETE /api/goals/:id` - Deletar meta
- `POST /api/goals/:id/contribute` - Adicionar contribuição

**Usuário:**
- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil
- `DELETE /api/users/profile` - Deletar conta

**Amigos:**
- `GET /api/friends` - Listar amigos
- `POST /api/friends/add` - Adicionar amigo
- `DELETE /api/friends/:id` - Remover amigo
- `GET /api/friends/invites` - Listar convites
- `POST /api/friends/invites/:id/accept` - Aceitar convite
- `POST /api/friends/invites/:id/decline` - Recusar convite

**Gamificação:**
- `GET /api/gamification/achievements` - Listar conquistas
- `GET /api/gamification/leaderboard` - Obter ranking
- `GET /api/gamification/challenges` - Listar desafios

---

## 🌍 Internacionalização

### Idiomas Suportados

- 🇧🇷 **Português (PT-BR)** - Padrão
- 🇺🇸 **English (EN)** - Disponível

### Adicionar Novo Idioma

1. **Crie o arquivo de traduções**
```bash
touch lib/i18n/translations/es.ts  # Espanhol, por exemplo
```

2. **Adicione as traduções**
```typescript
// lib/i18n/translations/es.ts
import type { Translations } from "../types"

export const es: Translations = {
  common: {
    cancel: "Cancelar",
    save: "Guardar",
    // ... resto das traduções
  },
  // ... outras seções
}
```

3. **Registre o idioma**
```typescript
// lib/i18n/context.tsx
import { es } from "./translations/es"

const translations = {
  en,
  pt,
  es, // Adicione aqui
}
```

4. **Atualize o tipo**
```typescript
// lib/i18n/types.ts
export type Language = "en" | "pt" | "es"
```

### Usar Traduções em Componentes

```typescript
import { useLanguage } from "@/lib/i18n"

function MyComponent() {
  const { t, language, setLanguage } = useLanguage()

  return (
    <div>
      <h1>{t.dashboard.title}</h1>
      <button onClick={() => setLanguage("en")}>
        English
      </button>
    </div>
  )
}
```

---

## 🎨 Customização de Tema

### Cores

O projeto usa **OKLch color space** para cores perceptualmente uniformes. Edite em `app/globals.css`:

```css
:root {
  --primary: oklch(0.65 0.25 285);      /* Roxo principal */
  --accent: oklch(0.75 0.20 130);       /* Verde accent */
  --destructive: oklch(0.55 0.22 25);   /* Vermelho destrutivo */
  /* ... outras cores */
}
```

### Componentes

Todos os componentes UI usam **Class Variance Authority (CVA)** para variantes:

```typescript
// Exemplo: components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        // ... outras variantes
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      }
    }
  }
)
```

---

## 📦 Build para Produção

### Build Otimizado

```bash
pnpm build
```

Isso cria uma build otimizada em `.next/`:
- Code splitting automático
- Minificação e compressão
- Otimização de imagens
- Tree shaking de dependências

### Executar Build de Produção

```bash
pnpm start
```

### Deploy

O projeto está pronto para deploy em:
- **Vercel** (recomendado) - Deploy automático via Git
- **Netlify** - Suporta Next.js
- **Docker** - Containerização disponível
- **Node.js Server** - Qualquer servidor Node.js

**Variáveis de Ambiente para Produção:**
```env
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
NEXT_PUBLIC_USE_MOCK=false
```


## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. **Fork o projeto**
2. **Crie uma branch** para sua feature
   ```bash
   git checkout -b feature/MinhaNovaFeature
   ```
3. **Commit suas mudanças**
   ```bash
   git commit -m 'feat: Adiciona MinhaNovaFeature'
   ```
4. **Push para a branch**
   ```bash
   git push origin feature/MinhaNovaFeature
   ```
5. **Abra um Pull Request**

### Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação de código
- `refactor:` Refatoração de código
- `test:` Adicionar testes
- `chore:` Manutenção

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🐛 Problemas Conhecidos

- Gráficos podem não renderizar corretamente em viewports < 320px
- Service Worker do PWA ainda não implementado
- Fallback para modo mock pode ter delay inicial

---

## 👨‍💻 Autor

**Klleriston Andrade**
