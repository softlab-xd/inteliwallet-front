# InteliWallet 💰

Aplicativo de carteira financeira gamificada construído com Next.js, React e TailwindCSS.

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório
```bash
git clone <seu-repositorio>
cd Smart\ Wallet\ PWA
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

4. Edite `.env.local` com suas configurações:

**Para desenvolvimento com mock (sem backend):**
```env
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Para desenvolvimento com backend:**
```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

5. Execute o projeto
```bash
npm run dev
```

6. Acesse http://localhost:3000

## 📚 Documentação

- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Referência completa da API REST
- **[BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md)** - Guia para implementar o backend com Spring Boot + PostgreSQL

## 🎮 Funcionalidades

- ✅ **Autenticação JWT** - Login e cadastro seguros
- ✅ **Onboarding Interativo** - Tutorial guiado para novos usuários
- ✅ **Gestão de Transações** - Adicione receitas e despesas
- ✅ **Metas Financeiras** - Crie e acompanhe suas metas
- ✅ **Gamificação** - Ganhe pontos, suba de nível e desbloqueie conquistas
- ✅ **Sistema de Amigos** - Compare seu progresso com amigos
- ✅ **Dashboard Analítico** - Visualize seus gastos com gráficos
- ✅ **Multi-idioma** - Suporte para PT-BR e EN
- ✅ **PWA** - Instalável como app nativo
- ✅ **Modo Mock** - Desenvolva sem backend

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI:** React 18 + TypeScript
- **Styling:** TailwindCSS + Shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **i18n:** Sistema customizado de traduções

### Backend (Recomendado)
- **Framework:** Spring Boot 3.2+
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens)
- **ORM:** Spring Data JPA

Veja [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md) para detalhes completos.

## 📁 Estrutura do Projeto

```
.
├── app/                    # Next.js App Router pages
│   ├── login/             # Página de autenticação
│   ├── page.tsx           # Dashboard principal
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── dashboard-view.tsx
│   ├── onboarding.tsx    # Tutorial para novos usuários
│   └── ...
├── lib/                   # Bibliotecas e utilitários
│   ├── config/           # Configurações da API
│   ├── context/          # React Context (estado global)
│   ├── i18n/             # Sistema de traduções
│   ├── services/         # Serviços de API
│   │   ├── api-client.ts
│   │   ├── auth.service.ts
│   │   ├── mock.service.ts   # Dados mock para dev
│   │   └── ...
│   └── types/            # TypeScript types
├── .env.example          # Template de variáveis de ambiente
├── API_INTEGRATION.md    # Documentação da API
└── BACKEND_IMPLEMENTATION.md  # Guia de implementação do backend
```

## 🔧 Modo de Desenvolvimento

### Com Dados Mock (sem backend)

Ideal para desenvolvimento de UI e testes:

1. Configure `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK=true
```

2. Os dados mock estão em `lib/services/mock.service.ts`

3. Customize os dados conforme necessário

4. O onboarding estará desabilitado por padrão. Para testá-lo, edite `mock.service.ts`:
```typescript
export const mockUser: User = {
  // ...
  hasCompletedOnboarding: false,  // Mude para false
}
```

### Com Backend Real

1. Implemente o backend seguindo [BACKEND_IMPLEMENTATION.md](./BACKEND_IMPLEMENTATION.md)

2. Configure `.env.local`:
```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. Inicie o backend

4. Inicie o frontend

## 🎨 Temas

O aplicativo usa um tema escuro/roxo moderno. Para personalizar:

- Edite `app/globals.css` para alterar as variáveis CSS
- As cores usam o formato `oklch` para melhor consistência

## 🌍 Internacionalização

Suporte para múltiplos idiomas:

- Traduções em `lib/i18n/translations/`
- Adicione novos idiomas criando arquivos (ex: `es.ts`)
- Use o hook `useLanguage()` nos componentes

## 🧪 Testes

```bash
npm run test
```

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a MIT License.

## 🐛 Problemas Conhecidos

- [ ] Mock service precisa de delay configurável
- [ ] Falta implementação de filtros avançados de transações
- [ ] Gráficos precisam ser responsivos em telas muito pequenas

## 🗺️ Roadmap

- [ ] Exportação de relatórios em PDF
- [ ] Notificações push para metas
- [ ] Modo offline completo com sync
- [ ] Categorias customizáveis
- [ ] Orçamentos mensais
- [ ] Integração com bancos (Open Banking)

---

**Desenvolvido com ❤️ para transformar finanças pessoais em uma experiência divertida!**
