/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModulesRepository } from "./../modules-repository";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class PrismaModulesRepository implements ModulesRepository {
  async findByName(name: string) {
    const module = await prisma.modulo.findUnique({
      where: {
        nome_modulo: name,
      },
    });
    return module;
  }

  async searchMany(query: string, page: number) {
    const module = await prisma.modulo.findMany({
      where: {
        nome_modulo: {
          contains: query,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return module;
  }

  async create(data: Prisma.ModuloCreateInput) {
    const module = await prisma.modulo.create({
      data,
    });
    return module;
  }
}
