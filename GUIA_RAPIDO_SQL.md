# 🚀 Guia Rápido: Executar Schema SQL no Supabase

## Passo a Passo Visual

### 1️⃣ Acesse o Supabase Dashboard
- Abra: https://app.supabase.com
- Faça login na sua conta
- Selecione o projeto que você criou

### 2️⃣ Abra o SQL Editor
- No menu lateral esquerdo, procure por **"SQL Editor"**
- Clique nele
- Clique no botão **"New query"** (ou use o atalho: Ctrl+K)

### 3️⃣ Cole o Script SQL
- Copie TODO o conteúdo do arquivo `supabase/schema.sql`
- Cole no editor SQL do Supabase

### 4️⃣ Execute o Script
- Clique no botão **"Run"** (geralmente no canto superior direito)
- OU pressione: `Ctrl+Enter` (Windows) ou `Cmd+Enter` (Mac)

### 5️⃣ Verifique o Resultado
Você deve ver uma mensagem de sucesso. Depois:

**Verificar se as tabelas foram criadas:**
1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver 2 tabelas:
   - ✅ `songs`
   - ✅ `folders`

**Se aparecer algum erro:**
- Leia a mensagem de erro
- Pode ser que as tabelas já existam (se sim, tudo bem, o script usa `CREATE TABLE IF NOT EXISTS`)
- Pode ser problema de permissões (verifique se está logado)

---

## 📋 O que o Script Faz:

1. ✅ Cria a tabela `songs` com todos os campos necessários
2. ✅ Cria a tabela `folders` com todos os campos necessários
3. ✅ Cria índices para melhor performance
4. ✅ Configura Row Level Security (RLS) para segurança
5. ✅ Cria políticas de segurança para cada tabela
6. ✅ Cria triggers para atualizar timestamps automaticamente

---

## ⚠️ Importante:

- O script pode ser executado múltiplas vezes sem problemas (usa `IF NOT EXISTS`)
- Se você ver erros sobre "already exists", pode ignorar - as tabelas já foram criadas
- Após executar, AGUARDE alguns segundos para o Supabase processar

---

## ✅ Depois de Executar:

1. Reinicie o servidor: `npm run dev`
2. Teste adicionando uma música no app
3. Verifique se aparece na tabela `songs` do Supabase

