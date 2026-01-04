# 🔐 Configuração de Autenticação - Supabase

## ✅ Implementação Concluída!

A autenticação foi implementada no app. Agora você precisa habilitar no Supabase Dashboard.

## 📋 Passos para Habilitar Autenticação:

### 1. Habilite o Provider de Email no Supabase

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Authentication** > **Providers** (no menu lateral)
4. Encontre **Email** na lista
5. Clique para expandir e habilite:
   - ✅ **Enable Email provider**
   - ✅ **Confirm email** (recomendado para produção)
6. Clique em **Save**

### 2. (Opcional) Configure Email Templates

1. Vá em **Authentication** > **Email Templates**
2. Você pode personalizar os templates de:
   - Confirmação de email
   - Reset de senha
   - Mudança de email
   - Magic Link

### 3. Configure Site URL (Importante!)

1. Vá em **Authentication** > **URL Configuration**
2. Configure:
   - **Site URL**: `http://localhost:3000` (para desenvolvimento)
   - **Redirect URLs**: Adicione:
     - `http://localhost:3000`
     - `http://localhost:3001` (caso use porta diferente)
     - URL do seu site em produção (quando fizer deploy)

### 4. (Opcional) Configure Outros Providers

Você pode habilitar:
- **Google**: Para login com conta Google
- **GitHub**: Para login com conta GitHub
- **Magic Link**: Login sem senha (envia link por email)

Para cada um:
1. Vá em **Authentication** > **Providers**
2. Clique no provider desejado
3. Siga as instruções para configurar as credenciais

---

## 🎯 Como Usar no App:

### Registrar Nova Conta:
1. Clique no ícone de login (👤) no canto superior direito
2. Vá na aba "Registrar"
3. Digite email e senha (mínimo 6 caracteres)
4. Clique em "Criar Conta"
5. Verifique seu email e clique no link de confirmação

### Fazer Login:
1. Clique no ícone de login (👤)
2. Digite email e senha
3. Clique em "Entrar"

### Sair:
1. Clique no ícone de usuário no topo
2. Clique em "Sair"

---

## ✨ Funcionalidades Implementadas:

- ✅ Login com email e senha
- ✅ Registro de nova conta
- ✅ Logout
- ✅ Migração automática de dados do guest para usuário ao fazer login
- ✅ Sincronização de dados entre dispositivos (quando logado)
- ✅ Interface de autenticação integrada

---

## 🔄 Migração de Dados:

Quando você faz login pela primeira vez:
1. Os dados salvos como "guest" são automaticamente migrados
2. Agora seus dados estão vinculados à sua conta
3. Você pode acessá-los de qualquer dispositivo logado na mesma conta

---

## ⚠️ Importante:

### Para Produção:
1. Configure **Site URL** correta no Supabase
2. Habilite **Confirm email** (recomendado)
3. Configure templates de email personalizados
4. Teste o fluxo completo de autenticação

### Segurança:
- Senhas são armazenadas com hash seguro no Supabase
- Tokens de autenticação são gerenciados automaticamente
- Row Level Security (RLS) protege seus dados

---

## 🐛 Solução de Problemas:

### Erro ao criar conta:
- Verifique se o provider de Email está habilitado
- Verifique se o email não está já cadastrado
- Certifique-se que a senha tem pelo menos 6 caracteres

### Email de confirmação não chega:
- Verifique a pasta de spam
- Verifique se **Confirm email** está configurado corretamente
- No desenvolvimento, você pode desabilitar confirmação temporariamente

### Erro ao fazer login:
- Verifique se o email foi confirmado (se necessário)
- Verifique se a senha está correta
- Verifique o console do navegador para erros

---

## 📚 Recursos:

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Configuração de Email](https://supabase.com/docs/guides/auth/auth-smtp)
- [Providers Disponíveis](https://supabase.com/docs/guides/auth/social-login)

---

**🎉 Autenticação implementada e pronta para usar!**

