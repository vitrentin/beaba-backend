import { Prisma, Perfil } from "@prisma/client";
import { ProfilesRepository } from "./../profiles-repository";
import { randomInt } from "node:crypto";

export class InMemoryProfilesRepository implements ProfilesRepository {
  async searchMany(query: string, page: number) {
    return this.items
      .filter((items) => items.nome_perfil.includes(query))
      .slice((page - 1) * 10, page * 10);
  }

  public items: Perfil[] = [];

  async findByName(name: string) {
    const profile = this.items.find((item) => item.nome_perfil === name);
    if (!profile) {
      return null;
    }
    return profile;
  }

  async create(data: Prisma.PerfilCreateInput): Promise<Perfil> {
    const profile = {
      id_perfil: randomInt(100),
      nome_perfil: data.nome_perfil,
    };

    this.items.push(profile);

    return profile;
  }
}
