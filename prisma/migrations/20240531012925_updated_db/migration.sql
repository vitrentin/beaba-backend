/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nome_usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "perfis" (
    "id_perfil" SERIAL NOT NULL,
    "nome_perfil" TEXT NOT NULL,

    CONSTRAINT "perfis_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "modulos" (
    "id_modulo" SERIAL NOT NULL,
    "nome_modulo" TEXT NOT NULL,
    "descricao_modulo" TEXT,

    CONSTRAINT "modulos_pkey" PRIMARY KEY ("id_modulo")
);

-- CreateTable
CREATE TABLE "transacoes" (
    "id_transacao" SERIAL NOT NULL,
    "nome_transacao" TEXT NOT NULL,
    "descricao_transacao" TEXT,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id_transacao")
);

-- CreateTable
CREATE TABLE "funcoes" (
    "id_funcao" SERIAL NOT NULL,
    "nome_funcao" TEXT NOT NULL,
    "descricao_funcao" TEXT,

    CONSTRAINT "funcoes_pkey" PRIMARY KEY ("id_funcao")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_id_usuario_key" ON "usuarios"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_id_perfil_key" ON "perfis"("id_perfil");

-- CreateIndex
CREATE UNIQUE INDEX "modulos_id_modulo_key" ON "modulos"("id_modulo");

-- CreateIndex
CREATE UNIQUE INDEX "transacoes_id_transacao_key" ON "transacoes"("id_transacao");

-- CreateIndex
CREATE UNIQUE INDEX "funcoes_id_funcao_key" ON "funcoes"("id_funcao");
