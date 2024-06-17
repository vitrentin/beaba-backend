/* eslint-disable @typescript-eslint/no-unused-vars */
import { FunctionsRepository } from "./../functions-repository";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class PrismaFunctionsRepository implements FunctionsRepository {
  async findByName(name: string) {
    const functions = await prisma.funcao.findUnique({
      where: {
        nome_funcao: name,
      },
    });
    return functions;
  }

  async searchMany(query: string, page: number) {
    const functions = await prisma.funcao.findMany({
      where: {
        nome_funcao: {
          contains: query,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return functions;
  }

  async create(data: Prisma.FuncaoCreateInput) {
    const functions = await prisma.funcao.create({
      data,
    });
    return functions;
  }
}
