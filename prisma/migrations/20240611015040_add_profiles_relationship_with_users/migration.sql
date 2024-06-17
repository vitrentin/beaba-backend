/*
  Warnings:

  - Made the column `perfil_id` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_perfil_id_fkey";

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "perfil_id" SET NOT NULL,
ALTER COLUMN "perfil_id" SET DEFAULT 2;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;
