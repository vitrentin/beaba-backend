import { Prisma, Perfil } from "@prisma/client";

export interface ProfilesRepository {
  findByName(name: string): Promise<Perfil | null>;
  searchMany(query: string, page: number): Promise<Perfil[]>;
  create(data: Prisma.PerfilCreateInput): Promise<Perfil>;
  //   create(data: Prisma.ModuloUncheckedCreateInput): Promise<Modulo>;
}
