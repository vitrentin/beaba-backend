# Sistema de Gerenciamento de Acesso - Beaba-backend

## Tecnologias Utilizadas

- Node.js
- Typescript
- Fastify
- Prisma
- Docker
- Vitest
- Cors
- JWT
- Bcrypt
- Zod
- Python

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu ambiente:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org) (versão 14 ou superior)
- [Docker](https://www.docker.com)
- [Python](https://www.python.org)

## Como rodar o projeto

### 1. Clone o repositório

```sh
git clone https://github.com/vitrentin/beaba-backend.git
```

### 2. Navegue até o diretório do projeto

```sh
    cd pastaDoRepositorio
```

### 3. Instale as dependências

```sh
    npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente necessárias. Veja um exemplo:

NODE_ENV=dev
PORT=3333

JWT_SECRET=suaChaveSecreta

DATABASE_URL="postgresql://docker:docker@localhost:5436/apisolid?schema=public"

Estrutura do database, caso queira
fazer diferente:
DATABASE_URL="postgresql://user:password@localhost:5436/nomeDoBanco"

### 5. Configure o Docker

Crie um arquivo docker-compose.yml (se ainda não existir) para configurar os serviços do Docker. Veja um exemplo:

```yaml
version: "3"

services:
  api-solid-pg:
    image: bitnami/postgresql
    ports:
      - 5436:5432
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=apisolid
```

### 6. Inicie os serviços do Docker

```sh
  docker-compose up -d
```

### 7. Execute as migrações do Prisma

```sh
  npx prisma migrate dev
```

### 8. Inicie o servidor de desenvolvimento

```sh
  npm run start:dev
```

### 9. Acesse a aplicação

A API estará disponível em <http://localhost:3000>.

### 10. Scripts Disponíveis

start:dev: Inicia o servidor em modo de desenvolvimento.

start: Inicia o servidor em modo de produção.

test: Executa os testes unitários.

test:watch: Executa os testes unitários em modo de observação.

build: Compila o projeto para produção.

test:e2e: Executa os testes end-to-end.

test:coverage: Gera o relatório de cobertura dos testes
