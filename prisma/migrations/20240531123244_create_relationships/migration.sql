/*
  Warnings:

  - Added the required column `perfil_id` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "perfil_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "perfil_modulo" (
    "id_perfil_modulo" SERIAL NOT NULL,
    "perfil_id" INTEGER NOT NULL,
    "modulo_id" INTEGER NOT NULL,

    CONSTRAINT "perfil_modulo_pkey" PRIMARY KEY ("id_perfil_modulo")
);

-- CreateTable
CREATE TABLE "transacao_modulo" (
    "id_transacao_modulo" SERIAL NOT NULL,
    "transacao_id" INTEGER NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "perfil_id" INTEGER,

    CONSTRAINT "transacao_modulo_pkey" PRIMARY KEY ("id_transacao_modulo")
);

-- CreateTable
CREATE TABLE "funcao_modulo" (
    "id_funcao_modulo" SERIAL NOT NULL,
    "funcao_id" INTEGER NOT NULL,
    "modulo_id" INTEGER NOT NULL,
    "perfil_id" INTEGER,

    CONSTRAINT "funcao_modulo_pkey" PRIMARY KEY ("id_funcao_modulo")
);

-- CreateIndex
CREATE UNIQUE INDEX "perfil_modulo_id_perfil_modulo_key" ON "perfil_modulo"("id_perfil_modulo");

-- CreateIndex
CREATE UNIQUE INDEX "transacao_modulo_id_transacao_modulo_key" ON "transacao_modulo"("id_transacao_modulo");

-- CreateIndex
CREATE UNIQUE INDEX "funcao_modulo_id_funcao_modulo_key" ON "funcao_modulo"("id_funcao_modulo");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_modulo" ADD CONSTRAINT "perfil_modulo_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_modulo" ADD CONSTRAINT "perfil_modulo_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id_modulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacao_modulo" ADD CONSTRAINT "transacao_modulo_transacao_id_fkey" FOREIGN KEY ("transacao_id") REFERENCES "transacoes"("id_transacao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacao_modulo" ADD CONSTRAINT "transacao_modulo_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id_modulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacao_modulo" ADD CONSTRAINT "transacao_modulo_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id_perfil") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcao_modulo" ADD CONSTRAINT "funcao_modulo_funcao_id_fkey" FOREIGN KEY ("funcao_id") REFERENCES "funcoes"("id_funcao") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcao_modulo" ADD CONSTRAINT "funcao_modulo_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id_modulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcao_modulo" ADD CONSTRAINT "funcao_modulo_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id_perfil") ON DELETE SET NULL ON UPDATE CASCADE;
