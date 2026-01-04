# ✅ Checklist de Configuração do Supabase

## Passos Obrigatórios:

### 1. ✅ Criar projeto no Supabase
- [ ] Criou uma conta em https://supabase.com
- [ ] Criou um novo projeto no Supabase
- [ ] Anotou a URL e a chave anon (API Key)

### 2. ✅ Configurar arquivo .env.local
- [x] Arquivo criado no local correto (raiz do projeto)
- [x] Preenchido com NEXT_PUBLIC_SUPABASE_URL
- [x] Preenchido com NEXT_PUBLIC_SUPABASE_ANON_KEY

### 3. ⚠️ **IMPORTANTE: Executar o Schema SQL**
- [ ] Abriu o SQL Editor no Supabase Dashboard
- [ ] Copiou o conteúdo do arquivo `supabase/schema.sql`
- [ ] Colou e executou o script no SQL Editor
- [ ] Verificou se as tabelas `songs` e `folders` foram criadas

**Como verificar se as tabelas foram criadas:**
1. No Supabase Dashboard, vá em "Table Editor"
2. Você deve ver duas tabelas: `songs` e `folders`

### 4. ⚠️ Reiniciar o servidor de desenvolvimento
- [ ] Parou o servidor atual (Ctrl+C)
- [ ] Executou `npm run dev` novamente
- [ ] Verificou se não há erros no console

### 5. ✅ Testar a aplicação
- [ ] Abriu o app no navegador (http://localhost:3000)
- [ ] Tentou adicionar uma música
- [ ] Verificou se os dados aparecem na tabela do Supabase (Table Editor)

---

## 🚨 Passo Crítico que Você Precisa Fazer AGORA:

### Executar o Schema SQL no Supabase

**Instruções detalhadas:**

1. **Acesse o Supabase Dashboard:**
   - Vá para https://app.supabase.com
   - Selecione seu projeto

2. **Abra o SQL Editor:**
   - No menu lateral, clique em "SQL Editor"
   - Ou vá direto: https://app.supabase.com/project/[seu-projeto]/sql/new

3. **Execute o script:**
   - Abra o arquivo `supabase/schema.sql` do seu projeto local
   - Copie TODO o conteúdo do arquivo
   - Cole no SQL Editor do Supabase
   - Clique em "Run" ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verifique se funcionou:**
   - Deve aparecer uma mensagem de sucesso
   - Vá em "Table Editor" no menu lateral
   - Você deve ver 2 tabelas: `songs` e `folders`

---

## ❓ O que acontece se não executar o schema?

Se você não executar o schema SQL, o app ainda funcionará, mas:
- Os dados serão salvos apenas no localStorage do navegador
- Não haverá sincronização com o Supabase
- Você verá erros no console ao tentar salvar no Supabase

---

## 🎯 Próximos Passos Após Completar:

1. ✅ Execute o schema SQL
2. ✅ Reinicie o servidor (`npm run dev`)
3. ✅ Teste adicionando uma música no app
4. ✅ Verifique se a música aparece na tabela `songs` do Supabase

---

## 🆘 Precisa de Ajuda?

Se encontrar erros:
1. Verifique o console do navegador (F12 > Console)
2. Verifique o terminal onde o servidor está rodando
3. Verifique se as credenciais no `.env.local` estão corretas
4. Confirme que executou o schema SQL corretamente

