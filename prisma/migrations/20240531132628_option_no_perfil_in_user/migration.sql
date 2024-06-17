-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_perfil_id_fkey";

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "perfil_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfis"("id_perfil") ON DELETE SET NULL ON UPDATE CASCADE;
