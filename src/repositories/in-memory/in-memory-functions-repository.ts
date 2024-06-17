import { Prisma, Funcao } from "@prisma/client";
import { FunctionsRepository } from "../functions-repository";
import { randomInt } from "node:crypto";

export class InMemoryFunctionRepository implements FunctionsRepository {
  public items: Funcao[] = [];

  async findByName(name: string) {
    const functions = this.items.find((item) => item.nome_funcao === name);
    if (!functions) {
      return null;
    }
    return functions;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((items) => items.nome_funcao.includes(query))
      .slice((page - 1) * 10, page * 10);
  }

  async create(data: Prisma.FuncaoCreateInput) {
    const functions = {
      id_funcao: randomInt(100),
      nome_funcao: data.nome_funcao,
      descricao_funcao: data.descricao_funcao ?? null,
    };

    this.items.push(functions);

    return functions;
  }
}
