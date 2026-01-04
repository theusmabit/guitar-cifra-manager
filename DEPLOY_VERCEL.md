# 🚀 Como Hospedar o CifraPobre na Vercel

## 📋 Pré-requisitos

1. ✅ Conta no GitHub (ou GitLab/Bitbucket)
2. ✅ Conta na Vercel (gratuita)
3. ✅ Projeto no Supabase configurado
4. ✅ Código commitado no repositório Git

---

## 🔧 Passo 1: Preparar o Repositório

### 1.1 Inicializar Git (se ainda não fez)

```bash
# Na pasta do projeto
cd guitar-tabs-manager-mainzip

# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit - CifraPobre"
```

### 1.2 Criar Repositório no GitHub

1. Acesse https://github.com
2. Clique em **"New repository"**
3. Escolha um nome (ex: `cifrapobre`)
4. **NÃO** marque "Initialize with README" (se já tem código)
5. Clique em **"Create repository"**

### 1.3 Conectar Repositório Local ao GitHub

```bash
# Adicione o remote (substitua SEU_USUARIO e NOME_REPO)
git remote add origin https://github.com/SEU_USUARIO/NOME_REPO.git

# Envie o código
git branch -M main
git push -u origin main
```

---

## 🌐 Passo 2: Fazer Deploy na Vercel

### 2.1 Criar Conta na Vercel

1. Acesse https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"** (recomendado)
4. Autorize a Vercel a acessar seus repositórios

### 2.2 Importar Projeto

1. No dashboard da Vercel, clique em **"Add New..."** > **"Project"**
2. Selecione seu repositório do GitHub
3. Clique em **"Import"**

### 2.3 Configurar o Projeto

A Vercel detectará automaticamente que é um projeto Next.js. Você verá:

**Framework Preset:** Next.js (detectado automaticamente)

**Root Directory:** `./` (deixe como está)

**Build Command:** `npm run build` (já configurado)

**Output Directory:** `.next` (já configurado)

**Install Command:** `npm install` (já configurado)

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Adicionar Variáveis na Vercel

**IMPORTANTE:** Antes de fazer deploy, configure as variáveis de ambiente!

1. Na página de configuração do projeto, vá em **"Environment Variables"**
2. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-do-supabase
```

**Como obter os valores:**
- Acesse https://app.supabase.com
- Selecione seu projeto
- Vá em **Settings** > **API**
- Copie:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3.2 Configurar para Todos os Ambientes

Certifique-se de que as variáveis estão configuradas para:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

---

## ⚙️ Passo 4: Configurações Adicionais

### 4.1 Atualizar Site URL no Supabase

**IMPORTANTE:** Configure a URL do seu site no Supabase!

1. No Supabase Dashboard, vá em **Authentication** > **URL Configuration**
2. Adicione sua URL da Vercel em **Redirect URLs**:
   - `https://seu-projeto.vercel.app`
   - `https://seu-dominio.com` (se tiver domínio customizado)

### 4.2 (Opcional) Configurar Domínio Personalizado

1. Na Vercel, vá em **Settings** > **Domains**
2. Adicione seu domínio
3. Siga as instruções para configurar DNS
4. Atualize as URLs no Supabase com o novo domínio

---

## 🚀 Passo 5: Fazer Deploy

1. Clique em **"Deploy"** na Vercel
2. Aguarde o build (pode levar 1-3 minutos)
3. Quando terminar, você verá:
   - ✅ **Deployment successful**
   - Um link: `https://seu-projeto.vercel.app`

---

## ✅ Passo 6: Verificar se Funcionou

1. Acesse o link fornecido pela Vercel
2. Teste o app:
   - Tente fazer login
   - Adicione uma música
   - Verifique se os dados aparecem no Supabase

---

## 🔄 Atualizações Futuras

A Vercel faz **deploy automático** quando você faz push no GitHub!

### Como atualizar o app:

```bash
# Faça suas alterações no código
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

A Vercel detectará automaticamente e fará um novo deploy! 🎉

---

## 🐛 Solução de Problemas

### Erro: "Environment variables not found"

**Solução:**
- Verifique se adicionou as variáveis na Vercel
- Certifique-se que começam com `NEXT_PUBLIC_`
- Faça um novo deploy após adicionar variáveis

### Erro: "Build failed"

**Solução:**
- Verifique os logs de build na Vercel
- Certifique-se que todas as dependências estão no `package.json`
- Verifique se não há erros de TypeScript

### App não conecta ao Supabase

**Solução:**
- Verifique se as variáveis de ambiente estão corretas
- Verifique se a URL do Supabase está na lista de Redirect URLs
- Verifique o console do navegador para erros

### Erro de autenticação

**Solução:**
- Adicione a URL da Vercel nas Redirect URLs do Supabase
- Verifique se o provider de Email está habilitado
- Verifique os logs de autenticação no Supabase Dashboard

---

## 📊 Monitoramento

### Ver Logs

1. Na Vercel, vá em **Deployments**
2. Clique em um deployment
3. Veja os logs de build e runtime

### Analytics

A Vercel fornece analytics gratuitos:
- Visualizações de página
- Performance
- Erros

---

## 💰 Planos da Vercel

### Hobby (Gratuito)
- ✅ Deploy ilimitado
- ✅ 100GB de bandwidth
- ✅ Domínios personalizados
- ✅ SSL automático
- ✅ Deploy automático do GitHub

**Perfeito para projetos pessoais!**

---

## 📝 Checklist Final

Antes de fazer deploy, verifique:

- [ ] Código commitado no GitHub
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Site URL configurada no Supabase
- [ ] Redirect URLs configuradas no Supabase
- [ ] Build local funciona (`npm run build`)
- [ ] Testado localmente com `.env.local`

---

## 🎉 Pronto!

Seu app estará online em poucos minutos!

**URL do app:** `https://seu-projeto.vercel.app`

**Próximos passos:**
- Compartilhe o link com seus usuários
- Configure um domínio personalizado (opcional)
- Monitore os logs e analytics

---

## 📚 Recursos Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js na Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variáveis de Ambiente](https://vercel.com/docs/environment-variables)
- [Domínios Personalizados](https://vercel.com/docs/domains)

---

**🚀 Boa sorte com o deploy!**

