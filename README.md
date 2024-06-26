# App

Beaba style app.

## RFs (Requisitos funcionais)

- [ x ] Deve ser possível cadastrar um usuário;
- [ x ] Deve ser possível se autenticar;
- [ x ] Deve ser possível cadastrar um perfil;
- [ x ] Deve ser possível cadastrar um módulo;
- [ x ] Deve ser possível cadastrar uma transação;
- [ x ] Deve ser possível cadastrar uma função;
- [ x ] Deve ser possível obter o perfil de um usuário logado;
- [ x ] Deve ser possível obter o número de usuários cadastrados;
- [ ] Deve ser possível o usuário obter a lista de usuários cadastrados;
- [ ] Deve ser possível o usuário obter a lista de perfis cadastrados;
- [ ] Deve ser possível o usuário obter a lista de módulos cadastrados;
- [ ] Deve ser possível o usuário obter a lista de transações cadastradas;
- [ ] Deve ser possível o usuário obter a lista de funções cadastradas;
- [ x ] Deve ser possível o usuário buscar usuários pelo id;
- [ x ] Deve ser possível o usuário buscar usuários pelo nome;

## RNs (Regras de negócio)

- [ x ] O admin não deve poder cadastrar com um e-mail duplicado;
- [ ] O cadastro só pode ser feito por administradores;

## RNFs (Requisitos não-funcionais)

- [ x ] A senha do usuário precisa estar criptografada;
- [ x ] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [ x ] Todas listas de dados precisam estar paginadas com 10 itens por página;
- [ x ] O usuário deve ser identificado por um JWT (JSON Web Token);

## Icons

```js
import { RiAccountCircleLine } from "react-icons/ri";
import { RiAddCircleLine } from "react-icons/ri";
import { RiHome3Line } from "react-icons/ri";
import { RiMenuFill } from "react-icons/ri";
import { RiCloseFill } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiSearchLine } from "react-icons/ri";
import { RiUserLine } from "react-icons/ri";
import { RiLogoutBoxLine } from "react-icons/ri";
import { RiEdit2Line } from "react-icons/ri";

import { RiArchiveDrawerLine } from "react-icons/ri";
import { RiArticleLine } from "react-icons/ri";
import { RiBallPenLine } from "react-icons/ri";
import { RiFunctionLine } from "react-icons/ri";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { RiDraftLine } from "react-icons/ri";
import { RiFolderUserLine } from "react-icons/ri";
import { RiFormula } from "react-icons/ri";
import { RiIdCardLine } from "react-icons/ri";
```

## Comandos

```sh
    npm init -y
    npm install typescript @types/node tsx tsup -D
    npx tsc --init
    npm install express
    ou
    npm install fastify

    cp .env.example .env
    npm install dotenv
    process.env.NODE_ENV
    npm install zod

    npm install eslint @rocketseat/eslint-config -D

    npm install prisma -D
    npx prisma -h
    npx prisma init
    npx prisma generate
    npm install @prisma/client

    docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=apisolid -p 5436:5432 -d -t bitnami/postgresql


    docker run --name postgres -e POSTGRES_PASSWORD=docker -p 5436:5436 -d -t bitnami/postgres

    docker ps
    docker ps -a
    docker start api-solid-pg

    docker stop api-solid-pg
    docker rm api-solid-pg

    docker logs api-solid-pg
    docker logs api-solid-pg -f

    npx prisma migrate dev
    npx prisma studio

    docker compose up -d

    docker compose down # deleta o container, não é bom usar
    docker compose stop

    npx prisma migrate deploy # melhor usar o dev

    npm install bcryptjs
    npm install -D @types/bcryptjs

    npm install vitest vite-tsconfig-paths -D

    npm install -D @vitest/ui
```

TDD -> Test-driven development -> Desenvolvimento dirigido a testes

red -> erro no teste

green -> codar o mínimo possível para o teste passar

refactor -> refatoro

Mocking -> vitest

vi.useFakeTimers()

afterEach(() =>{
vi.useRealTimers()
})

opcional para testes com datas

```sh
 npm install dayjs
```

date -> dia
day -> dia da semana

isso dentro de um repositório inMemory com um findByUserIdOnDate
ver código do projeto Gympass, caso necessário
const startOfTheDay = dayjs(date).startOf("date");

## Nomenclaturas de busca

Fetch -> mais de uma informação, uma lista

Get -> uma informação

## JWT: JSON Web Token

Usuário faz login, email/senha, o backend cria um token UNICO,
não modificável e STATELESS

Stateless: Não armazenado em nenhuma estrutura de persistência de dados( BD)

Backend: Quando vai criar o token ele usa uma PALAVRA-CHAVE (string)

Palavra-chave: ufbqwofgbqq3gp2bpbgq3pqwbgqipbqwpfbqw

Email/senha -> header.payload.sign

Login => JWT

JWT => Todas requisições dali pra frente
Header(cabeçalho): Authorization: Bearer JWT

```sh
    npm install @fastify/jwt
    npm install -D npm-run-all
    npm install supertest -D
    npm install @types/supertest -D
```

CI = Continuous Integration
CD = Continuous Deployment/Delivery

Github Actions -> Precisa ter o backend como raiz para funcionar,
ou seja, precisa criar no github, um projeto para o backend e um para o front

Deploy:

Versão antiga, não usar esse!!!
tsconfig.json
habilitar "rootDir": "./src",
e "outDir": "./build",

```sh
    npx tsc
```

Essas ferramentas são lentas!!!

USAR:

```sh
    npm install tsup -D
```

Em package.json, colocar o script:

"build": "tsup src --out-dir build",

npm run build

Caso precise integrar com o front-end, você deve ter se deparado com o refreshToken não
sendo setado nos cookies do navegador, para resolver esse problema, ilustraremos a solução
utilizando o Axios:

```js
// No servidor, adicione a propriedade credentials como true:
app.register(cors, {
  origin: true,
  credentials: true,
});

// No create ou nas requisições do Axios, adicione o withCredentials como true:
const response = await request(app.server)
  .post(`/profiles/${module.id_modulo}/modules`)
  .set("Authorization", `Bearer ${token}`)
  .send({
    nome_perfil: "teste",
  });
```

## Refresh Token

```sh
 npm install @fastify/cookie

```

## Integrando Front e Backend

```sh
  npm install fastify-cors
```
