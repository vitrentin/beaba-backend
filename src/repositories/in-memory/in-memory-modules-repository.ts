import { Prisma, Modulo } from "@prisma/client";
import { ModulesRepository } from "../modules-repository";
import { randomInt } from "node:crypto";

export class InMemoryModulesRepository implements ModulesRepository {
  public items: Modulo[] = [];

  async findByName(name: string) {
    const module = this.items.find((item) => item.nome_modulo === name);
    if (!module) {
      return null;
    }
    return module;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((items) => items.nome_modulo.includes(query))
      .slice((page - 1) * 10, page * 10);
  }

  async create(data: Prisma.ModuloCreateInput) {
    const module = {
      id_modulo: randomInt(100),
      nome_modulo: data.nome_modulo,
      descricao_modulo: data.descricao_modulo ?? null,
    };

    this.items.push(module);

    return module;
  }
}
