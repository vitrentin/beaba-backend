/*
  Warnings:

  - A unique constraint covering the columns `[nome_funcao]` on the table `funcoes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome_modulo]` on the table `modulos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome_perfil]` on the table `perfis` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome_transacao]` on the table `transacoes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "funcoes_nome_funcao_key" ON "funcoes"("nome_funcao");

-- CreateIndex
CREATE UNIQUE INDEX "modulos_nome_modulo_key" ON "modulos"("nome_modulo");

-- CreateIndex
CREATE UNIQUE INDEX "perfis_nome_perfil_key" ON "perfis"("nome_perfil");

-- CreateIndex
CREATE UNIQUE INDEX "transacoes_nome_transacao_key" ON "transacoes"("nome_transacao");
