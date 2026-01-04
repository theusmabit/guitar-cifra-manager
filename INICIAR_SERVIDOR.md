# Como iniciar/reiniciar o servidor

## No Terminal (PowerShell ou CMD)

### 1. Abrir o terminal na pasta do projeto

A pasta do projeto é: `guitar-tabs-manager-mainzip`

### 2. Comandos disponíveis:

```bash
# Iniciar o servidor de desenvolvimento
npm run dev

# Ou se estiver usando yarn
yarn dev

# Ou se estiver usando pnpm
pnpm dev
```

### 3. Para reiniciar o servidor:

1. **Pare o servidor atual**: Pressione `Ctrl + C` no terminal onde o servidor está rodando
2. **Inicie novamente**: Execute `npm run dev` novamente

### 4. Após configurar o Supabase:

Depois de criar o arquivo `.env.local` com suas credenciais do Supabase, você **precisa reiniciar o servidor** para que as variáveis de ambiente sejam carregadas.

## Dicas:

- O servidor normalmente roda em: `http://localhost:3000`
- Se a porta 3000 estiver ocupada, o Next.js usará a próxima disponível (3001, 3002, etc.)
- Você verá no terminal em qual porta o servidor está rodando

## Exemplo completo:

```bash
# 1. Navegue até a pasta do projeto (se necessário)
cd guitar-tabs-manager-mainzip

# 2. Inicie o servidor
npm run dev

# 3. Depois de configurar .env.local, pare o servidor (Ctrl+C) e reinicie
npm run dev
```

