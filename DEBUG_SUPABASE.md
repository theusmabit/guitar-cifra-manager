# 🔍 Debug - Por que os dados não estão sendo salvos no Supabase

## Passos para diagnosticar:

### 1. Abra o Console do Navegador
- Pressione `F12` no navegador
- Vá na aba **"Console"**
- Recarregue a página (F5)

### 2. Verifique as mensagens no console

Você deve ver mensagens como:
- `🔄 Tentando salvar músicas...`
- `✅ Supabase configurado` ou `⚠️ Supabase não configurado`
- `🔍 IDs: { userId: null, guestId: "guest-xxx" }`
- `💾 Inserindo músicas no Supabase...`
- `✅ Músicas salvas no Supabase com sucesso!` ou `❌ Erro ao inserir músicas:`

### 3. Se aparecer erro, copie a mensagem completa

Os erros mais comuns são:

**Erro: "new row violates row-level security policy"**
- Significa que as políticas RLS estão bloqueando
- Solução: Verifique se executou o script `update_schema.sql` corretamente

**Erro: "column 'guest_id' does not exist"**
- Significa que a coluna guest_id não foi criada
- Solução: Execute o script `update_schema.sql` novamente

**Erro: "Invalid API key" ou "JWT expired"**
- Significa que as credenciais estão incorretas
- Solução: Verifique o arquivo `.env.local`

### 4. Verifique no Supabase Dashboard

1. Vá em **Table Editor**
2. Clique na tabela **songs**
3. Veja se há alguma linha (mesmo que vazia)

### 5. Teste direto no Supabase

No SQL Editor, execute:
```sql
SELECT * FROM songs LIMIT 5;
```

Se aparecer a coluna `guest_id`, o schema está correto.

### 6. Verifique as credenciais

No console do navegador, execute:
```javascript
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurado' : 'NÃO configurado')
```

**⚠️ IMPORTANTE:** As variáveis só aparecem no console se você estiver em modo de desenvolvimento (`npm run dev`).

## Solução Rápida - Teste Manual

Abra o console (F12) e execute:

```javascript
// Isso vai tentar inserir uma música de teste
const testSong = {
  id: 'test-' + Date.now(),
  title: 'Teste',
  artist: 'Artista Teste',
  content: 'Conteúdo teste',
  key: 'C',
  is_favorite: false,
  tags: [],
  created_at_iso: new Date().toISOString(),
  user_id: null,
  guest_id: 'guest-test-123'
}

fetch('SUA_URL_SUPABASE/rest/v1/songs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'SUA_ANON_KEY',
    'Authorization': 'Bearer SUA_ANON_KEY'
  },
  body: JSON.stringify(testSong)
})
.then(r => r.json())
.then(d => console.log('Sucesso:', d))
.catch(e => console.error('Erro:', e))
```

Substitua `SUA_URL_SUPABASE` e `SUA_ANON_KEY` pelas suas credenciais do `.env.local`.

