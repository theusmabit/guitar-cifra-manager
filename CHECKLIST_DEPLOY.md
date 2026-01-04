# ✅ Checklist de Deploy na Vercel

## Antes do Deploy

### 1. Código no GitHub
- [ ] Repositório criado no GitHub
- [ ] Código commitado e enviado (push)
- [ ] Repositório conectado na Vercel

### 2. Variáveis de Ambiente na Vercel
- [x] `NEXT_PUBLIC_SUPABASE_URL` configurada
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- [ ] Variáveis configuradas para Production, Preview e Development

### 3. Configuração no Supabase
- [ ] URL da Vercel adicionada nas Redirect URLs
  - Site URL: `https://seu-projeto.vercel.app`
  - Redirect URLs: `https://seu-projeto.vercel.app`

### 4. Build Local
- [ ] Testar build localmente: `npm run build`
- [ ] Verificar se não há erros

---

## Durante o Deploy

- [ ] Clicar em "Deploy" na Vercel
- [ ] Aguardar build completar
- [ ] Verificar se build foi bem-sucedido

---

## Após o Deploy

### Verificação Básica
- [ ] App carrega corretamente
- [ ] Não há erros no console do navegador
- [ ] Página inicial aparece

### Testes Funcionais
- [ ] Login/Registro funciona
- [ ] Adicionar música funciona
- [ ] Dados são salvos no Supabase
- [ ] Pastas funcionam
- [ ] Importar/Exportar funciona

### Configuração Final no Supabase
- [ ] Verificar logs de autenticação (se necessário)
- [ ] Verificar se dados aparecem no Table Editor

---

## ⚠️ IMPORTANTE: Atualizar URLs no Supabase

Após obter a URL do seu app na Vercel, você DEVE:

1. Ir no Supabase Dashboard
2. Vá em **Authentication** > **URL Configuration**
3. Atualize:
   - **Site URL**: `https://seu-projeto.vercel.app`
   - **Redirect URLs**: Adicione `https://seu-projeto.vercel.app`

**Isso é ESSENCIAL para a autenticação funcionar em produção!**

---

## 🎯 Próximo Passo Agora

**Se você ainda não fez o deploy:**

1. Vá na Vercel
2. Clique em **"Deploy"**
3. Aguarde o build
4. Copie a URL do app
5. Atualize as URLs no Supabase (veja acima)

**Se já fez o deploy:**

1. Acesse a URL do seu app
2. Teste todas as funcionalidades
3. Se autenticação não funcionar, atualize as URLs no Supabase
4. Faça um novo deploy se necessário

---

## 🐛 Problemas Comuns

### Build Falhou
- Verifique os logs na Vercel
- Certifique-se que todas as dependências estão no package.json
- Teste build local: `npm run build`

### Autenticação Não Funciona
- ⚠️ **Verifique as URLs no Supabase** (mais comum)
- Verifique se as variáveis de ambiente estão corretas
- Verifique se o provider de Email está habilitado

### Erro 500 ou App Não Carrega
- Verifique os logs na Vercel
- Verifique o console do navegador
- Verifique se as variáveis de ambiente foram configuradas

---

**Status Atual:** Variáveis de ambiente configuradas ✅
**Próximo:** Fazer deploy e atualizar URLs no Supabase

