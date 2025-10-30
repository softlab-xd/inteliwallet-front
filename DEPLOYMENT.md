

## Configuração Inicial

### 1. Login e Configuração do gcloud

```bash
# Fazer login
gcloud auth login

# Configurar o projeto (substitua SEU_PROJECT_ID)
gcloud config set project SEU_PROJECT_ID

# Habilitar as APIs necessárias
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Configurar Variáveis de Ambiente

Se sua aplicação precisa de variáveis de ambiente em produção, você tem duas opções:

#### Opção A: Build Args no Dockerfile
Edite o `cloudbuild.yaml` e adicione as variáveis no step de build:

```yaml
- name: 'gcr.io/cloud-builders/docker'
  args:
    - 'build'
    - '--build-arg'
    - 'NEXT_PUBLIC_API_URL=https://inteliwallet-api-1040990578531.us-central1.run.app/api'
    - '-t'
    - 'gcr.io/$PROJECT_ID/inteliwallet-front:$COMMIT_SHA'
    - '.'
```

#### Opção B: Variáveis de Ambiente no Cloud Run
Configure após o deploy:

```bash
gcloud run services update inteliwallet-front \
  --region us-central1 \
  --set-env-vars "NEXT_PUBLIC_API_URL=https://sua-api.com"
```

### 3. Configurar Região (Opcional)

O deploy padrão é para `us-central1`. Para mudar a região, edite o `cloudbuild.yaml`:

```yaml
- '--region'
- 'southamerica-east1'  # São Paulo
```

## Deploy Manual

### Build e Deploy Local

```bash
# Build local da imagem Docker
docker build -t inteliwallet-front .

# Testar localmente
docker run -p 3000:3000 inteliwallet-front
```

### Deploy via Cloud Build

```bash
# Enviar build para o GCP
gcloud builds submit --config cloudbuild.yaml .

# Ver logs do build
gcloud builds list
gcloud builds log BUILD_ID
```

## CI/CD Automático

### Configurar Cloud Build Trigger

1. **Via Console GCP**:
   - Acesse Cloud Build > Triggers
   - Clique em "Create Trigger"
   - Conecte seu repositório (GitHub/GitLab/Bitbucket)
   - Configure:
     - Nome: `inteliwallet-deploy`
     - Event: Push to branch
     - Branch: `^main$`
     - Configuration: `cloudbuild.yaml`

2. **Via gcloud CLI**:

```bash
# Para GitHub
gcloud builds triggers create github \
  --repo-name=inteliwallet-front \
  --repo-owner=SEU_USUARIO \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml

# Para Cloud Source Repositories
gcloud builds triggers create cloud-source-repositories \
  --repo=inteliwallet-front \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### Fluxo de Deploy Automático

Após configurar o trigger, cada push para a branch `main` irá:

1. Instalar dependências com `--legacy-peer-deps`
2. Executar linting
3. Fazer build da aplicação Next.js
4. Criar imagem Docker
5. Enviar para Container Registry
6. Deploy no Cloud Run

## Configurações Adicionais

### Ajustar Recursos do Cloud Run

Edite o `cloudbuild.yaml` no step de deploy:

```yaml
- '--max-instances'
- '20'              # Máximo de instâncias
- '--memory'
- '1Gi'             # Memória por instância
- '--cpu'
- '2'               # CPUs por instância
- '--concurrency'
- '80'              # Requisições simultâneas
```

### Configurar Domínio Customizado

```bash
# Mapear domínio customizado
gcloud run domain-mappings create \
  --service inteliwallet-front \
  --domain seu-dominio.com \
  --region us-central1
```

### Habilitar HTTPS e SSL

O Cloud Run já vem com HTTPS habilitado por padrão. Para domínios customizados, o certificado SSL é provisionado automaticamente.

## Monitoramento

### Ver logs da aplicação

```bash
# Logs do Cloud Run
gcloud run services logs read inteliwallet-front \
  --region us-central1 \
  --limit 50

# Logs do Cloud Build
gcloud builds log BUILD_ID
```

### Acessar a aplicação

```bash
# Obter URL do serviço
gcloud run services describe inteliwallet-front \
  --region us-central1 \
  --format='value(status.url)'
```

## Troubleshooting

### Build falhando

```bash
# Ver logs detalhados
gcloud builds log BUILD_ID --stream

# Testar build localmente
docker build -t test .
```

### Aplicação não inicia

```bash
# Ver logs do container
gcloud run services logs read inteliwallet-front --region us-central1

# Verificar configurações
gcloud run services describe inteliwallet-front --region us-central1
```

### Problemas com dependências

Certifique-se de que o `package-lock.json` está commitado e atualizado:

```bash
npm install --legacy-peer-deps
git add package-lock.json
git commit -m "chore: update package-lock"
```

## Custos

O Cloud Run cobra por:
- Tempo de CPU usado
- Memória usada
- Número de requisições
- Tráfego de rede

**Tier Gratuito** (por mês):
- 2 milhões de requisições
- 360.000 GB-segundos de memória
- 180.000 vCPU-segundos

## Recursos Adicionais

- [Documentação Cloud Build](https://cloud.google.com/build/docs)
- [Documentação Cloud Run](https://cloud.google.com/run/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Preços GCP](https://cloud.google.com/pricing)

## Segurança

### Secrets e Variáveis Sensíveis

**NUNCA** commite arquivos `.env` com secrets. Use Secret Manager:

```bash
# Criar secret
echo -n "valor-secreto" | gcloud secrets create API_KEY --data-file=-

# Usar no Cloud Run
gcloud run services update inteliwallet-front \
  --region us-central1 \
  --set-secrets="API_KEY=API_KEY:latest"
```

### IAM e Permissões

O Cloud Build precisa das seguintes permissões:
- Cloud Run Admin
- Service Account User
- Storage Admin (para Container Registry)

```bash
# Conceder permissões ao service account do Cloud Build
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
  --role=roles/run.admin
```

## Rollback

```bash
# Listar revisões
gcloud run revisions list --service inteliwallet-front --region us-central1

# Fazer rollback para revisão anterior
gcloud run services update-traffic inteliwallet-front \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```
